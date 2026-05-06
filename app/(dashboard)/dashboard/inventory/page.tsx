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

import { InventorySearch } from "@/components/dashboard/inventory/inventory-search";
import { InventorySearchResults } from "@/components/dashboard/inventory/inventory-search-results";

type DashboardInventoryPageProps = {
	searchParams: Promise<{ q?: string }>;
};

export default function DashboardInventoryPage({
	searchParams,
}: DashboardInventoryPageProps) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
				<InventorySearch />
			</div>

			<Suspense fallback={null}>
				<InventorySearchResultsWrapper searchParams={searchParams} />
			</Suspense>

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

async function InventorySearchResultsWrapper({
	searchParams,
}: { searchParams: Promise<{ q?: string }> }) {
	const { q } = await searchParams;
	if (!q) return null;

	return (
		<Suspense fallback={<div>Searching catalog...</div>}>
			<InventorySearchResults q={q} />
		</Suspense>
	);
}