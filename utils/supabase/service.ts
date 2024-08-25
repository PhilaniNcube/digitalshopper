import type { Database } from "@/schema";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Cookie {
	name: string;
	value: string;
	options?: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[key: string]: any;
	};
}

export function createClient() {
	const cookieStore = cookies();

	// Create a server's supabase client with newly configured cookie,
	// which could be used to maintain user's session
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			cookies: {
				// @ts-ignore
				getAll() {
					return cookieStore.getAll();
				},
				// @ts-ignore
				setAll(cookiesToSet: Cookie[]) {
					try {
						// biome-ignore lint/complexity/noForEach: <explanation>
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}
