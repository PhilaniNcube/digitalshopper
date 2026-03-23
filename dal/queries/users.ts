import "server-only";

import { count } from "drizzle-orm";
import { user } from "@/db/schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export type UserListItem = typeof user.$inferSelect;

export type UserPaginationMeta = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type PaginatedUsersResult = {
	items: UserListItem[];
	pagination: UserPaginationMeta;
};

export async function getUsers(
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedUsersResult> {
	await requireAdmin();

	const safePage = Math.max(1, Math.floor(page));
	const safePageSize = Math.max(1, Math.min(Math.floor(pageSize), MAX_PAGE_SIZE));
	const offset = (safePage - 1) * safePageSize;

	const [items, [{ total }]] = await Promise.all([
		db
			.select()
			.from(user)
			.orderBy(user.createdAt)
			.limit(safePageSize)
			.offset(offset),
		db.select({ total: count() }).from(user),
	]);

	const totalItems = total;
	const totalPages = Math.ceil(totalItems / safePageSize);

	return {
		items,
		pagination: {
			page: safePage,
			pageSize: safePageSize,
			totalItems,
			totalPages,
			hasPreviousPage: safePage > 1,
			hasNextPage: safePage < totalPages,
		},
	};
}