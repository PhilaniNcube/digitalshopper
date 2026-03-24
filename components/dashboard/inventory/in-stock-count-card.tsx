import { PackageCheck } from "lucide-react";
import { getInStockProductCount } from "@/dal/queries/inventory";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function InStockCountCard() {
	const count = await getInStockProductCount();

	return (
		<OverviewStatCard
			title="In Stock"
			value={count.toLocaleString("en-ZA")}
			description="Products currently available for purchase."
			icon={PackageCheck}
			label="Inventory"
		/>
	);
}
