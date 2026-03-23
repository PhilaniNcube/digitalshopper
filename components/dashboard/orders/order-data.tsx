import { getOrders } from "@/dal/queries/orders";
import { OrdersTable } from "./orders-table";

type OrderDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function OrderData({ searchParams }: OrderDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getOrders(page, pageSize);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Orders</h1>
				<p className="text-white">
					Manage all orders. {pagination.totalItems} order(s) total.
				</p>
			</div>
			<OrdersTable orders={items} pagination={pagination} />
		</div>
	);
}
