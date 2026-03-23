import { Suspense } from "react";
import CategoryData from "@/components/dashboard/categories/category-data";

type DashboardCategoriesPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardCategoriesPage({ searchParams }: DashboardCategoriesPageProps) {
	return (
		<div className="container">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Categories</h1>
							<p className="text-white">Loading categories...</p>
						</div>
					</div>
				}
			>
				<CategoryData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}