import "server-only";

import { count, eq, sql, sum, type SQL } from "drizzle-orm";
import { categories, orders, products, user } from "@/db/schema";
import { db, libsqlClient } from "@/lib/db";
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
	await requireAdmin();
	const result = await libsqlClient.execute(`
    SELECT
      (SELECT count(*) FROM products) as productCount,
      (SELECT count(*) FROM products WHERE active = 1) as activeProductCount,
      (SELECT count(*) FROM products WHERE in_stock = 1) as inStockProductCount,
      (SELECT count(*) FROM categories) as categoryCount,
      (SELECT count(*) FROM "user") as userCount,
      (SELECT count(*) FROM orders) as orderCount,
      (SELECT count(*) FROM orders WHERE status = 'pending') as pendingOrderCount,
      (SELECT count(*) FROM orders WHERE status = 'paid') as paidOrderCount,
      (SELECT count(*) FROM orders WHERE status = 'failed') as failedOrderCount,
      (SELECT count(*) FROM orders WHERE status = 'cancelled') as cancelledOrderCount,
      (SELECT coalesce(sum(total),0) FROM orders WHERE status = 'paid') as paidRevenue
  `);
	const row = result.rows[0] as unknown as Record<string, number>;
	return {
		productCount: Number(row.productCount ?? 0),
		activeProductCount: Number(row.activeProductCount ?? 0),
		inStockProductCount: Number(row.inStockProductCount ?? 0),
		categoryCount: Number(row.categoryCount ?? 0),
		userCount: Number(row.userCount ?? 0),
		orderCount: Number(row.orderCount ?? 0),
		pendingOrderCount: Number(row.pendingOrderCount ?? 0),
		paidOrderCount: Number(row.paidOrderCount ?? 0),
		failedOrderCount: Number(row.failedOrderCount ?? 0),
		cancelledOrderCount: Number(row.cancelledOrderCount ?? 0),
		paidRevenue: Number(row.paidRevenue ?? 0),
	};
}
