import "server-only";

import { and, asc, count, eq, gt, ilike, lte, or, sql, sum } from "drizzle-orm";
import { productInventory, products } from "@/db/schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function getInStockProductCount() {
	await requireAdmin();

	const [row] = await db
		.select({ total: count() })
		.from(products)
		.where(eq(products.inStock, true));

	return Number(row?.total ?? 0);
}

export async function getOutOfStockProductCount() {
	await requireAdmin();

	const [row] = await db
		.select({ total: count() })
		.from(products)
		.where(eq(products.inStock, false));

	return Number(row?.total ?? 0);
}

const LOW_STOCK_THRESHOLD = 5;

export async function getLowStockProductCount() {
	await requireAdmin();

	const [row] = await db
		.select({ total: count() })
		.from(products)
		.where(
			and(gt(products.totalStock, 0), lte(products.totalStock, LOW_STOCK_THRESHOLD)),
		);

	return Number(row?.total ?? 0);
}

export async function getTotalUnitCount() {
	await requireAdmin();

	const [row] = await db
		.select({
			total: sql<number>`coalesce(${sum(productInventory.quantity)}, 0)`,
		})
		.from(productInventory);

	return Number(row?.total ?? 0);
}

export type WarehouseBreakdown = {
	warehouseCode: "CPT" | "JHB" | "DBN";
	totalUnits: number;
	productCount: number;
};

export async function getWarehouseBreakdown(): Promise<WarehouseBreakdown[]> {
	await requireAdmin();

	const rows = await db
		.select({
			warehouseCode: productInventory.warehouseCode,
			totalUnits: sql<number>`coalesce(${sum(productInventory.quantity)}, 0)`,
			productCount: sql<number>`count(case when ${productInventory.quantity} > 0 then 1 end)`,
		})
		.from(productInventory)
		.groupBy(productInventory.warehouseCode)
		.orderBy(asc(productInventory.warehouseCode));

	return rows.map((r) => ({
		warehouseCode: r.warehouseCode,
		totalUnits: Number(r.totalUnits),
		productCount: Number(r.productCount),
	}));
}

export type LowStockProduct = {
	id: string;
	title: string;
	supplierSku: string;
	featuredImage: string | null;
	totalStock: number;
	inStock: boolean;
	nextShipmentEta: string | null;
	cpt: number;
	jhb: number;
	dbn: number;
};

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
	await requireAdmin();

	const rows = await db
		.select({
			id: products.id,
			title: products.title,
			supplierSku: products.supplierSku,
			featuredImage: products.featuredImage,
			totalStock: products.totalStock,
			inStock: products.inStock,
			nextShipmentEta: products.nextShipmentEta,
			cpt: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'CPT' then ${productInventory.quantity} end), 0)`,
			jhb: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'JHB' then ${productInventory.quantity} end), 0)`,
			dbn: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'DBN' then ${productInventory.quantity} end), 0)`,
		})
		.from(products)
		.leftJoin(productInventory, eq(products.id, productInventory.productId))
		.where(lte(products.totalStock, LOW_STOCK_THRESHOLD))
		.groupBy(
			products.id,
			products.title,
			products.supplierSku,
			products.featuredImage,
			products.totalStock,
			products.inStock,
			products.nextShipmentEta,
		)
		.orderBy(asc(products.totalStock), asc(products.title))
		.limit(50);

	return rows.map((r) => ({
		...r,
		cpt: Number(r.cpt),
		jhb: Number(r.jhb),
		dbn: Number(r.dbn),
	}));
}

export async function searchInventoryProducts(
	q: string,
): Promise<LowStockProduct[]> {
	await requireAdmin();

	if (!q.trim()) return [];

	const searchPattern = `%${q.trim()}%`;

	const rows = await db
		.select({
			id: products.id,
			title: products.title,
			supplierSku: products.supplierSku,
			featuredImage: products.featuredImage,
			totalStock: products.totalStock,
			inStock: products.inStock,
			nextShipmentEta: products.nextShipmentEta,
			cpt: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'CPT' then ${productInventory.quantity} end), 0)`,
			jhb: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'JHB' then ${productInventory.quantity} end), 0)`,
			dbn: sql<number>`coalesce(max(case when ${productInventory.warehouseCode} = 'DBN' then ${productInventory.quantity} end), 0)`,
		})
		.from(products)
		.leftJoin(productInventory, eq(products.id, productInventory.productId))
		.where(
			or(
				ilike(products.title, searchPattern),
				ilike(products.supplierSku, searchPattern),
			),
		)
		.groupBy(
			products.id,
			products.title,
			products.supplierSku,
			products.featuredImage,
			products.totalStock,
			products.inStock,
			products.nextShipmentEta,
		)
		.orderBy(asc(products.title))
		.limit(20);

	return rows.map((r) => ({
		...r,
		cpt: Number(r.cpt),
		jhb: Number(r.jhb),
		dbn: Number(r.dbn),
	}));
}

