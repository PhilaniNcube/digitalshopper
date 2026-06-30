import { existsSync, readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { getTableColumns, type Table } from "drizzle-orm";
import * as schema from "../db/schema";
import { db, libsqlClient } from "../lib/db";

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
	throw new Error(
		"Missing source Neon/Postgres connection string. Set DATABASE_URL (or POSTGRES_URL/NEON_DATABASE_URL) in .env.local to point at the old Neon database.",
	);
}

const sourceClient = neon(sourceUrl);
const sourceSql = sourceClient.query as (
	query: string,
	params?: unknown[],
) => Promise<Record<string, unknown>[]>;

type TableEntry = readonly [string, Table];
const tables: readonly TableEntry[] = [
	["user", schema.user],
	["brands", schema.brands],
	["categories", schema.categories],
	["session", schema.session],
	["account", schema.account],
	["verification", schema.verification],
	["products", schema.products],
	["product_images", schema.productImages],
	["product_inventory", schema.productInventory],
	["orders", schema.orders],
];

function transformValue(value: unknown, dataType: string): unknown {
	if (value === null || value === undefined) return null;
	if (dataType === "date") return new Date(value as string);
	if (dataType === "json") {
		if (typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		}
		return value;
	}
	return value;
}

async function migrateTable(tableName: string, tableObj: Table, insertBatchSize: number): Promise<number> {
	const columns = getTableColumns(tableObj);
	const snakeToCamel: Record<string, string> = {};
	const dataTypeByKey: Record<string, string> = {};
	for (const [camelKey, column] of Object.entries(columns)) {
		snakeToCamel[column.name] = camelKey;
		dataTypeByKey[camelKey] = column.dataType;
	}

	let total = 0;
	const readPageSize = 500;
	for (let offset = 0; ; offset += readPageSize) {
		const rows = (await sourceSql(`SELECT * FROM "${tableName}" ORDER BY id LIMIT $1 OFFSET $2`, [
			readPageSize,
			offset,
		])) as Record<string, unknown>[];
		if (rows.length === 0) break;

		const mapped = rows.map((row) => {
			const obj: Record<string, unknown> = {};
			for (const [snakeKey, value] of Object.entries(row)) {
				const camelKey = snakeToCamel[snakeKey];
				if (!camelKey) continue;
				obj[camelKey] = transformValue(value, dataTypeByKey[camelKey]);
			}
			return obj;
		});

		for (let i = 0; i < mapped.length; i += insertBatchSize) {
			await db.insert(tableObj).values(mapped.slice(i, i + insertBatchSize));
		}

		total += rows.length;
		console.log(`  ${tableName}: ${total} rows migrated`);
		if (rows.length < readPageSize) break;
	}
	return total;
}

async function main() {
	console.log("Source (Neon):", sourceUrl.replace(/\/\/[^@]+@/, "//***@"));
	console.log("Reading source row counts...");
	const sourceCounts: Record<string, number> = {};
	for (const [name] of tables) {
		const rows = (await sourceSql(`SELECT count(*) AS c FROM "${name}"`)) as { c: number }[];
		sourceCounts[name] = Number(rows[0]?.c ?? 0);
	}
	console.log("Source counts:", sourceCounts);

	console.log("Disabling foreign keys for load...");
	await libsqlClient.execute("PRAGMA foreign_keys = OFF;");

	const destCounts: Record<string, number> = {};
	for (const [name, tableObj] of tables) {
		console.log(`Migrating ${name}...`);
		const insertBatchSize = name === "products" ? 25 : 50;
		destCounts[name] = await migrateTable(name, tableObj, insertBatchSize);
	}

	console.log("Re-enabling foreign keys...");
	await libsqlClient.execute("PRAGMA foreign_keys = ON;");

	console.log("\nReconciliation:");
	let allOk = true;
	for (const [name] of tables) {
		const ok = sourceCounts[name] === destCounts[name];
		if (!ok) allOk = false;
		console.log(`  ${name}: source=${sourceCounts[name]} dest=${destCounts[name]} ${ok ? "OK" : "MISMATCH"}`);
	}
	console.log(allOk ? "\nMigration complete: all tables match." : "\nMigration complete WITH MISMATCHES — review above.");

	await libsqlClient.close();
}

main().catch(async (error) => {
	console.error("Migration failed:", error);
	try {
		await libsqlClient.execute("PRAGMA foreign_keys = ON;");
	} catch {
		// ignore
	}
	await libsqlClient.close();
	process.exitCode = 1;
});
