import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

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
	throw new Error("Missing source Neon/Postgres connection string (DATABASE_URL).");
}

const sourceClient = neon(sourceUrl);
const sourceQuery = sourceClient.query as (
	query: string,
	params?: unknown[],
) => Promise<Record<string, unknown>[]>;

const DUMP_DIR = "migration-dump-payload";

async function main() {
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
	writeFileSync(`${DUMP_DIR}/_counts.json`, JSON.stringify(counts, null, 2));
	console.log("Done. Counts:", counts);
}

main().catch((error) => {
	console.error("Dump failed:", error);
	process.exitCode = 1;
});
