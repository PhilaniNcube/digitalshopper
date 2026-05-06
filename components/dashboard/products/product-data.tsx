import { getAdminProducts } from "@/dal/queries/products";
import { ProductsTable } from "./products-table";

type ProductDataProps = {
	searchParams: Promise<{
		page?: string | string[];
		pageSize?: string | string[];
		q?: string | string[];
		sku?: string | string[];
	}>;
};

function getSingleParam(value?: string | string[]) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function ProductData({
	searchParams,
}: ProductDataProps) {
	const resolvedSearchParams = await searchParams;
	const pageValue = Number(getSingleParam(resolvedSearchParams.page) ?? "1");
	const pageSizeValue = Number(getSingleParam(resolvedSearchParams.pageSize) ?? "20");
	const q = getSingleParam(resolvedSearchParams.q);
	const sku = getSingleParam(resolvedSearchParams.sku);
	const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;
	const pageSize = Number.isFinite(pageSizeValue) && pageSizeValue > 0 ? Math.floor(pageSizeValue) : 20;

	const { items, pagination } = await getAdminProducts({ page, pageSize, q, sku });

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Products</h1>
				<p className="text-white">
					Manage all catalog products. {pagination.totalItems} product(s) total.
				</p>
			</div>
			<ProductsTable products={items} pagination={pagination} />
		</div>
	);
}