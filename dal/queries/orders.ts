import "server-only";

import { count, desc } from "drizzle-orm";
import { orders } from "@/db/schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export type OrderListItem = typeof orders.$inferSelect;

export type OrderPaginationMeta = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type PaginatedOrdersResult = {
	items: OrderListItem[];
	pagination: OrderPaginationMeta;
};

export async function getOrders(
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedOrdersResult> {
	await requireAdmin();

	const safePage = Math.max(1, Math.floor(page));
	const safePageSize = Math.max(1, Math.min(Math.floor(pageSize), MAX_PAGE_SIZE));
	const offset = (safePage - 1) * safePageSize;

	const [items, [{ total }]] = await Promise.all([
		db
			.select()
			.from(orders)
			.orderBy(desc(orders.createdAt))
			.limit(safePageSize)
			.offset(offset),
		db.select({ total: count() }).from(orders),
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
