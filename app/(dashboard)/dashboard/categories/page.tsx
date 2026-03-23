import { Suspense } from "react";
import CategoryData from "@/components/dashboard/categories/category-data";

export default function DashboardCategoriesPage() {
	return (
		<div className="container py-8">
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
				<CategoryData />
			</Suspense>
		</div>
	);
}