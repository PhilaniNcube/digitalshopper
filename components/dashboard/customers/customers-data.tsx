import { getUsers } from "@/dal/queries/users";
import { UsersTable } from "@/components/dashboard/users/users-table";

type CustomersDataProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
	return Array.isArray(value) ? value[0] : value;
}

export default async function CustomersData({ searchParams }: CustomersDataProps) {
	const resolvedSearchParams = await searchParams;
	const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
	const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
	const { items, pagination } = await getUsers(page, pageSize);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Customers</h1>
				<p className="text-white">
					Manage customer accounts. {pagination.totalItems} customer account(s) total.
				</p>
			</div>
			<UsersTable users={items} pagination={pagination} />
		</div>
	);
}