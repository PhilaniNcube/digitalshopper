import { requireAdmin } from "@/lib/session";

/**
 * Server component that enforces admin access.
 * Renders nothing — redirects non-admin users before any page content loads.
 */
export async function AdminGuard() {
	await requireAdmin();
	return null;
}
