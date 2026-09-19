import { revalidateTag } from "next/cache";
import { CATEGORIES_CACHE_TAG, PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";

const ALLOWED_TAGS = new Set<string>([PRODUCTS_CACHE_TAG, CATEGORIES_CACHE_TAG]);

function isAuthorized(request: Request) {
	const secret = process.env.CRON_SECRET;
	const authHeader = request.headers.get("authorization");

	return Boolean(secret) && authHeader === `Bearer ${secret}`;
}

export async function POST(request: Request) {
	if (!(await isAuthorized(request))) {
		return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
	}

	let tag: string | undefined;

	try {
		const body = (await request.json()) as { tag?: unknown };
		if (typeof body.tag === "string") {
			tag = body.tag;
		}
	} catch {
		tag = undefined;
	}

	tag ??= new URL(request.url).searchParams.get("tag") ?? undefined;

	if (!tag || !ALLOWED_TAGS.has(tag)) {
		return Response.json({ ok: false, message: "Invalid or missing tag." }, { status: 400 });
	}

	revalidateTag(tag, "max");

	return Response.json({ ok: true, tag });
}
