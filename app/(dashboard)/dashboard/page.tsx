import { Suspense } from "react";
import Overview from "@/components/dashboard/overview";
import { OverviewSkeleton } from "@/components/dashboard/overview-skeleton";

export default function DashboardPage() {
	return (
		<Suspense fallback={<OverviewSkeleton />}>
			<Overview />
		</Suspense>
	);
}