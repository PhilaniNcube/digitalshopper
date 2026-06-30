import { existsSync, readFileSync } from "node:fs";
import * as schema from "@/db/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

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

function resolveTursoUrl() {
	const fileEnv = {
		...parseEnvFile(".env"),
		...parseEnvFile(".env.local"),
	};

	return (
		process.env.TURSO_DATABASE_URL ??
		process.env.DATABASE_URL ??
		fileEnv.TURSO_DATABASE_URL ??
		fileEnv.DATABASE_URL
	);
}

function resolveTursoAuthToken() {
	const fileEnv = {
		...parseEnvFile(".env"),
		...parseEnvFile(".env.local"),
	};

	return (
		process.env.TURSO_AUTH_TOKEN ??
		process.env.DATABASE_AUTH_TOKEN ??
		fileEnv.TURSO_AUTH_TOKEN ??
		fileEnv.DATABASE_AUTH_TOKEN
	);
}

const url = resolveTursoUrl();
const authToken = resolveTursoAuthToken();

if (!url) {
	throw new Error("Missing Turso connection string (TURSO_DATABASE_URL).");
}

/**
 * libSQL/Turso client. HTTP-based, so there is no connection pool to manage —
 * a single client is reused for all queries (stateless serverless friendly).
 *
 * Note: Turso enforces foreign keys server-side by default, so no
 * `PRAGMA foreign_keys = ON` is needed (and HTTP connections don't persist
 * connection-level PRAGMAs anyway).
 */
export const libsqlClient = createClient({
	url,
	authToken,
});

/**
 * Default Drizzle instance for Server Components, Route Handlers, and the DAL.
 */
export const db = drizzle({ client: libsqlClient, schema });
