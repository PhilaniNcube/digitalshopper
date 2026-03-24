import { Warehouse } from "lucide-react";
import { getTotalUnitCount } from "@/dal/queries/inventory";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function TotalUnitsCard() {
	const total = await getTotalUnitCount();

	return (
		<OverviewStatCard
			title="Total Units"
			value={total.toLocaleString("en-ZA")}
			description="Combined unit count across all warehouses."
			icon={Warehouse}
			label="Inventory"
		/>
	);
}
