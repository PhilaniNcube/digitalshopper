import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

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
const tursoUrl = process.env.TURSO_PAYLOAD_DATABASE_URL ?? fileEnv.TURSO_PAYLOAD_DATABASE_URL;
const tursoToken = process.env.TURSO_PAYLOAD_AUTH_TOKEN ?? fileEnv.TURSO_PAYLOAD_AUTH_TOKEN;
if (!tursoUrl) throw new Error("Missing TURSO_PAYLOAD_DATABASE_URL");

const turso = createClient({ url: tursoUrl, authToken: tursoToken });
const scratch = createClient({ url: "file:payload-scratch.db" });
const DUMP_DIR = "migration-dump-payload";

type MasterRow = { name: string; type: string; sql: string };
type TableInfoRow = { name: string; type: string };

async function applySchemaFromScratch() {
	const rows = (await scratch.execute(
		"SELECT name, type, sql FROM sqlite_master WHERE type IN ('table','index') AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type DESC, name",
	)) as unknown as { rows: MasterRow[] };
	const objects = rows.rows;
	console.log(`Payload schema objects in scratch DB: ${objects.length}`);
	const tableNames = objects.filter((o) => o.type === "table").map((o) => o.name);
	console.log("Tables:", tableNames);

	await turso.execute("PRAGMA foreign_keys = OFF;");
	for (const obj of objects) {
		await turso.execute(obj.sql);
	}
	await turso.execute("PRAGMA foreign_keys = ON;");
	console.log("Schema applied to Turso.");
	return tableNames;
}

function convertValue(value: unknown, declaredType: string): unknown {
	if (value === null || value === undefined) return null;
	const t = declaredType.toLowerCase();
	if (t === "integer") {
		if (typeof value === "boolean") return value ? 1 : 0;
		if (value instanceof Date) return Math.floor(value.getTime() / 1000);
		if (typeof value === "number") return value;
		const n = Number(value);
		return Number.isNaN(n) ? value : n;
	}
	if (t === "real") {
		if (typeof value === "number") return value;
		const n = Number(value);
		return Number.isNaN(n) ? value : n;
	}
	if (t === "numeric") {
		if (typeof value === "boolean") return value ? 1 : 0;
		if (typeof value === "number") return value;
		const n = Number(value);
		return Number.isNaN(n) ? value : n;
	}
	// text (covers text, json, enum, timestamp-as-text)
	if (typeof value === "object") return JSON.stringify(value);
	if (typeof value === "boolean") return value ? "true" : "false";
	if (typeof value === "number") return String(value);
	return value;
}

async function loadTable(tableName: string): Promise<number> {
	const dumpPath = `${DUMP_DIR}/${tableName}.json`;
	if (!existsSync(dumpPath)) {
		console.log(`  SKIP ${tableName}: no source dump (new Payload table)`);
		return 0;
	}
	const rawRows = JSON.parse(readFileSync(dumpPath, "utf8")) as Record<string, unknown>[];
	if (rawRows.length === 0) {
		console.log(`  ${tableName}: 0 rows (empty source)`);
		return 0;
	}

	const info = (await turso.execute(`PRAGMA table_info("${tableName}")`)) as unknown as {
		rows: TableInfoRow[];
	};
	const columns = info.rows.map((r) => ({ name: r.name, type: r.type }));
	const colList = columns.map((c) => `"${c.name}"`).join(", ");
	const placeholders = columns.map(() => "?").join(", ");
	const insertSql = `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders})`;

	const stmts = rawRows.map((row) => ({
		sql: insertSql,
		args: columns.map((c) => convertValue(row[c.name], c.type)),
	}));

	const BATCH = 50;
	for (let i = 0; i < stmts.length; i += BATCH) {
		await turso.batch(stmts.slice(i, i + BATCH) as never);
	}
	console.log(`  ${tableName}: ${rawRows.length} rows inserted`);
	return rawRows.length;
}

async function main() {
	console.log("=== Applying Payload schema from scratch DB to Turso ===");
	const tableNames = await applySchemaFromScratch();

	console.log("\n=== Loading Payload data from Neon dumps ===");
	await turso.execute("PRAGMA foreign_keys = OFF;");
	const sourceCounts: Record<string, number> = existsSync(`${DUMP_DIR}/_counts.json`)
		? JSON.parse(readFileSync(`${DUMP_DIR}/_counts.json`, "utf8"))
		: {};
	const destCounts: Record<string, number> = {};
	for (const name of tableNames) {
		if (name === "payload_migrations") {
			console.log(`  skipping ${name} (Payload-managed)`);
			continue;
		}
		destCounts[name] = await loadTable(name);
	}
	await turso.execute("PRAGMA foreign_keys = ON;");

	console.log("\n=== Reconciliation ===");
	let allOk = true;
	for (const name of Object.keys(sourceCounts)) {
		if (name === "payload_migrations") continue;
		const dest = destCounts[name] ?? 0;
		const ok = sourceCounts[name] === dest;
		if (!ok) allOk = false;
		console.log(`  ${name}: source=${sourceCounts[name]} dest=${dest} ${ok ? "OK" : "MISMATCH"}`);
	}
	console.log(allOk ? "\nPayload migration complete: all tables match." : "\nPayload migration complete WITH MISMATCHES.");

	await turso.close();
	await scratch.close();
}

main().catch(async (error) => {
	console.error("Payload load failed:", error);
	try { await turso.execute("PRAGMA foreign_keys = ON;"); } catch { /* ignore */ }
	await turso.close();
	await scratch.close();
	process.exitCode = 1;
});
