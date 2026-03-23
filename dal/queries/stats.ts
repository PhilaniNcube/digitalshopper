import "server-only";

import { count, eq, sql, sum, type SQL } from "drizzle-orm";
import { categories, orders, products, user } from "@/db/schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type DashboardOrderStatus = typeof orders.$inferSelect.status;

export type DashboardOverviewStats = {
	productCount: number;
	activeProductCount: number;
	inStockProductCount: number;
	categoryCount: number;
	userCount: number;
	orderCount: number;
	pendingOrderCount: number;
	paidOrderCount: number;
	failedOrderCount: number;
	cancelledOrderCount: number;
	paidRevenue: number;
};

async function countProducts(where?: SQL<unknown>) {
	await requireAdmin();

	const query = db.select({ total: count() }).from(products);
	const [row] = where ? await query.where(where) : await query;

	return Number(row?.total ?? 0);
}

async function countOrders(where?: SQL<unknown>) {
	await requireAdmin();

	const query = db.select({ total: count() }).from(orders);
	const [row] = where ? await query.where(where) : await query;

	return Number(row?.total ?? 0);
}

async function getPaidOrderRevenue() {
	await requireAdmin();

	const [row] = await db
		.select({ total: sql<number>`coalesce(${sum(orders.total)}, 0)` })
		.from(orders)
		.where(eq(orders.status, "paid"));

	return Number(row?.total ?? 0);
}

export async function getDashboardProductCount() {
	return countProducts();
}

export async function getDashboardActiveProductCount() {
	return countProducts(eq(products.active, true));
}

export async function getDashboardInStockProductCount() {
	return countProducts(eq(products.inStock, true));
}

export async function getDashboardCategoryCount() {
	await requireAdmin();

	const [row] = await db.select({ total: count() }).from(categories);

	return Number(row?.total ?? 0);
}

export async function getDashboardUserCount() {
	await requireAdmin();

	const [row] = await db.select({ total: count() }).from(user);

	return Number(row?.total ?? 0);
}

export async function getDashboardOrderCount() {
	return countOrders();
}

export async function getDashboardPendingOrderCount() {
	return countOrders(eq(orders.status, "pending"));
}

export async function getDashboardPaidOrderCount() {
	return countOrders(eq(orders.status, "paid"));
}

export async function getDashboardFailedOrderCount() {
	return countOrders(eq(orders.status, "failed"));
}

export async function getDashboardCancelledOrderCount() {
	return countOrders(eq(orders.status, "cancelled"));
}

export async function getDashboardPaidRevenue() {
	return getPaidOrderRevenue();
}

export async function getDashboardOverviewStats(): Promise<DashboardOverviewStats> {
	const [
		productCount,
		activeProductCount,
		inStockProductCount,
		categoryCount,
		userCount,
		orderCount,
		pendingOrderCount,
		paidOrderCount,
		failedOrderCount,
		cancelledOrderCount,
		paidRevenue,
	] = await Promise.all([
		getDashboardProductCount(),
		getDashboardActiveProductCount(),
		getDashboardInStockProductCount(),
		getDashboardCategoryCount(),
		getDashboardUserCount(),
		getDashboardOrderCount(),
		getDashboardPendingOrderCount(),
		getDashboardPaidOrderCount(),
		getDashboardFailedOrderCount(),
		getDashboardCancelledOrderCount(),
		getDashboardPaidRevenue(),
	]);

	return {
		productCount,
		activeProductCount,
		inStockProductCount,
		categoryCount,
		userCount,
		orderCount,
		pendingOrderCount,
		paidOrderCount,
		failedOrderCount,
		cancelledOrderCount,
		paidRevenue,
	};
}
