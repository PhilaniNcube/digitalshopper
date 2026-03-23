import { FolderTree } from "lucide-react";
import { getDashboardCategoryCount } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function CategoryCountCard() {
	const count = await getDashboardCategoryCount();

	return (
		<OverviewStatCard
			title="Categories"
			value={count.toLocaleString("en-ZA")}
			description="Structured catalog groups available for storefront browsing."
			icon={FolderTree}
			label="Catalog"
		/>
	);
}