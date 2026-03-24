import { getPaymentOrders } from "@/dal/queries/orders";
import { OrdersTable } from "@/components/dashboard/orders/orders-table";

type PaymentsDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentsData({ searchParams }: PaymentsDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getPaymentOrders(page, pageSize);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Payments</h1>
				<p className="text-white">
					Review payment-status activity across orders. {pagination.totalItems} payment record(s) total.
				</p>
			</div>
			<OrdersTable orders={items} pagination={pagination} />
		</div>
	);
}