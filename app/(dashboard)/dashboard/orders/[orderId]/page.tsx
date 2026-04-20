import { Suspense } from "react";
import OrderDetail from "@/components/dashboard/orders/order-detail";

type OrderDetailPageProps = {
	params: Promise<{ orderId: string }>;
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
	return (
		<div className="container py-8">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-100">
								Order Details
							</h1>
							<p className="text-slate-400">Loading order...</p>
						</div>
					</div>
				}
			>
				<OrderDetail params={params} />
			</Suspense>
		</div>
	);
}
