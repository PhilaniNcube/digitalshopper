import { BanknoteArrowUp } from "lucide-react";
import { getDashboardPaidRevenue } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";
import { formatCurrency } from "@/lib/utils";

export async function PaidRevenueCard() {
	const revenue = await getDashboardPaidRevenue();

	return (
		<OverviewStatCard
			title="Paid Revenue"
			value={formatCurrency(revenue)}
			description="Confirmed revenue collected from orders marked as paid."
			icon={BanknoteArrowUp}
			label="Revenue"
		/>
	);
}