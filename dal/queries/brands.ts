import "server-only";

import { count, desc } from "drizzle-orm";
import { brands } from "@/db/schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export type BrandListItem = typeof brands.$inferSelect;

export type BrandPaginationOptions = {
	page?: number;
	pageSize?: number;
};

export type BrandPaginationMeta = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type PaginatedBrandsResult = {
	items: BrandListItem[];
	pagination: BrandPaginationMeta;
};

function normalizePagination(options: BrandPaginationOptions = {}) {
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

function buildPaginationMeta(totalItems: number, page: number, pageSize: number): BrandPaginationMeta {
	const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

	return {
		page,
		pageSize,
		totalItems,
		totalPages,
		hasPreviousPage: page > 1,
		hasNextPage: totalPages > page,
	};
}

export async function getAdminBrands(
	options: BrandPaginationOptions = {},
): Promise<PaginatedBrandsResult> {
	await requireAdmin();

	const pagination = normalizePagination(options);

	const [items, [{ total }]] = await Promise.all([
		db
			.select()
			.from(brands)
			.orderBy(desc(brands.createdAt), brands.name)
			.limit(pagination.pageSize)
			.offset(pagination.offset),
		db.select({ total: count() }).from(brands),
	]);

	return {
		items,
		pagination: buildPaginationMeta(total, pagination.page, pagination.pageSize),
	};
}
