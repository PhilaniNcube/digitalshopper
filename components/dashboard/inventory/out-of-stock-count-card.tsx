import { PackageX } from "lucide-react";
import { getOutOfStockProductCount } from "@/dal/queries/inventory";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function OutOfStockCountCard() {
	const count = await getOutOfStockProductCount();

	return (
		<OverviewStatCard
			title="Out of Stock"
			value={count.toLocaleString("en-ZA")}
			description="Products with zero stock across all warehouses."
			icon={PackageX}
			label="Inventory"
		/>
	);
}
