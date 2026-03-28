import { syncSyntechStockUpdateFeed } from "@/lib/syntech-stock-sync";

function isAuthorized(request: Request) {
	const cronSecret = process.env.CRON_SECRET;
	if (!cronSecret) {
		return true;
	}

	const authHeader = request.headers.get("authorization");
	return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
	if (!isAuthorized(request)) {
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
