import { Suspense } from "react";
import { OverviewStatCardSkeleton } from "@/components/dashboard/overview-stat-card";
import { InStockCountCard } from "@/components/dashboard/inventory/in-stock-count-card";
import { OutOfStockCountCard } from "@/components/dashboard/inventory/out-of-stock-count-card";
import { LowStockCountCard } from "@/components/dashboard/inventory/low-stock-count-card";
import { TotalUnitsCard } from "@/components/dashboard/inventory/total-units-card";
import {
	WarehouseBreakdownCard,
	WarehouseBreakdownSkeleton,
} from "@/components/dashboard/inventory/warehouse-breakdown-card";
import {
	LowStockTable,
	LowStockTableSkeleton,
} from "@/components/dashboard/inventory/low-stock-table";

export default function DashboardInventoryPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="text-xs uppercase tracking-[0.24em] text-white">
					Dashboard
				</p>
				<h1 className="font-heading text-3xl font-semibold tracking-tight text-white">
					Inventory overview
				</h1>
				<p className="max-w-2xl text-sm text-white">
					Stock levels, warehouse distribution, and products that need
					attention.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
				<Suspense fallback={<OverviewStatCardSkeleton />}>
					<InStockCountCard />
				</Suspense>
				<Suspense fallback={<OverviewStatCardSkeleton />}>
					<OutOfStockCountCard />
				</Suspense>
				<Suspense fallback={<OverviewStatCardSkeleton />}>
					<LowStockCountCard />
				</Suspense>
				<Suspense fallback={<OverviewStatCardSkeleton />}>
					<TotalUnitsCard />
				</Suspense>
			</div>

			<Suspense fallback={<WarehouseBreakdownSkeleton />}>
				<WarehouseBreakdownCard />
			</Suspense>

			<Suspense fallback={<LowStockTableSkeleton />}>
				<LowStockTable />
			</Suspense>
		</div>
	);
}