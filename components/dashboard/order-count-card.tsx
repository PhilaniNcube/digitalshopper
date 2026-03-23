import { ShoppingCart } from "lucide-react";
import { getDashboardOrderCount } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function OrderCountCard() {
	const count = await getDashboardOrderCount();

	return (
		<OverviewStatCard
			title="Orders"
			value={count.toLocaleString("en-ZA")}
			description="Every order created so far, regardless of payment outcome."
			icon={ShoppingCart}
			label="Commerce"
		/>
	);
}