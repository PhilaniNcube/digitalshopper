import { BoxesIcon } from "lucide-react";
import { getDashboardProductCount } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function ProductCountCard() {
	const count = await getDashboardProductCount();

	return (
		<OverviewStatCard
			title="Products"
			value={count.toLocaleString("en-ZA")}
			description="All catalog items currently available in the dashboard."
			icon={BoxesIcon}
			label="Catalog"
		/>
	);
}