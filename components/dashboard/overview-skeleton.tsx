import { OverviewStatCardSkeleton } from "@/components/dashboard/overview-stat-card";
import { Skeleton } from "@/components/ui/skeleton";

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

export function OverviewSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<Skeleton className="h-4 w-28 rounded-none" />
				<Skeleton className="h-9 w-52 rounded-none" />
				<Skeleton className="h-4 w-full max-w-xl rounded-none" />
			</div>
			<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
				{skeletonCards.map((card) => (
					<OverviewStatCardSkeleton key={card} />
				))}
			</div>
		</div>
	);
}