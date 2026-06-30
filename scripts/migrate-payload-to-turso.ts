import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { getTableColumns, sql } from "drizzle-orm";
import { getPayload } from "payload";
import config from "../payload.config";

const env = process.env as Record<string, string | undefined>;
env.NODE_ENV = "development";
env.PAYLOAD_MIGRATING = "false";

function parseEnv(filePath: string): Record<string, string> {
	if (!existsSync(filePath)) return {};
	const contents = readFileSync(filePath, "utf8");
	const entries = contents
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith("#"))
		.map((line) => {
			const separatorIndex = line.indexOf("=");
			if (separatorIndex === -1) return null;
			const key = line.slice(0, separatorIndex).trim();
			let value = line.slice(separatorIndex + 1).trim();
			if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			return [key, value] as const;
		})
		.filter((entry): entry is readonly [string, string] => entry !== null);
	return Object.fromEntries(entries);
}

const fileEnv = { ...parseEnv(".env"), ...parseEnv(".env.local") };

const sourceUrl =
	process.env.DATABASE_URL ??
	process.env.POSTGRES_URL ??
	process.env.POSTGRES_PRISMA_URL ??
	process.env.NEON_DATABASE_URL ??
	fileEnv.DATABASE_URL ??
	fileEnv.POSTGRES_URL ??
	fileEnv.POSTGRES_PRISMA_URL ??
	fileEnv.NEON_DATABASE_URL;

if (!sourceUrl) {
	throw new Error("Missing source Neon/Postgres connection string (DATABASE_URL) for Payload source DB.");
}

const sourceClient = neon(sourceUrl);
const sourceQuery = sourceClient.query as (
	query: string,
	params?: unknown[],
) => Promise<Record<string, unknown>[]>;

const DUMP_DIR = "migration-dump-payload";

async function dumpPayloadFromNeon(): Promise<Record<string, number>> {
	const tableRows = (await sourceQuery(
		"SELECT tablename FROM pg_tables WHERE schemaname = 'payload' ORDER BY tablename",
	)) as { tablename: string }[];
	const tableNames = tableRows.map((row) => row.tablename);
	console.log(`Neon 'payload' schema tables (${tableNames.length}):`, tableNames);

	mkdirSync(DUMP_DIR, { recursive: true });
	const counts: Record<string, number> = {};
	for (const name of tableNames) {
		const rows = (await sourceQuery(`SELECT * FROM payload."${name}"`)) as Record<string, unknown>[];
		writeFileSync(`${DUMP_DIR}/${name}.json`, JSON.stringify(rows));
		counts[name] = rows.length;
		console.log(`  dumped ${name}: ${rows.length} rows`);
	}
	return counts;
}

function transformValue(value: unknown, dataType: string): unknown {
	if (value === null || value === undefined) return null;
	if (dataType === "json" && typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
			try {
				return JSON.parse(trimmed);
			} catch {
				return value;
			}
		}
	}
	return value;
}

async function main() {
	console.log("=== Phase 1: dump Payload tables from Neon ===");
	const sourceCounts = await dumpPayloadFromNeon();

	console.log("\n=== Phase 2: boot Payload against Turso (creates SQLite schema) ===");
	const payload = await getPayload({ config });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const drizzle = payload.db.drizzle as any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tables = payload.db.tables as Record<string, any>;

	console.log("Disabling foreign keys for load...");
	await payload.db.execute({ drizzle, raw: "PRAGMA foreign_keys = OFF;" });

	console.log("\n=== Phase 3: insert dumped rows into Turso ===");
	const destCounts: Record<string, number> = {};
	const tableNames = Object.keys(tables).sort();
	for (const tableName of tableNames) {
		if (tableName === "payload_migrations") {
			console.log(`  skipping ${tableName} (managed by Payload)`);
			continue;
		}
		const dumpPath = `${DUMP_DIR}/${tableName}.json`;
		if (!existsSync(dumpPath)) {
			console.log(`  SKIP ${tableName}: no source dump (new table not in old Neon DB)`);
			continue;
		}
		const tableObj = tables[tableName] as unknown as Parameters<typeof getTableColumns>[0];
		const columns = getTableColumns(tableObj);
		const snakeToCamel: Record<string, string> = {};
		const dataTypeByKey: Record<string, string> = {};
		for (const [camelKey, column] of Object.entries(columns)) {
			snakeToCamel[column.name] = camelKey;
			dataTypeByKey[camelKey] = column.dataType;
		}

		const rawRows = JSON.parse(readFileSync(dumpPath, "utf8")) as Record<string, unknown>[];
		if (rawRows.length === 0) {
			destCounts[tableName] = 0;
			console.log(`  ${tableName}: 0 rows (empty source)`);
			continue;
		}

		const mapped = rawRows.map((row) => {
			const obj: Record<string, unknown> = {};
			for (const [snakeKey, value] of Object.entries(row)) {
				const camelKey = snakeToCamel[snakeKey];
				if (!camelKey) continue;
				obj[camelKey] = transformValue(value, dataTypeByKey[camelKey]);
			}
			return obj;
		});

		const batchSize = 50;
		for (let i = 0; i < mapped.length; i += batchSize) {
			await drizzle.insert(tableObj).values(mapped.slice(i, i + batchSize));
		}
		destCounts[tableName] = mapped.length;
		console.log(`  ${tableName}: ${mapped.length} rows inserted`);
	}

	console.log("Re-enabling foreign keys...");
	await payload.db.execute({ drizzle, raw: "PRAGMA foreign_keys = ON;" });

	console.log("\n=== Reconciliation ===");
	let allOk = true;
	for (const name of Object.keys(sourceCounts)) {
		if (name === "payload_migrations") continue;
		const dest = destCounts[name] ?? 0;
		const ok = sourceCounts[name] === dest;
		if (!ok) allOk = false;
		console.log(`  ${name}: source=${sourceCounts[name]} dest=${dest} ${ok ? "OK" : "MISMATCH"}`);
	}
	const orphanDest = Object.keys(destCounts).filter((n) => !(n in sourceCounts) && n !== "payload_migrations");
	if (orphanDest.length) console.log("  Turso tables with no source dump (new):", orphanDest);
	console.log(allOk ? "\nPayload migration complete: all tables match." : "\nPayload migration complete WITH MISMATCHES — review above.");
}

main().catch(async (error) => {
	console.error("Payload migration failed:", error);
	process.exitCode = 1;
});
