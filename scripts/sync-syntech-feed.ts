import { and, eq, inArray, notInArray, sql } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import {
	brands,
	categories,
	productImages,
	productInventory,
	products,
	type ProductAttributes,
	type SupplierProductPayload,
} from "../db/schema";
import { getPoolDb, getPoolSql } from "../lib/db";

const SYNTECH_FEED_URL =
	"https://www.syntech.co.za/feeds/feedhandler.php?key=AF530A9A-22AE-4465-9F0D-B99D45E12E34&feed=syntech-json-full";
const SUPPLIER_NAME = "syntech";
const WAREHOUSE_CODES = [
	{ code: "CPT", field: "cptstock" },
	{ code: "JHB", field: "jhbstock" },
	{ code: "DBN", field: "dbnstock" },
] as const;

type WarehouseField = (typeof WAREHOUSE_CODES)[number]["field"];

type SyncOptions = {
	feedPath?: string;
	limit?: number;
	dryRun: boolean;
};

type LoadedFeed = {
	declaredCount: number | string | undefined;
	feedProducts: SyntechProduct[];
};

type SyntechFeed = {
	syntechstock?: {
		count?: number | string;
		products?: SyntechProduct[];
	};
};

type SyntechProduct = {
	sku?: string;
	name?: string;
	price?: number | string | false;
	rrp_incl?: number | string | false;
	recommended_margin?: number | string | false;
	promo_price?: number | string | false;
	promo_starts?: string | false;
	promo_ends?: string | false;
	cptstock?: number | string | false;
	jhbstock?: number | string | false;
	dbnstock?: number | string | false;
	nextshipmenteta?: string | false;
	url?: string;
	description?: string;
	shortdesc?: string;
	weight?: number | string | false;
	length?: number | string | false;
	width?: number | string | false;
	height?: number | string | false;
	featured_image?: string;
	additional_images?: string[] | false;
	all_images?: string | false;
	categories?: string;
	categoriesalt?: string;
	categorytree?: string;
	categorytreealt?: string;
	attributes?: Record<string, unknown>;
	last_modified?: string | false;
	[key: string]: unknown;
};

type CategoryRecord = {
	id: string;
	path: string;
};

type BrandRecord = {
	id: string;
	name: string;
};

type CategorySeed = {
	name: string;
	slug: string;
	path: string;
	depth: number;
	parentPath: string | null;
	sourcePath: string | null;
	sourcePathAlt: string | null;
};

function parseArgs(argv: string[]): SyncOptions {
	const options: SyncOptions = {
		feedPath: process.env.SYNTECH_FEED_PATH,
		dryRun: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];

		if (argument === "--dry-run") {
			options.dryRun = true;
			continue;
		}

		if (argument === "--feed-path") {
			options.feedPath = argv[index + 1];
			index += 1;
			continue;
		}

		if (argument.startsWith("--feed-path=")) {
			options.feedPath = argument.slice("--feed-path=".length);
			continue;
		}

		if (argument === "--limit") {
			options.limit = Number.parseInt(argv[index + 1] ?? "", 10);
			index += 1;
			continue;
		}

		if (argument.startsWith("--limit=")) {
			options.limit = Number.parseInt(argument.slice("--limit=".length), 10);
		}
	}

	if (options.limit !== undefined && (!Number.isFinite(options.limit) || options.limit <= 0)) {
		throw new Error("--limit must be a positive integer.");
	}

	return options;
}

function normalizeWhitespace(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
	return normalizeWhitespace(value)
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");
}

function decodeHtmlEntities(value: string) {
	const namedEntities: Record<string, string> = {
		amp: "&",
		apos: "'",
		gt: ">",
		lt: "<",
		nbsp: " ",
		quot: '"',
	};

	return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
		if (entity.startsWith("#x")) {
			const codePoint = Number.parseInt(entity.slice(2), 16);
			return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
		}

		if (entity.startsWith("#")) {
			const codePoint = Number.parseInt(entity.slice(1), 10);
			return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
		}

		return namedEntities[entity.toLowerCase()] ?? match;
	});
}

function stripHtml(value: string) {
	return normalizeWhitespace(decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")));
}

function clipText(value: string, maxLength: number) {
	if (value.length <= maxLength) {
		return value;
	}

	return `${value.slice(0, maxLength - 1).trimEnd()}...`;
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

function buildCategorySegments(product: SyntechProduct) {
	const sources = [
		product.categorytreealt?.split("/"),
		product.categorytree?.split(">"),
		product.categoriesalt?.split("|"),
		product.categories?.split(","),
	];

	for (const source of sources) {
		if (!source) {
			continue;
		}

		const parts = source.map((part) => normalizeWhitespace(part)).filter(Boolean);
		if (parts.length > 0) {
			return parts;
		}
	}

	return [];
}

function collectCategorySeeds(feedProducts: SyntechProduct[]) {
	const categorySeedMap = new Map<string, CategorySeed>();

	for (const product of feedProducts) {
		const segments = buildCategorySegments(product);
		if (segments.length === 0) {
			continue;
		}

		for (let index = 0; index < segments.length; index += 1) {
			const currentSegments = segments.slice(0, index + 1);
			const path = currentSegments.map(slugify).join("/");
			const parentSegments = currentSegments.slice(0, -1);
			const parentPath = parentSegments.length > 0 ? parentSegments.map(slugify).join("/") : null;

			categorySeedMap.set(path, {
				name: currentSegments.at(-1) ?? segments[index],
				slug: slugify(currentSegments.at(-1) ?? segments[index]),
				path,
				depth: currentSegments.length,
				parentPath,
				sourcePath: asNullableString(product.categorytree),
				sourcePathAlt: asNullableString(product.categorytreealt),
			});
		}
	}

	return [...categorySeedMap.values()].sort((left, right) => {
		if (left.depth !== right.depth) {
			return left.depth - right.depth;
		}

		return left.path.localeCompare(right.path);
	});
}

function extractImageUrls(product: SyntechProduct) {
	const orderedUrls = [
		asNullableString(product.featured_image),
		...(Array.isArray(product.additional_images)
			? product.additional_images.map((image) => asNullableString(image))
			: []),
		...(typeof product.all_images === "string"
			? product.all_images.split("|").map((image) => asNullableString(image))
			: []),
	].filter((value): value is string => Boolean(value));

	return [...new Set(orderedUrls)];
}

function extractSpecs(descriptionHtml: string) {
	const blocks = [...descriptionHtml.matchAll(/<h3>\s*(FEATURES|SPECIFICATIONS):?\s*<\/h3>([\s\S]*?)(?=<h3>|$)/gi)];
	const specs = new Set<string>();

	for (const block of blocks) {
		for (const item of block[2].matchAll(/<li>([\s\S]*?)<\/li>/gi)) {
			const text = clipText(stripHtml(item[1]), 180);
			if (text.length > 0) {
				specs.add(text);
			}
		}
	}

	return [...specs].slice(0, 12);
}

function buildSummary(product: SyntechProduct, descriptionText: string) {
	const shortDescription = asNullableString(stripHtml(product.shortdesc ?? ""));
	if (shortDescription) {
		return clipText(shortDescription, 220);
	}

	return descriptionText.length > 0 ? clipText(descriptionText, 220) : null;
}

function extractBrandName(product: SyntechProduct) {
	const brandValue = product.attributes?.brand;
	return brandValue === undefined || brandValue === null ? null : asNullableString(String(brandValue));
}

function buildRawAttributes(product: SyntechProduct): ProductAttributes {
	const entries = Object.entries(product.attributes ?? {});
	const normalizedEntries = entries.map(([key, value]) => {
		if (typeof value === "string") {
			return [key, asNullableString(value)];
		}

		if (typeof value === "number" || typeof value === "boolean") {
			return [key, value];
		}

		if (value === null) {
			return [key, null];
		}

		return [key, asNullableString(String(value))];
	});

	return Object.fromEntries(normalizedEntries);
}

function buildProductSlug(name: string, sku: string) {
	const nameSlug = slugify(name);
	const skuSlug = slugify(sku);

	if (!nameSlug) {
		return skuSlug;
	}

	if (nameSlug.includes(skuSlug)) {
		return nameSlug;
	}

	return `${nameSlug}-${skuSlug}`;
}

async function loadFeed(options: SyncOptions): Promise<LoadedFeed> {
	const rawFeed = options.feedPath
		? await readFile(options.feedPath, "utf8")
		: await fetchRemoteFeed();

	const parsedFeed = JSON.parse(rawFeed) as SyntechFeed;
	const allProducts = parsedFeed.syntechstock?.products ?? [];
	const feedProducts = typeof options.limit === "number" ? allProducts.slice(0, options.limit) : allProducts;

	return {
		declaredCount: parsedFeed.syntechstock?.count,
		feedProducts,
	};
}

async function fetchRemoteFeed() {
	const response = await fetch(SYNTECH_FEED_URL, {
		headers: {
			accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch Syntech feed: ${response.status} ${response.statusText}`);
	}

	return response.text();
}

function isMissingRelationError(error: unknown) {
	if (!(error instanceof Error)) {
		return false;
	}

	const withCause = error as Error & {
		cause?: {
			code?: string;
		};
	};

	return withCause.cause?.code === "42P01";
}

async function ensureCatalogSchema(db: { select: any }) {
	try {
		await db.select({ id: brands.id }).from(brands).limit(1);
		await db.select({ id: categories.id }).from(categories).limit(1);
		await db.select({ id: products.id }).from(products).limit(1);
	} catch (error) {
		if (isMissingRelationError(error)) {
			throw new Error("Catalog tables are missing. Run `pnpm run db:migrate` before `pnpm run catalog:sync`.", {
				cause: error,
			});
		}

		throw error;
	}
}

async function syncCatalog(loadedFeed: LoadedFeed) {
	const db = getPoolDb();
	const { declaredCount, feedProducts } = loadedFeed;
	const categorySeeds = collectCategorySeeds(feedProducts);
	const brandNames = [...new Set(feedProducts.map(extractBrandName).filter((brand): brand is string => Boolean(brand)))].sort(
		(left, right) => left.localeCompare(right),
	);

	await ensureCatalogSchema(db);

	console.log(
		`Loaded ${feedProducts.length} products from Syntech feed${declaredCount ? ` (supplier reported ${declaredCount})` : ""}.`,
	);
	console.log(`Prepared ${brandNames.length} brands and ${categorySeeds.length} category paths.`);

	const brandIdByName = new Map<string, string>();
	for (const brandName of brandNames) {
		const [brandRecord] = await db
			.insert(brands)
			.values({
				name: brandName,
				slug: slugify(brandName),
			})
			.onConflictDoUpdate({
				target: brands.name,
				set: {
					slug: slugify(brandName),
					updatedAt: new Date(),
				},
			})
			.returning({ id: brands.id, name: brands.name });

		brandIdByName.set(brandRecord.name, brandRecord.id);
	}

	const categoryIdByPath = new Map<string, string>();
	for (const categorySeed of categorySeeds) {
		const [categoryRecord] = await db
			.insert(categories)
			.values({
				name: categorySeed.name,
				slug: categorySeed.slug,
				path: categorySeed.path,
				depth: categorySeed.depth,
				parentId: categorySeed.parentPath ? categoryIdByPath.get(categorySeed.parentPath) ?? null : null,
				sourcePath: categorySeed.sourcePath,
				sourcePathAlt: categorySeed.sourcePathAlt,
			})
			.onConflictDoUpdate({
				target: categories.path,
				set: {
					name: categorySeed.name,
					slug: categorySeed.slug,
					depth: categorySeed.depth,
					parentId: categorySeed.parentPath ? categoryIdByPath.get(categorySeed.parentPath) ?? null : null,
					sourcePath: categorySeed.sourcePath,
					sourcePathAlt: categorySeed.sourcePathAlt,
					updatedAt: new Date(),
				},
			})
			.returning({ id: categories.id, path: categories.path });

		categoryIdByPath.set(categoryRecord.path, categoryRecord.id);
	}

	const seenSkus: string[] = [];

	const BATCH_SIZE = 50;
	for (let i = 0; i < feedProducts.length; i += BATCH_SIZE) {
		const chunk = feedProducts.slice(i, i + BATCH_SIZE);
		const productValues: any[] = [];
		const allImageValues: any[] = [];
		const allInventoryValues: any[] = [];

		for (const product of chunk) {
			const sku = asNullableString(product.sku);
			const title = asNullableString(product.name);
			if (!sku || !title) continue;

			seenSkus.push(sku);

			const categorySegments = buildCategorySegments(product);
			const categoryPath = categorySegments.length > 0 ? categorySegments.map(slugify).join("/") : null;
			const brandName = extractBrandName(product);
			const imageUrls = extractImageUrls(product);
			const descriptionHtml = asNullableString(product.description) ?? "";
			const descriptionText = stripHtml(descriptionHtml);
			const rawAttributes = buildRawAttributes(product);
			const totalStock = WAREHOUSE_CODES.reduce((sum, warehouse) => {
				return sum + (asNullableInteger(product[warehouse.field]) ?? 0);
			}, 0);
			const promoPrice = asNullableInteger(product.promo_price);
			const basePrice = asNullableInteger(product.price);

			productValues.push({
				supplier: SUPPLIER_NAME,
				supplierSku: sku,
				slug: buildProductSlug(title, sku),
				title,
				summary: buildSummary(product, descriptionText),
				shortDescription: asNullableString(stripHtml(product.shortdesc ?? "")),
				descriptionHtml,
				sourceUrl: asNullableString(product.url),
				brandId: brandName ? brandIdByName.get(brandName) ?? null : null,
				categoryId: categoryPath ? categoryIdByPath.get(categoryPath) ?? null : null,
				featuredImage: imageUrls[0] ?? null,
				price: basePrice ?? 0,
				rrpIncl: asNullableInteger(product.rrp_incl),
				promoPrice,
				recommendedMargin: asNullableNumber(product.recommended_margin),
				promoStartsAt: asNullableTimestamp(product.promo_starts),
				promoEndsAt: asNullableTimestamp(product.promo_ends),
				weightGrams: asNullableInteger(product.weight),
				lengthCm: asNullableNumber(product.length),
				widthCm: asNullableNumber(product.width),
				heightCm: asNullableNumber(product.height),
				ean:
					product.attributes?.ean === undefined || product.attributes?.ean === null
						? null
						: normalizeWhitespace(String(product.attributes.ean)),
				colour:
					product.attributes?.colour === undefined || product.attributes?.colour === null
						? null
						: asNullableString(String(product.attributes.colour)),
				warranty:
					product.attributes?.warranty === undefined || product.attributes?.warranty === null
						? null
						: asNullableString(String(product.attributes.warranty)),
				supplierFlags: promoPrice ? ["promo"] : [],
				totalStock,
				inStock: totalStock > 0,
				nextShipmentEta: asNullableString(typeof product.nextshipmenteta === "string" ? product.nextshipmenteta : ""),
				featured: promoPrice !== null,
				active: true,
				specs: extractSpecs(descriptionHtml),
				rawAttributes,
				rawPayload: product as SupplierProductPayload,
				supplierLastModified: asNullableTimestamp(product.last_modified),
				lastSyncedAt: new Date(),
			});

			// We'll handle images and inventory after we get the IDs back
		}

		if (productValues.length > 0) {
			const storedProducts = await db
				.insert(products)
				.values(productValues)
				.onConflictDoUpdate({
					target: [products.supplier, products.supplierSku],
					set: {
						slug: sql`excluded.slug`,
						title: sql`excluded.title`,
						summary: sql`excluded.summary`,
						shortDescription: sql`excluded.short_description`,
						descriptionHtml: sql`excluded.description_html`,
						sourceUrl: sql`excluded.source_url`,
						brandId: sql`excluded.brand_id`,
						categoryId: sql`excluded.category_id`,
						featuredImage: sql`excluded.featured_image`,
						price: sql`excluded.price`,
						rrpIncl: sql`excluded.rrp_incl`,
						promoPrice: sql`excluded.promo_price`,
						recommendedMargin: sql`excluded.recommended_margin`,
						promoStartsAt: sql`excluded.promo_starts_at`,
						promoEndsAt: sql`excluded.promo_ends_at`,
						weightGrams: sql`excluded.weight_grams`,
						lengthCm: sql`excluded.length_cm`,
						widthCm: sql`excluded.width_cm`,
						heightCm: sql`excluded.height_cm`,
						ean: sql`excluded.ean`,
						colour: sql`excluded.colour`,
						warranty: sql`excluded.warranty`,
						supplierFlags: sql`excluded.supplier_flags`,
						totalStock: sql`excluded.total_stock`,
						inStock: sql`excluded.in_stock`,
						nextShipmentEta: sql`excluded.next_shipment_eta`,
						featured: sql`excluded.featured`,
						active: sql`excluded.active`,
						specs: sql`excluded.specs`,
						rawAttributes: sql`excluded.raw_attributes`,
						rawPayload: sql`excluded.raw_payload`,
						supplierLastModified: sql`excluded.supplier_last_modified`,
						updatedAt: new Date(),
						lastSyncedAt: new Date(),
					},
				})
				.returning({ id: products.id, supplierSku: products.supplierSku });

			const productBySku = new Map(storedProducts.map((p) => [p.supplierSku, p.id]));

			for (const product of chunk) {
				const sku = asNullableString(product.sku);
				if (!sku) continue;
				const productId = productBySku.get(sku);
				if (!productId) continue;

				const imageUrls = extractImageUrls(product);
				imageUrls.forEach((url, position) => {
					allImageValues.push({
						productId,
						url,
						position,
						isPrimary: position === 0,
					});
				});

				WAREHOUSE_CODES.forEach((warehouse) => {
					allInventoryValues.push({
						productId,
						warehouseCode: warehouse.code,
						quantity: asNullableInteger(product[warehouse.field]) ?? 0,
					});
				});
			}

			// Batch related tables
			const productIds = storedProducts.map((p) => p.id);
			if (productIds.length > 0) {
				await db.delete(productImages).where(inArray(productImages.productId, productIds));
				if (allImageValues.length > 0) {
					await db.insert(productImages).values(allImageValues);
				}

				await db.delete(productInventory).where(inArray(productInventory.productId, productIds));
				if (allInventoryValues.length > 0) {
					await db.insert(productInventory).values(allInventoryValues);
				}
			}
		}

		console.log(`Synced ${Math.min(i + BATCH_SIZE, feedProducts.length)}/${feedProducts.length} products.`);
	}

	if (seenSkus.length > 0) {
		await db
			.update(products)
			.set({
				active: false,
				inStock: false,
				totalStock: 0,
				updatedAt: new Date(),
			})
			.where(and(eq(products.supplier, SUPPLIER_NAME), notInArray(products.supplierSku, seenSkus)));
	}

	console.log(`Catalog sync complete. ${seenSkus.length} Syntech SKUs are active.`);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	const loadedFeed = await loadFeed(options);
	const { declaredCount, feedProducts } = loadedFeed;
	const categorySeeds = collectCategorySeeds(feedProducts);
	const brandNames = [...new Set(feedProducts.map(extractBrandName).filter((brand): brand is string => Boolean(brand)))];

	if (options.dryRun) {
		console.log(
			JSON.stringify(
				{
					declaredCount,
					loadedProducts: feedProducts.length,
					brands: brandNames.length,
					categoryPaths: categorySeeds.length,
					firstSku: feedProducts[0]?.sku ?? null,
				},
				null,
				2,
			),
		);
		return;
	}

	await syncCatalog(loadedFeed);
	await getPoolSql().end();
}

main().catch(async (error) => {
	console.error(error);
	await getPoolSql().end();
	process.exitCode = 1;
});