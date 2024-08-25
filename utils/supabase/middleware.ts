import type { Database } from "@/schema";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface Cookie {
	name: string;
	value: string;
	options?: {
		[key: string]: string | number | boolean;
	};
}


export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
        // @ts-ignore
				getAll() {
					return request.cookies.getAll();
				},
        // @ts-ignore
				setAll(cookiesToSet) {
					// biome-ignore lint/complexity/noForEach: <explanation>
					cookiesToSet.forEach(({ name, value, options }:Cookie) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					// biome-ignore lint/complexity/noForEach: <explanation>
					cookiesToSet.forEach(({ name, value, options }:Cookie) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// refreshing the auth token
	await supabase.auth.getUser();

	return supabaseResponse;
}