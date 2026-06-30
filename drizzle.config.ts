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

const url =
	process.env.TURSO_DATABASE_URL ??
	fileEnv.TURSO_DATABASE_URL ??
	process.env.DATABASE_URL ??
	fileEnv.DATABASE_URL;

const authToken =
	process.env.TURSO_AUTH_TOKEN ??
	fileEnv.TURSO_AUTH_TOKEN ??
	process.env.DATABASE_AUTH_TOKEN ??
	fileEnv.DATABASE_AUTH_TOKEN;

if (!url) {
	throw new Error("Missing Turso connection string (TURSO_DATABASE_URL).");
}
if (!authToken) {
	throw new Error("Missing Turso auth token (TURSO_AUTH_TOKEN).");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		url,
		authToken,
	},
	strict: true,
	verbose: true,
});
