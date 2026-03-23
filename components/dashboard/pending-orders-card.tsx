import { Clock3 } from "lucide-react";
import { getDashboardPendingOrderCount } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function PendingOrdersCard() {
	const count = await getDashboardPendingOrderCount();

	return (
		<OverviewStatCard
			title="Pending Orders"
			value={count.toLocaleString("en-ZA")}
			description="Orders waiting for a completed Payfast confirmation."
			icon={Clock3}
			label="Commerce"
		/>
	);
}