import { existsSync, readFileSync } from "node:fs";
import * as schema from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePool } from "drizzle-orm/postgres-js";
import postgres from "postgres";

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

function resolveDatabaseUrl() {
	const fileEnv = {
		...parseEnvFile(".env"),
		...parseEnvFile(".env.local"),
	};

	return (
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
		fileEnv.NEON_DATABASE_URL_UNPOOLED
	);
}

const connectionString = resolveDatabaseUrl();

if (!connectionString) {
	throw new Error("Missing Neon/Postgres connection string.");
}

/**
 * Stateless HTTP-based database client.
 * Best for Next.js Server Components, Route Handlers, and serverless environments.
 * Does not maintain persistent TCP connections.
 */
const httpClient = neon(connectionString);
export const db = drizzleHttp(httpClient, { schema });

let internalPoolSql: ReturnType<typeof postgres> | undefined;
let internalPoolDb: ReturnType<typeof drizzlePool> | undefined;

export function getPoolSql() {
	if (!internalPoolSql) {
		internalPoolSql = postgres(connectionString, {
			prepare: false,
			max: 1,
			idle_timeout: 10,
			connect_timeout: 15,
		});
	}
	return internalPoolSql;
}

export function getPoolDb() {
	if (!internalPoolDb) {
		internalPoolDb = drizzlePool(getPoolSql(), { schema });
	}
	return internalPoolDb;
}


