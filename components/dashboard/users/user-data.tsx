import { getUsers } from "@/dal/queries/users";
import { UsersTable } from "./users-table";

export default async function UserData() {
	const { items, pagination } = await getUsers();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Users</h1>
				<p className="text-white">
					Manage all registered users. {pagination.totalItems} user(s) total.
				</p>
			</div>
			<UsersTable users={items} />
		</div>
	);
}