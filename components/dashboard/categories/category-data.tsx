import { getAdminCategories } from "@/dal/queries/categories";
import { CategoriesTable } from "./categories-table";

export default async function CategoryData() {
	const { items, pagination } = await getAdminCategories();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Categories</h1>
				<p className="text-white">
					Manage all catalog categories. {pagination.totalItems} category item(s) total.
				</p>
			</div>
			<CategoriesTable categories={items} />
		</div>
	);
}