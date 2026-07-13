import { categoryPageCache } from "@/app/(public)/categories/search-params";
import { CategoryGridPagination } from "@/components/products/category-grid-pagination";
import { ProductCard } from "@/components/products/product-card";
import { getCategoryBySlug } from "@/dal/queries/categories";
import { fetchProductsByCategorySlug } from "@/dal/queries/products";
import { decodeHtmlEntities } from "@/lib/utils";
import { Boxes, PackageCheck, SearchX } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

const CATEGORY_PAGE_SIZE = 12;

function getVisiblePages(currentPage: number, totalPages: number) {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const visiblePages: Array<number | "ellipsis"> = [1];
	const windowStart = Math.max(2, currentPage - 1);
	const windowEnd = Math.min(totalPages - 1, currentPage + 1);

	if (windowStart > 2) {
		visiblePages.push("ellipsis");
	}

	for (let page = windowStart; page <= windowEnd; page += 1) {
		visiblePages.push(page);
	}

	if (windowEnd < totalPages - 1) {
		visiblePages.push("ellipsis");
	}

	visiblePages.push(totalPages);

	return visiblePages;
}

export async function CategoryProducts({
	paramsPromise,
	searchParamsPromise,
}: {
	paramsPromise: Promise<{ categoryslug: string }>;
	searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { categoryslug } = await paramsPromise;
	const { page } = await categoryPageCache.parse(searchParamsPromise);

	const category = await getCategoryBySlug(categoryslug);

	if (!category) {
		notFound();
	}

	const normalizedCategoryName = decodeHtmlEntities(category.name);
	const products = await fetchProductsByCategorySlug(categoryslug, {
		page,
		pageSize: CATEGORY_PAGE_SIZE,
	});

	const currentPage = products.pagination.page;
	const totalPages = Math.max(products.pagination.totalPages, 1);
	const visiblePages = getVisiblePages(currentPage, totalPages);

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<nav className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
				<Link href="/categories" className="shrink-0 transition hover:text-white">
					Categories
				</Link>
				<span className="shrink-0">/</span>
				<span className="min-w-0 truncate text-slate-400">{normalizedCategoryName}</span>
			</nav>

			<section className="relative overflow-hidden bg-surface-low px-6 py-8 ring-1 ring-white/6 sm:px-8 lg:px-10 lg:py-10">
				<p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
					{decodeHtmlEntities(category.path)}
				</p>
				<h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
					{normalizedCategoryName}
				</h1>
				<p className="mt-4 max-w-3xl text-lg leading-7 text-slate-400">
					Browse every {normalizedCategoryName.toLowerCase()} item in the live catalog.
				</p>
			</section>

			<div id="category-results-top" className="grid gap-6">
				<section className="rounded-[2rem] bg-surface-low p-5 ring-1 ring-white/6 sm:p-6">
					<div className="grid gap-3 sm:grid-cols-2 lg:max-w-md">
						<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
							<p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
								<Boxes className="size-3.5 text-primary-strong" />
								Results
							</p>
							<p className="mt-3 font-display text-3xl font-semibold text-white">
								{products.pagination.totalItems}
							</p>
						</div>
						<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
							<p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
								<PackageCheck className="size-3.5 text-primary-strong" />
								Pages
							</p>
							<p className="mt-3 font-display text-3xl font-semibold text-white">{totalPages}</p>
						</div>
					</div>
				</section>

				{products.items.length === 0 ? (
					<section className="rounded-[2rem] bg-surface-low p-8 ring-1 ring-white/6 sm:p-10">
						<div className="flex max-w-xl flex-col gap-4">
							<div className="flex size-14 items-center justify-center rounded-full bg-primary-strong/12 text-primary-strong">
								<SearchX className="size-6" />
							</div>
							<h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
								No products in this category yet
							</h3>
							<p className="text-sm leading-7 text-slate-400">
								We couldn&apos;t find any active products under {normalizedCategoryName}. Check back soon
								as the catalog updates regularly.
							</p>
						</div>
					</section>
				) : (
					<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
						{products.items.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}

				{products.pagination.totalPages > 1 ? (
					<section className="rounded-[2rem] bg-surface-low px-5 py-4 ring-1 ring-white/6 sm:px-6">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-xs text-slate-400 w-full">
								Page <span className="font-medium text-white">{currentPage}</span> of{" "}
								<span className="font-medium text-white">{products.pagination.totalPages}</span>
							</p>
							<CategoryGridPagination
								categorySlug={categoryslug}
								currentPage={currentPage}
								totalPages={products.pagination.totalPages}
								hasPreviousPage={products.pagination.hasPreviousPage}
								hasNextPage={products.pagination.hasNextPage}
								visiblePages={visiblePages}
							/>
						</div>
					</section>
				) : null}
			</div>
		</div>
	);
}

export function CategoryProductsSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<div className="h-4 w-40 animate-pulse rounded-full bg-white/8" />
			<section className="relative overflow-hidden bg-surface-low px-6 py-8 ring-1 ring-white/6 sm:px-8 lg:px-10 lg:py-10">
				<div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
				<div className="mt-4 h-10 w-2/3 animate-pulse rounded-xl bg-white/10" />
				<div className="mt-4 h-5 w-1/2 animate-pulse rounded-full bg-white/8" />
			</section>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }, (_, index) => (
					<div
						key={index}
						className="overflow-hidden rounded-[1.8rem] bg-surface-low ring-1 ring-white/6"
					>
						<div className="aspect-4/3 w-full animate-pulse bg-white/6" />
						<div className="grid gap-4 p-5">
							<div className="h-5 w-18 animate-pulse rounded-full bg-white/8" />
							<div className="h-6 w-4/5 animate-pulse rounded-xl bg-white/10" />
							<div className="h-4 w-full animate-pulse rounded-xl bg-white/8" />
							<div className="h-11 w-28 animate-pulse rounded-[1rem] bg-white/10" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}