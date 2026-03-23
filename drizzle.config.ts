import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

function parseEnvFile(filePath: string) {
	if (!existsSync(filePath)) {
		return {} as Record<string, string>;
	}

	const contents = readFileSync(filePath, "utf8");
	const entries = contents
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith("#"))
		.map((line) => {
			const separatorIndex = line.indexOf("=");
			if (separatorIndex === -1) {
				return null;
			}

			const key = line.slice(0, separatorIndex).trim();
			let value = line.slice(separatorIndex + 1).trim();

			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			return [key, value] as const;
		})
		.filter((entry): entry is readonly [string, string] => entry !== null);

	return Object.fromEntries(entries);
}

const fileEnv = {
	...parseEnvFile(".env"),
	...parseEnvFile(".env.local"),
};

const connectionString =
	process.env.DATABASE_URL ??
	process.env.POSTGRES_URL ??
	process.env.POSTGRES_PRISMA_URL ??
	process.env.POSTGRES_URL_NON_POOLING ??
	process.env.NEON_DATABASE_URL ??
	process.env.NEON_DATABASE_URL_UNPOOLED ??
	fileEnv.DATABASE_URL ??
	fileEnv.POSTGRES_URL ??
	fileEnv.POSTGRES_PRISMA_URL ??
	fileEnv.POSTGRES_URL_NON_POOLING ??
	fileEnv.NEON_DATABASE_URL ??
	fileEnv.NEON_DATABASE_URL_UNPOOLED;

if (!connectionString) {
	throw new Error("Missing Neon/Postgres connection string for Drizzle.");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
	strict: true,
	verbose: true,
});