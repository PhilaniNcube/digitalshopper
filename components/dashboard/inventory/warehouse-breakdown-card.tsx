import { MapPin } from "lucide-react";
import { getWarehouseBreakdown } from "@/dal/queries/inventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const warehouseLabels: Record<string, string> = {
	CPT: "Cape Town",
	JHB: "Johannesburg",
	DBN: "Durban",
};

export async function WarehouseBreakdownCard() {
	const warehouses = await getWarehouseBreakdown();

	const maxUnits = Math.max(...warehouses.map((w) => w.totalUnits), 1);

	return (
		<Card className="bg-surface-low ring-white/6 col-span-full">
			<CardHeader className="gap-3">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<p className="text-[10px] uppercase tracking-[0.24em] text-white">
							Inventory
						</p>
						<CardTitle className="text-white">Warehouse Distribution</CardTitle>
					</div>
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
						<MapPin className="size-4 text-white" />
					</div>
				</div>
				<CardDescription>
					Unit distribution and stocked product count per warehouse.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{warehouses.map((w) => (
						<div key={w.warehouseCode} className="space-y-1.5">
							<div className="flex items-center justify-between text-sm">
								<span className="font-medium text-white">
									{warehouseLabels[w.warehouseCode] ?? w.warehouseCode}{" "}
									<span className="text-white/60">({w.warehouseCode})</span>
								</span>
								<span className="text-white/80">
									{w.totalUnits.toLocaleString("en-ZA")} units &middot;{" "}
									{w.productCount.toLocaleString("en-ZA")} products
								</span>
							</div>
							<div className="h-2 w-full rounded-full bg-white/10">
								<div
									className="h-2 rounded-full bg-white/60"
									style={{
										width: `${Math.round((w.totalUnits / maxUnits) * 100)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function WarehouseBreakdownSkeleton() {
	return (
		<Card className="bg-surface-low ring-white/6 col-span-full">
			<CardHeader className="gap-3">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<div className="h-3 w-20 animate-pulse rounded bg-white/10" />
						<div className="h-5 w-44 animate-pulse rounded bg-white/10" />
					</div>
					<div className="size-10 animate-pulse rounded-full bg-white/10" />
				</div>
				<div className="h-4 w-72 animate-pulse rounded bg-white/10" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Array.from({ length: 3 }, (_, i) => (
						<div key={i} className="space-y-1.5">
							<div className="flex items-center justify-between">
								<div className="h-4 w-28 animate-pulse rounded bg-white/10" />
								<div className="h-4 w-36 animate-pulse rounded bg-white/10" />
							</div>
							<div className="h-2 w-full rounded-full bg-white/10" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
