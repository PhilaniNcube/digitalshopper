import { Suspense } from "react";
import OrderData from "@/components/dashboard/orders/order-data";

export default function DashboardOrdersPage() {
	return (
		<div className="container py-8">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Orders</h1>
							<p className="text-white">Loading orders...</p>
						</div>
					</div>
				}
			>
				<OrderData />
			</Suspense>
		</div>
	);
}
