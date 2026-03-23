import * as schema from "@/db/schema";
import { db } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/email";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";

const appUrl =
	process.env.BETTER_AUTH_URL ??
	process.env.NEXT_PUBLIC_SITE_URL ??
	"http://localhost:3000";

export const auth = betterAuth({
	baseURL: appUrl,
	secret:
		process.env.BETTER_AUTH_SECRET ??
		process.env.AUTH_SECRET ??
		"digitalshopper-local-secret-change-before-production-2026",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			void sendResetPasswordEmail({
				to: user.email,
				resetUrl: url,
				userName: user.name,
			});
		},
	},
	plugins: [
		adminPlugin({
			defaultRole: "user",
		}),
		nextCookies(),
	],
});