"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.digitalshopper.co.za";

export const authClient = createAuthClient({
	baseURL,
	plugins: [adminClient()],
});