import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type OverviewStatCardProps = {
	title: string;
	value: string;
	description: string;
	icon: LucideIcon;
	label?: string;
};

export function OverviewStatCard({
	title,
	value,
	description,
	icon: Icon,
	label = "Dashboard",
}: OverviewStatCardProps) {
	return (
		<Card className="bg-surface-low ring-white/6">
			<CardHeader className="gap-3">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<p className="text-[10px] uppercase tracking-[0.24em] text-white">{label}</p>
						<CardTitle className="text-white">{title}</CardTitle>
					</div>
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
						<Icon className="size-4 text-white" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				<p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
				<CardDescription>{description}</CardDescription>
			</CardContent>
		</Card>
	);
}

export function OverviewStatCardSkeleton() {
	return (
		<Card className="bg-surface-low ring-white/6">
			<CardHeader className="gap-3">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="h-3 w-20 rounded-none" />
						<Skeleton className="h-5 w-28 rounded-none" />
					</div>
					<Skeleton className="size-10 rounded-full" />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<Skeleton className="h-9 w-24 rounded-none" />
				<Skeleton className="h-4 w-full rounded-none" />
			</CardContent>
		</Card>
	);
}