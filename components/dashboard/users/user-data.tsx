import { getUsers } from "@/dal/queries/users";
import { UsersTable } from "./users-table";

type UserDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function UserData({ searchParams }: UserDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getUsers(page, pageSize);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Users</h1>
				<p className="text-white">
					Manage all registered users. {pagination.totalItems} user(s) total.
				</p>
			</div>
			<UsersTable users={items} pagination={pagination} />
		</div>
	);
}