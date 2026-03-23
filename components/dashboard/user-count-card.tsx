import { Users } from "lucide-react";
import { getDashboardUserCount } from "@/dal/queries/stats";
import { OverviewStatCard } from "@/components/dashboard/overview-stat-card";

export async function UserCountCard() {
	const count = await getDashboardUserCount();

	return (
		<OverviewStatCard
			title="Users"
			value={count.toLocaleString("en-ZA")}
			description="Registered customer and admin accounts across the platform."
			icon={Users}
			label="Accounts"
		/>
	);
}