import type { Metadata } from "next";
import { ProductFiltersPanel } from "@/components/products/product-filters-panel";
import { ProductGridContent } from "@/components/products/product-grid-content";
import { ProductResults } from "@/components/products/product-results";
import { fetchCatalogProducts } from "@/dal/queries/products";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Products | Digital Shopper",
	description:
		"Explore our extensive catalog of tech products, computer hardware, and electronics. Filter by category, brand, and price.",
	openGraph: {
		title: "Products | Digital Shopper",
		description:
			"Explore our extensive catalog of tech products, computer hardware, and electronics.",
	},
};

const PAGE_SIZE = 12;

export default async function ProductsPage() {
	const initialProducts = await fetchCatalogProducts({ page: 1, pageSize: PAGE_SIZE });

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<section className="relative overflow-hidden bg-surface-low px-6 py-8 ring-1 ring-white/6 sm:px-8 lg:px-10 lg:py-10">
			  <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
			    Explore Our Extensive Product Catalog
			  </h1>
			  <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-400">
			    Discover a wide range of products across various categories. Use the filters to find exactly what you're looking for.
			  </p>
			 </section>

			<div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
				<aside className="lg:sticky lg:top-24 lg:self-start">
					<Suspense fallback={<div className="h-128 w-full animate-pulse bg-white/6" />}>
						<ProductFiltersPanel />
					</Suspense>
				</aside>
				<Suspense
					fallback={
						<ProductGridContent
							products={initialProducts}
							withTracking={false}
							withPagination={false}
						/>
					}
				>
					<ProductResults initialProducts={initialProducts} />
				</Suspense>
			</div>
		</div>
	);
}
