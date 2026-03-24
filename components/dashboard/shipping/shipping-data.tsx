import { getShippingOrders } from "@/dal/queries/orders";
import { OrdersTable } from "@/components/dashboard/orders/orders-table";

type ShippingDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function ShippingData({ searchParams }: ShippingDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getShippingOrders(page, pageSize);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Shipping</h1>
				<p className="text-white">
					Track paid orders that are ready for fulfillment. {pagination.totalItems} shipment-ready order(s) total.
				</p>
			</div>
			<OrdersTable orders={items} pagination={pagination} />
		</div>
	);
}