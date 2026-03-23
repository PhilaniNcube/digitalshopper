import { ProductFiltersPanel } from "@/components/products/product-filters-panel";
import { ProductGrid } from "@/components/products/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

type ProductsPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function ProductGridFallback() {
	return (
		<div className="grid gap-6">
			<section className="rounded-[2rem] bg-surface-low p-5 ring-1 ring-white/6 sm:p-6">
				<div className="grid gap-3 sm:grid-cols-2 lg:max-w-md">
					<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
						<Skeleton className="h-3 w-20 rounded-full bg-white/8" />
						<Skeleton className="mt-4 h-9 w-16 rounded-xl bg-white/10" />
					</div>
					<div className="rounded-[1.3rem] bg-black/20 px-4 py-4">
						<Skeleton className="h-3 w-16 rounded-full bg-white/8" />
						<Skeleton className="mt-4 h-9 w-12 rounded-xl bg-white/10" />
					</div>
				</div>
			</section>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }, (_, index) => (
					<div
						key={index}
						className="overflow-hidden rounded-[1.8rem] bg-surface-low ring-1 ring-white/6"
					>
						<Skeleton className="aspect-4/3 w-full rounded-none bg-white/6" />
						<div className="grid gap-4 p-5">
							<div className="flex items-center justify-between gap-3">
								<Skeleton className="h-5 w-18 rounded-full bg-white/8" />
								<Skeleton className="h-5 w-12 rounded-full bg-white/8" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-6 w-4/5 rounded-xl bg-white/10" />
								<Skeleton className="h-4 w-full rounded-xl bg-white/8" />
								<Skeleton className="h-4 w-3/4 rounded-xl bg-white/8" />
							</div>
							<div className="flex items-end justify-between gap-4 pt-2">
								<div className="space-y-2">
									<Skeleton className="h-3 w-12 rounded-full bg-white/8" />
									<Skeleton className="h-7 w-24 rounded-xl bg-white/10" />
								</div>
								<Skeleton className="h-11 w-28 rounded-[1rem] bg-white/10" />
							</div>
						</div>
					</div>
				))}
			</div>
			<section className="rounded-[2rem] bg-surface-low px-5 py-4 ring-1 ring-white/6 sm:px-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<Skeleton className="h-4 w-28 rounded-full bg-white/8" />
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-10 w-24 rounded-xl bg-white/10" />
						<Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
						<Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
						<Skeleton className="h-10 w-20 rounded-xl bg-white/10" />
					</div>
				</div>
			</section>
		</div>
	);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
				<Suspense fallback={<ProductGridFallback />}>
					<ProductGrid searchParamsPromise={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}