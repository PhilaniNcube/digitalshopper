import { getOrders } from "@/dal/queries/orders";
import { OrdersTable } from "./orders-table";

export default async function OrderData() {
	const { items, pagination } = await getOrders();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Orders</h1>
				<p className="text-white">
					Manage all orders. {pagination.totalItems} order(s) total.
				</p>
			</div>
			<OrdersTable orders={items} />
		</div>
	);
}
