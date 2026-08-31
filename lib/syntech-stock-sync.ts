import { and, eq, inArray, sql } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import { productInventory, products } from "@/db/schema";
import { db, libsqlClient } from "@/lib/db";

export const SUPPLIER_NAME = "syntech";
export const DEFAULT_UPDATE_FEED_URL =
	"https://www.syntech.co.za/feeds/feedhandler.php?key=AF530A9A-22AE-4465-9F0D-B99D45E12E34&feed=syntech-json-update";

const WAREHOUSE_CODES = [
	{ code: "CPT", field: "cptstock" },
	{ code: "JHB", field: "jhbstock" },
	{ code: "DBN", field: "dbnstock" },
] as const;

type SyntechFeed = {
	syntechstock?: {
		count?: number | string;
		products?: SyntechStockProduct[];
	};
};

type SyntechStockProduct = {
	sku?: string;
	cptstock?: number | string | false;
	jhbstock?: number | string | false;
	dbnstock?: number | string | false;
	nextshipmenteta?: string | false;
	last_modified?: string | false;
	price?: number | string | false;
	rrp_incl?: number | string | false;
	promo_price?: number | string | false;
	promo_starts?: string | false;
	promo_ends?: string | false;
	[key: string]: unknown;
};

type LoadedFeed = {
	declaredCount: number | string | undefined;
	feedProducts: SyntechStockProduct[];
};

export type StockSyncInput = {
	feedPath?: string;
	feedUrl?: string;
	limit?: number;
};

export type StockSyncSummary = {
	declaredCount: number | string | undefined;
	loadedProducts: number;
	updatedProductCount: number;
	updatedInventoryRows: number;
	unmatchedSkuCount: number;
};

function normalizeWhitespace(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function asNullableString(value: unknown) {
	if (typeof value !== "string") {
		return null;
	}
	const normalized = normalizeWhitespace(value);
	return normalized.length > 0 ? normalized : null;
}

function asNullableNumber(value: unknown) {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : null;
	}
	if (typeof value === "string") {
		const normalized = value.replace(/,/g, "").trim();
		if (normalized.length === 0) {
			return null;
		}
		const parsed = Number(normalized);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function asNullableInteger(value: unknown) {
	const parsed = asNullableNumber(value);
	return parsed === null ? null : Math.round(parsed);
}

function asNullableTimestamp(value: unknown) {
	if (typeof value !== "string") {
		return null;
	}
	const normalized = normalizeWhitespace(value);
	if (normalized.length === 0) {
		return null;
	}
	const parsed = new Date(normalized.replace(" ", "T"));
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function fetchRemoteFeed(feedUrl?: string) {
	const response = await fetch(feedUrl ?? process.env.SYNTECH_STOCK_FEED_URL ?? DEFAULT_UPDATE_FEED_URL, {
		headers: {
			accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch Syntech stock update feed: ${response.status} ${response.statusText}`);
	}
	return response.text();
}

async function loadFeed(input: StockSyncInput): Promise<LoadedFeed> {
	const rawFeed = input.feedPath ? await readFile(input.feedPath, "utf8") : await fetchRemoteFeed(input.feedUrl);
	const parsedFeed = JSON.parse(rawFeed) as SyntechFeed;
	const allProducts = parsedFeed.syntechstock?.products ?? [];
	const feedProducts = typeof input.limit === "number" ? allProducts.slice(0, input.limit) : allProducts;
	return {
		declaredCount: parsedFeed.syntechstock?.count,
		feedProducts,
	};
}

export async function getSyntechStockFeedPreview(input: StockSyncInput = {}) {
	const { declaredCount, feedProducts } = await loadFeed(input);
	return {
		declaredCount,
		loadedProducts: feedProducts.length,
		firstSku: feedProducts[0]?.sku ?? null,
	};
}

export async function syncSyntechStockUpdateFeed(input: StockSyncInput = {}): Promise<StockSyncSummary> {
	const { declaredCount, feedProducts } = await loadFeed(input);
	const rowsToProcess = feedProducts
		.map((product) => {
			const sku = asNullableString(product.sku);
			if (!sku) {
				return null;
			}
			const warehouseQuantities = WAREHOUSE_CODES.map((warehouse) => ({
				warehouseCode: warehouse.code,
				quantity: asNullableInteger(product[warehouse.field]) ?? 0,
			}));
			const totalStock = warehouseQuantities.reduce((sum, warehouse) => sum + warehouse.quantity, 0);
			return {
				sku,
				totalStock,
				inStock: totalStock > 0,
				price: asNullableInteger(product.price) ?? 0,
				rrpIncl: asNullableInteger(product.rrp_incl),
				promoPrice: asNullableInteger(product.promo_price),
				promoStartsAt: asNullableTimestamp(product.promo_starts),
				promoEndsAt: asNullableTimestamp(product.promo_ends),
				nextShipmentEta: asNullableString(typeof product.nextshipmenteta === "string" ? product.nextshipmenteta : ""),
				supplierLastModified: asNullableTimestamp(product.last_modified),
				warehouseQuantities,
			};
		})
		.filter((row): row is NonNullable<typeof row> => row !== null);

	if (rowsToProcess.length === 0) {
		return {
			declaredCount,
			loadedProducts: feedProducts.length,
			updatedProductCount: 0,
			updatedInventoryRows: 0,
			unmatchedSkuCount: 0,
		};
	}

	const skuList = [...new Set(rowsToProcess.map((row) => row.sku))];
	const existingProducts = await db
		.select({
			id: products.id,
			supplierSku: products.supplierSku,
		})
		.from(products)
		.where(and(eq(products.supplier, SUPPLIER_NAME), inArray(products.supplierSku, skuList)));

	const productIdBySku = new Map(existingProducts.map((product) => [product.supplierSku, product.id]));

	type PendingUpdate = (typeof rowsToProcess)[number] & { productId: string };
	const pendingUpdates: PendingUpdate[] = [];
	let unmatchedSkuCount = 0;

	for (const row of rowsToProcess) {
		const productId = productIdBySku.get(row.sku);
		if (!productId) {
			unmatchedSkuCount += 1;
			continue;
		}
		pendingUpdates.push({ ...row, productId });
	}

	if (pendingUpdates.length === 0) {
		return {
			declaredCount,
			loadedProducts: feedProducts.length,
			updatedProductCount: 0,
			updatedInventoryRows: 0,
			unmatchedSkuCount,
		};
	}

	const now = new Date();
	const toEpoch = (d: Date | null) => (d ? Math.floor(d.getTime() / 1000) : null);

	const stmts: { sql: string; args: unknown[] }[] = [];
	for (const row of pendingUpdates) {
		stmts.push({
			sql: `UPDATE products SET total_stock = ?, in_stock = ?, price = ?, rrp_incl = ?, promo_price = ?, promo_starts_at = ?, promo_ends_at = ?, next_shipment_eta = ?, supplier_last_modified = ?, last_synced_at = ?, updated_at = ? WHERE id = ?`,
			args: [
				row.totalStock,
				row.inStock ? 1 : 0,
				row.price,
				row.rrpIncl,
				row.promoPrice,
				toEpoch(row.promoStartsAt),
				toEpoch(row.promoEndsAt),
				row.nextShipmentEta,
				toEpoch(row.supplierLastModified),
				Math.floor(now.getTime() / 1000),
				Math.floor(now.getTime() / 1000),
				row.productId,
			],
		});
	}

	const inventoryValues: { productId: string; warehouseCode: "CPT" | "JHB" | "DBN"; quantity: number }[] = [];
	for (const row of pendingUpdates) {
		for (const w of row.warehouseQuantities) {
			inventoryValues.push({ productId: row.productId, warehouseCode: w.warehouseCode as "CPT" | "JHB" | "DBN", quantity: w.quantity });
		}
	}

	const WRITE_BATCH_SIZE = 500;
	for (let i = 0; i < stmts.length; i += WRITE_BATCH_SIZE) {
		const batch = stmts.slice(i, i + WRITE_BATCH_SIZE);
		await libsqlClient.batch(batch as never[], "write");
	}

	const INV_BATCH = 900;
	for (let i = 0; i < inventoryValues.length; i += INV_BATCH) {
		const batchValues = inventoryValues.slice(i, i + INV_BATCH);
		await db
			.insert(productInventory)
			.values(batchValues)
			.onConflictDoUpdate({
				target: [productInventory.productId, productInventory.warehouseCode],
				set: {
					quantity: sql`excluded.quantity`,
					updatedAt: now,
				},
			});
	}

	return {
		declaredCount,
		loadedProducts: feedProducts.length,
		updatedProductCount: pendingUpdates.length,
		updatedInventoryRows: inventoryValues.length,
		unmatchedSkuCount,
	};
}
