import { getAdminCategories } from "@/dal/queries/categories";
import { CategoriesTable } from "./categories-table";

type CategoryDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function CategoryData({ searchParams }: CategoryDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getAdminCategories({ page, pageSize });

	return (
		<div className="">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Categories</h1>
				<p className="text-white">
					Manage all catalog categories. {pagination.totalItems} category item(s) total.
				</p>
			</div>
			<CategoriesTable categories={items} pagination={pagination} />
		</div>
	);
}