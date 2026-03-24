import { TriangleAlert } from "lucide-react";
import { getLowStockProductCount } from "@/dal/queries/inventory";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function LowStockCountCard() {
	const count = await getLowStockProductCount();

	return (
		<OverviewStatCard
			title="Low Stock"
			value={count.toLocaleString("en-ZA")}
			description="Products with 5 or fewer units remaining."
			icon={TriangleAlert}
			label="Inventory"
		/>
	);
}
