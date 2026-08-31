import { Suspense } from "react";
import { InventoryOverview } from "@/components/dashboard/inventory/inventory-overview";
import { OverviewStatCardSkeleton } from "@/components/dashboard/overview-stat-card";
import { WarehouseBreakdownSkeleton } from "@/components/dashboard/inventory/warehouse-breakdown-card";
import { LowStockTable, LowStockTableSkeleton } from "@/components/dashboard/inventory/low-stock-table";
import { InventorySearch } from "@/components/dashboard/inventory/inventory-search";
import { InventorySearchResults } from "@/components/dashboard/inventory/inventory-search-results";

type DashboardInventoryPageProps = {
	searchParams: Promise<{ q?: string }>;
};

export default function DashboardInventoryPage({ searchParams }: DashboardInventoryPageProps) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<p className="text-xs uppercase tracking-[0.24em] text-white">Dashboard</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-white">Inventory overview</h1>
					<p className="max-w-2xl text-sm text-white">Stock levels, warehouse distribution, and products that need attention.</p>
				</div>
				<InventorySearch />
			</div>
			<Suspense fallback={null}>
				<InventorySearchResultsWrapper searchParams={searchParams} />
			</Suspense>
			<Suspense fallback={<><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"><OverviewStatCardSkeleton /><OverviewStatCardSkeleton /><OverviewStatCardSkeleton /><OverviewStatCardSkeleton /></div><WarehouseBreakdownSkeleton /></>}>
				<InventoryOverview />
			</Suspense>
			<Suspense fallback={<LowStockTableSkeleton />}>
				<LowStockTable />
			</Suspense>
		</div>
	);
}

async function InventorySearchResultsWrapper({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
	const { q } = await searchParams;
	if (!q) return null;
	return (
		<Suspense fallback={<div>Searching catalog...</div>}>
			<InventorySearchResults q={q} />
		</Suspense>
	);
}
