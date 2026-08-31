import { BanknoteArrowUp, BoxesIcon, Clock3, FolderTree, ShoppingCart, Users } from "lucide-react";
import { getDashboardOverviewStats } from "@/dal/queries/stats";
import { ManualStockSyncButton } from "@/components/dashboard/manual-stock-sync-button";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";
import { formatCurrency } from "@/lib/utils";

export default async function Overview() {
	const stats = await getDashboardOverviewStats();
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="space-y-2">
					<p className="text-xs uppercase tracking-[0.24em] text-white">Dashboard</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-white">Operations overview</h1>
					<p className="max-w-2xl text-sm text-white">A live snapshot of the catalog, customer base, order pipeline, and confirmed revenue.</p>
				</div>
				<ManualStockSyncButton />
			</div>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				<OverviewStatCard title="Products" value={stats.productCount.toLocaleString("en-ZA")} description="All catalog items currently available in the dashboard." icon={BoxesIcon} label="Catalog" />
				<OverviewStatCard title="Categories" value={stats.categoryCount.toLocaleString("en-ZA")} description="Structured catalog groups available for storefront browsing." icon={FolderTree} label="Catalog" />
				<OverviewStatCard title="Users" value={stats.userCount.toLocaleString("en-ZA")} description="Registered customer and admin accounts across the platform." icon={Users} label="Accounts" />
				<OverviewStatCard title="Orders" value={stats.orderCount.toLocaleString("en-ZA")} description="Every order created so far, regardless of payment outcome." icon={ShoppingCart} label="Commerce" />
				<OverviewStatCard title="Pending Orders" value={stats.pendingOrderCount.toLocaleString("en-ZA")} description="Orders waiting for a completed Payfast confirmation." icon={Clock3} label="Commerce" />
				<OverviewStatCard title="Paid Revenue" value={formatCurrency(stats.paidRevenue)} description="Confirmed revenue collected from orders marked as paid." icon={BanknoteArrowUp} label="Revenue" />
			</div>
		</div>
	);
}
