import "server-only";

import { count, desc, eq, inArray, type SQL } from "drizzle-orm";
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

type OrderPaginationOptions = {
	page?: number;
	pageSize?: number;
};

const SHIPPING_ORDER_FILTER = eq(orders.status, "paid");

const PAYMENT_ORDER_FILTER = inArray(orders.status, ["pending", "paid", "failed"]);

function normalizePagination(options: OrderPaginationOptions = {}) {
	const rawPage = Number(options.page ?? DEFAULT_PAGE);
	const rawPageSize = Number(options.pageSize ?? DEFAULT_PAGE_SIZE);

	const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : DEFAULT_PAGE;
	const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0
		? Math.min(Math.floor(rawPageSize), MAX_PAGE_SIZE)
		: DEFAULT_PAGE_SIZE;

	return {
		page,
		pageSize,
		offset: (page - 1) * pageSize,
	};
}

function buildPaginationMeta(totalItems: number, page: number, pageSize: number): OrderPaginationMeta {
	const totalPages = Math.ceil(totalItems / pageSize);

	return {
		page,
		pageSize,
		totalItems,
		totalPages,
		hasPreviousPage: page > 1,
		hasNextPage: page < totalPages,
	};
}

async function getPaginatedOrders(
	filter: SQL<unknown> | undefined,
	options: OrderPaginationOptions = {},
): Promise<PaginatedOrdersResult> {
	await requireAdmin();

	const pagination = normalizePagination(options);

	const ordersQuery = db
		.select()
		.from(orders)
		.orderBy(desc(orders.createdAt))
		.limit(pagination.pageSize)
		.offset(pagination.offset);

	const totalQuery = db.select({ total: count() }).from(orders);

	const [items, [{ total }]] = await Promise.all([
		filter ? ordersQuery.where(filter) : ordersQuery,
		filter ? totalQuery.where(filter) : totalQuery,
	]);

	return {
		items,
		pagination: buildPaginationMeta(total, pagination.page, pagination.pageSize),
	};
}

export async function getOrders(
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedOrdersResult> {
	return getPaginatedOrders(undefined, { page, pageSize });
}

export async function getShippingOrders(
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedOrdersResult> {
	return getPaginatedOrders(SHIPPING_ORDER_FILTER, { page, pageSize });
}

export async function getPaymentOrders(
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedOrdersResult> {
	return getPaginatedOrders(PAYMENT_ORDER_FILTER, { page, pageSize });
}
