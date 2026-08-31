import { MapPin, PackageCheck, PackageX, TriangleAlert, Warehouse } from "lucide-react";
import { getInventoryOverview } from "@/dal/queries/inventory";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const warehouseLabels: Record<string, string> = {
	CPT: "Cape Town",
	JHB: "Johannesburg",
	DBN: "Durban",
};

export async function InventoryOverview() {
	const overview = await getInventoryOverview();
	const maxUnits = Math.max(...overview.warehouseBreakdown.map((w) => w.totalUnits), 1);
	return (
		<>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
				<OverviewStatCard title="In Stock" value={overview.inStockCount.toLocaleString("en-ZA")} description="Products currently available for purchase." icon={PackageCheck} label="Inventory" />
				<OverviewStatCard title="Out of Stock" value={overview.outOfStockCount.toLocaleString("en-ZA")} description="Products with zero stock across all warehouses." icon={PackageX} label="Inventory" />
				<OverviewStatCard title="Low Stock" value={overview.lowStockCount.toLocaleString("en-ZA")} description="Products with 5 or fewer units remaining." icon={TriangleAlert} label="Inventory" />
				<OverviewStatCard title="Total Units" value={overview.totalUnits.toLocaleString("en-ZA")} description="Combined unit count across all warehouses." icon={Warehouse} label="Inventory" />
			</div>
			<Card className="bg-surface-low ring-white/6 col-span-full">
				<CardHeader className="gap-3">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-1">
							<p className="text-[10px] uppercase tracking-[0.24em] text-white">Inventory</p>
							<CardTitle className="text-white">Warehouse Distribution</CardTitle>
						</div>
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
							<MapPin className="size-4 text-white" />
						</div>
					</div>
					<CardDescription>Unit distribution and stocked product count per warehouse.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{overview.warehouseBreakdown.map((w) => (
							<div key={w.warehouseCode} className="space-y-1.5">
								<div className="flex items-center justify-between text-sm">
									<span className="font-medium text-white">
										{warehouseLabels[w.warehouseCode] ?? w.warehouseCode} <span className="text-white/60">({w.warehouseCode})</span>
									</span>
									<span className="text-white/80">
										{w.totalUnits.toLocaleString("en-ZA")} units &middot; {w.productCount.toLocaleString("en-ZA")} products
									</span>
								</div>
								<div className="h-2 w-full rounded-full bg-white/10">
									<div className="h-2 rounded-full bg-white/60" style={{ width: `${Math.round((w.totalUnits / maxUnits) * 100)}%` }} />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
