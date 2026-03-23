import { Suspense } from "react";
import UserData from "@/components/dashboard/users/user-data";

type DashboardUsersPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardUsersPage({ searchParams }: DashboardUsersPageProps) {
	return (
		<div className="container py-8">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Users</h1>
							<p className="text-white">Loading users...</p>
						</div>
					</div>
				}
			>
				<UserData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}