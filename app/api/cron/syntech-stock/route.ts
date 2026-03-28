import { auth } from "@/lib/auth";
import { syncSyntechStockUpdateFeed } from "@/lib/syntech-stock-sync";

type SessionRoleUser = {
	role?: string | string[] | null;
};

function hasAdminRole(roleValue: SessionRoleUser["role"]) {
	const roles = Array.isArray(roleValue)
		? roleValue
		: typeof roleValue === "string"
			? roleValue.split(",").map((role) => role.trim())
			: [];

	return roles.includes("admin");
}

async function isAuthorized(request: Request) {
	const cronSecret = process.env.CRON_SECRET;
	const authHeader = request.headers.get("authorization");

	if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
		return true;
	}

	const session = await auth.api.getSession({ headers: request.headers });
	const roleValue = (session?.user as SessionRoleUser | undefined)?.role;

	return hasAdminRole(roleValue);
}

export async function GET(request: Request) {
	if (!(await isAuthorized(request))) {
		return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(request.url);
	const limitParam = url.searchParams.get("limit");
	const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

	if (limit !== undefined && (!Number.isFinite(limit) || limit <= 0)) {
		return Response.json({ ok: false, message: "Invalid limit query parameter." }, { status: 400 });
	}

	try {
		const result = await syncSyntechStockUpdateFeed({ limit });

		return Response.json({
			ok: true,
			message: "Syntech stock sync completed.",
			result,
		});
	} catch (error) {
		console.error("Syntech stock cron failed", error);
		return Response.json({ ok: false, message: "Stock sync failed." }, { status: 500 });
	}
}
