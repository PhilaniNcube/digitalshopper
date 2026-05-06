import { productSearchCache } from "@/app/(public)/products/search-params";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridPagination } from "@/components/products/product-grid-pagination";
import { Badge } from "@/components/ui/badge";
import { fetchCatalogProducts } from "@/dal/queries/products";
import { TrackViewItemList } from "@/components/products/track-view-item-list";
import { getDisplayPrice } from "@/lib/utils";
import { Boxes, PackageCheck, SearchX } from "lucide-react";

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

export async function ProductGrid({ searchParamsPromise }: { searchParamsPromise: Promise<Record<string, string | string[] | undefined>> }) {
	const { q, category, sort, stock, page } = await productSearchCache.parse(searchParamsPromise);
	const products = await fetchCatalogProducts({
		q,
		category,
		sort,
		stock,
		page,
		pageSize: 12,
	});
	const hasFilters = Boolean(q || category !== "all" || sort !== "featured" || stock !== "all");
	const currentPage = products.pagination.page;
	const totalPages = Math.max(products.pagination.totalPages, 1);
	const visiblePages = getVisiblePages(currentPage, totalPages);

	return (
		<div id="products-results-top" className="grid gap-6">
			<section className="rounded-[2rem] bg-surface-low p-5 ring-1 ring-white/6 sm:p-6">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
					
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
						<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
							<p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
								<Boxes className="size-3.5 text-primary-strong" />
								Results
							</p>
							<p className="mt-3 font-display text-3xl font-semibold text-white">{products.pagination.totalItems}</p>
						</div>
						<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
							<p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
								<PackageCheck className="size-3.5 text-primary-strong" />
								Pages
							</p>
							<p className="mt-3 font-display text-3xl font-semibold text-white">{totalPages}</p>
						</div>
					</div>
				</div>
			</section>
			{products.items.length === 0 ? (
				<section className="rounded-[2rem] bg-surface-low p-8 ring-1 ring-white/6 sm:p-10">
					<div className="flex max-w-xl flex-col gap-4">
						<div className="flex size-14 items-center justify-center rounded-full bg-primary-strong/12 text-primary-strong">
							<SearchX className="size-6" />
						</div>
						<h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">No products matched the current filter set</h3>
						<p className="text-sm leading-7 text-slate-400">
							Adjust the query, switch categories, or reset the filter rail to widen the result set.
						</p>
						{hasFilters ? (
							<div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
								{q ? <Badge variant="outline" className="border-white/8 bg-black/15 px-3 py-1 text-slate-300">Query: {q}</Badge> : null}
								{category !== "all" ? <Badge variant="outline" className="border-white/8 bg-black/15 px-3 py-1 text-slate-300">Category: {category}</Badge> : null}
								{stock !== "all" ? <Badge variant="outline" className="border-white/8 bg-black/15 px-3 py-1 text-slate-300">Stock: {stock}</Badge> : null}
							</div>
						) : null}
					</div>
				</section>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
					<TrackViewItemList
						products={products.items.map((p) => ({
							id: p.id,
							slug: p.slug,
							title: p.title,
							category: p.category?.slug ?? "uncategorized",
							price: Math.round(getDisplayPrice(p)),
							image: p.mainImage ?? "/images/banner.webp",
							summary: p.summary ?? p.shortDescription ?? "",
							specs: p.specs.slice(0, 3),
							featured: p.featured,
							inStock: p.inStock,
						}))}
						listName={category !== "all" ? `Category: ${category}` : "Product Grid"}
					/>
					{products.items.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
			{products.pagination.totalPages > 1 ? (
				<section className="rounded-[2rem] bg-surface-low px-5 py-4 ring-1 ring-white/6 sm:px-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-slate-400 w-full">
							Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{products.pagination.totalPages}</span>
						</p>
						<ProductGridPagination
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
	);
}