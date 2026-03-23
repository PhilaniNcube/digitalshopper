import "server-only";

import { cacheLife } from "next/cache";
import { and, asc, desc, eq, ilike, inArray, like, or, sql, type SQL } from "drizzle-orm";
import {
	brands,
	categories,
	type Brand,
	type Category,
	type Product,
	type ProductImage,
	type ProductInventory,
	products,
} from "@/db/schema";
import { db } from "@/lib/db";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export type ProductWithImagesAndInventory = Product & {
	brand: Brand | null;
	category: Category | null;
	images: ProductImage[];
	inventory: ProductInventory[];
};

export type ProductListItem = Product & {
	brand: Brand | null;
	category: Category | null;
	mainImage: string | null;
};

export type ProductPaginationOptions = {
	page?: number;
	pageSize?: number;
};

export type ProductPaginationMeta = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type PaginatedProductsResult = {
	items: ProductListItem[];
	pagination: ProductPaginationMeta;
};

export type ProductCatalogSort = "featured" | "price-asc" | "price-desc";

export type ProductCatalogFilters = ProductPaginationOptions & {
	q?: string;
	category?: string;
	sort?: ProductCatalogSort;
	stock?: "all" | "in-stock";
};

type NormalizedPagination = {
	page: number;
	pageSize: number;
	offset: number;
};

const ACTIVE_PRODUCTS_FILTER = eq(products.active, true);

function normalizePagination(options: ProductPaginationOptions = {}): NormalizedPagination {
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

function buildPaginationMeta(totalItems: number, pagination: NormalizedPagination): ProductPaginationMeta {
	const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.pageSize);

	return {
		page: pagination.page,
		pageSize: pagination.pageSize,
		totalItems,
		totalPages,
		hasPreviousPage: pagination.page > 1,
		hasNextPage: totalPages > pagination.page,
	};
}

function combineFilters(...conditions: Array<SQL<unknown> | undefined>) {
	const definedConditions = conditions.filter((condition): condition is SQL<unknown> => Boolean(condition));

	if (definedConditions.length === 0) {
		return undefined;
	}

	if (definedConditions.length === 1) {
		return definedConditions[0];
	}

	return and(...definedConditions);
}

function mapProductListItem(product: Product & { brand: Brand | null; category: Category | null }): ProductListItem {
	return {
		...product,
		mainImage: product.featuredImage,
	};
}

async function countProducts(where?: SQL<unknown>) {
	const rows = where
		? await db.select({ count: sql<number>`count(*)` }).from(products).where(where)
		: await db.select({ count: sql<number>`count(*)` }).from(products);

	return Number(rows[0]?.count ?? 0);
}

async function fetchPaginatedProducts(where: SQL<unknown> | undefined, options: ProductPaginationOptions = {}) {
	return fetchSortedPaginatedProducts(where, "featured", options);
}

async function fetchSortedPaginatedProducts(
	where: SQL<unknown> | undefined,
	sort: ProductCatalogSort,
	options: ProductPaginationOptions = {},
) {
	const pagination = normalizePagination(options);

	const [items, totalItems] = await Promise.all([
		db.query.products.findMany({
			where,
			with: {
				brand: true,
				category: true,
			},
			orderBy: (product) => {
				switch (sort) {
					case "price-asc":
						return [asc(product.price), asc(product.title)];
					case "price-desc":
						return [desc(product.price), asc(product.title)];
					default:
						return [desc(product.featured), desc(product.inStock), desc(product.createdAt), asc(product.title)];
				}
			},
			limit: pagination.pageSize,
			offset: pagination.offset,
		}),
		countProducts(where),
	]);

	return {
		items: items.map(mapProductListItem),
		pagination: buildPaginationMeta(totalItems, pagination),
	} satisfies PaginatedProductsResult;
}

async function fetchDescendantCategoryIdsByPaths(paths: string[]) {
	const uniquePaths = [...new Set(paths.filter(Boolean))];

	if (uniquePaths.length === 0) {
		return [] as string[];
	}

	const conditions = uniquePaths.flatMap((path) => [eq(categories.path, path), like(categories.path, `${path}/%`)]);
	const rows = await db
		.select({ id: categories.id })
		.from(categories)
		.where(or(...conditions));

	return rows.map((row) => row.id);
}

function emptyPaginatedProducts(options: ProductPaginationOptions = {}): PaginatedProductsResult {
	const pagination = normalizePagination(options);

	return {
		items: [],
		pagination: buildPaginationMeta(0, pagination),
	};
}

function normalizeSearchTerm(value?: string) {
	return value?.trim() ?? "";
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithImagesAndInventory | null> {
	"use cache";
	cacheLife("hours");

	const product = await db.query.products.findFirst({
		where: eq(products.slug, slug),
		with: {
			brand: true,
			category: true,
			images: {
				orderBy: (image, operators) => [asc(image.position)],
			},
			inventory: {
				orderBy: (inventory, operators) => [asc(inventory.warehouseCode)],
			},
		},
	});

	return product ?? null;
}

export async function fetchProductById(id: string): Promise<ProductWithImagesAndInventory | null> {
	const product = await db.query.products.findFirst({
		where: eq(products.id, id),
		with: {
			brand: true,
			category: true,
			images: {
				orderBy: (image, operators) => [asc(image.position)],
			},
			inventory: {
				orderBy: (inventory, operators) => [asc(inventory.warehouseCode)],
			},
		},
	});

	return product ?? null;
}

export async function fetchProducts(options: ProductPaginationOptions = {}): Promise<PaginatedProductsResult> {
	return fetchPaginatedProducts(ACTIVE_PRODUCTS_FILTER, options);
}

export async function fetchCatalogProducts(filters: ProductCatalogFilters = {}): Promise<PaginatedProductsResult> {
	const normalizedQuery = normalizeSearchTerm(filters.q);
	const normalizedCategory = normalizeSearchTerm(filters.category);
	const sort = filters.sort ?? "featured";
	const stock = filters.stock ?? "all";
	const searchPattern = normalizedQuery.length > 0 ? `%${normalizedQuery}%` : undefined;

	let categoryFilter: SQL<unknown> | undefined;

	if (normalizedCategory && normalizedCategory !== "all") {
		const categoryRows = await db
			.select({ path: categories.path })
			.from(categories)
			.where(eq(categories.slug, normalizedCategory));

		if (categoryRows.length === 0) {
			return emptyPaginatedProducts(filters);
		}

		const categoryIds = await fetchDescendantCategoryIdsByPaths(categoryRows.map((category) => category.path));

		if (categoryIds.length === 0) {
			return emptyPaginatedProducts(filters);
		}

		categoryFilter = inArray(products.categoryId, categoryIds);
	}

	const searchFilter = searchPattern
		? or(
				ilike(products.title, searchPattern),
				ilike(products.summary, searchPattern),
				ilike(products.shortDescription, searchPattern),
				ilike(products.slug, searchPattern),
				ilike(products.supplierSku, searchPattern),
			)
		: undefined;

	const stockFilter = stock === "in-stock" ? eq(products.inStock, true) : undefined;

	return fetchSortedPaginatedProducts(
		combineFilters(ACTIVE_PRODUCTS_FILTER, categoryFilter, searchFilter, stockFilter),
		sort,
		filters,
	);
}

export async function fetchProductsByCategoryId(
	categoryId: string,
	options: ProductPaginationOptions = {},
): Promise<PaginatedProductsResult> {
	const [category] = await db
		.select({ path: categories.path })
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		return emptyPaginatedProducts(options);
	}

	const categoryIds = await fetchDescendantCategoryIdsByPaths([category.path]);

	if (categoryIds.length === 0) {
		return emptyPaginatedProducts(options);
	}

	return fetchPaginatedProducts(
		combineFilters(ACTIVE_PRODUCTS_FILTER, inArray(products.categoryId, categoryIds)),
		options,
	);
}

export async function fetchProductsByCategorySlug(
	categorySlug: string,
	options: ProductPaginationOptions = {},
): Promise<PaginatedProductsResult> {
	const categoryRows = await db
		.select({ path: categories.path })
		.from(categories)
		.where(eq(categories.slug, categorySlug));

	if (categoryRows.length === 0) {
		return emptyPaginatedProducts(options);
	}

	const categoryIds = await fetchDescendantCategoryIdsByPaths(categoryRows.map((category) => category.path));

	if (categoryIds.length === 0) {
		return emptyPaginatedProducts(options);
	}

	return fetchPaginatedProducts(
		combineFilters(ACTIVE_PRODUCTS_FILTER, inArray(products.categoryId, categoryIds)),
		options,
	);
}

export async function fetchProductsByBrandSlug(
	brandSlug: string,
	options: ProductPaginationOptions = {},
): Promise<PaginatedProductsResult> {
	const [brand] = await db
		.select({ id: brands.id })
		.from(brands)
		.where(eq(brands.slug, brandSlug))
		.limit(1);

	if (!brand) {
		return emptyPaginatedProducts(options);
	}

	return fetchPaginatedProducts(
		combineFilters(ACTIVE_PRODUCTS_FILTER, eq(products.brandId, brand.id)),
		options,
	);
}

export async function fetchFeaturedProducts(limit: number): Promise<ProductListItem[]> {
	const productsData = await db.query.products.findMany({
		where: and(ACTIVE_PRODUCTS_FILTER, eq(products.featured, true), eq(products.inStock, true)),
		limit,
		orderBy: (products) => [desc(products.createdAt)],
	});

	return productsData.map((product) => ({
		...product,
		brand: null,
		category: null,
		mainImage: product.featuredImage,
	}));
}
