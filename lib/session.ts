import { auth } from "@/lib/auth";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SessionRoleUser = {
	role?: string | string[] | null;
	name?: string | null;
	email?: string | null;
};

export const getSession = cache(async () => {
	return auth.api.getSession({
		headers: await headers(),
	});
});

export async function requireUser() {
	const session = await getSession();

	if (!session) {
		redirect("/sign-in");
	}

	return session;
}

export async function requireAdmin() {
	const session = await requireUser();
	const roleValue = (session.user as SessionRoleUser).role;
	const roles = Array.isArray(roleValue)
		? roleValue
		: typeof roleValue === "string"
			? roleValue.split(",").map((role) => role.trim())
			: [];

	if (!roles.includes("admin")) {
		redirect("/");
	}

	return session;
}