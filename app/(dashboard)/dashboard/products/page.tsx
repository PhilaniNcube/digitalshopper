import { Suspense } from "react";
import ProductData from "@/components/dashboard/products/product-data";

type DashboardProductsPageProps = {
	searchParams: Promise<{
		page?: string | string[];
		pageSize?: string | string[];
	}>;
};

export default function DashboardProductsPage({
	searchParams,
}: DashboardProductsPageProps) {
	return (
		<div className="container py-8">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Products</h1>
							<p className="text-white">Loading products...</p>
						</div>
					</div>
				}
			>
				<ProductData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}