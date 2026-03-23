"use client";

import { useState } from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { UserListItem } from "@/dal/queries/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<UserListItem>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue<string>("role");
			return (
				<Badge variant={role === "admin" ? "default" : "secondary"}>
					{role}
				</Badge>
			);
		},
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return row.getValue<string>(columnId) === filterValue;
		},
	},
	{
		accessorKey: "emailVerified",
		header: "Verified",
		cell: ({ row }) => {
			const verified = row.getValue<boolean>("emailVerified");
			return (
				<Badge variant={verified ? "default" : "outline"}>
					{verified ? "Yes" : "No"}
				</Badge>
			);
		},
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return String(row.getValue<boolean>(columnId)) === filterValue;
		},
	},
	{
		accessorKey: "banned",
		header: "Status",
		cell: ({ row }) => {
			const banned = row.getValue<boolean>("banned");
			return (
				<Badge variant={banned ? "destructive" : "secondary"}>
					{banned ? "Banned" : "Active"}
				</Badge>
			);
		},
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return String(row.getValue<boolean>(columnId)) === filterValue;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => {
			const date = row.getValue<Date>("createdAt");
			return new Date(date).toLocaleDateString();
		},
	},
];

export function UsersTable({ users }: { users: UserListItem[] }) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: users,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<Input
					placeholder="Search by name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(e) =>
						table.getColumn("name")?.setFilterValue(e.target.value)
					}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
				<Input
					placeholder="Search by email..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(e) =>
						table.getColumn("email")?.setFilterValue(e.target.value)
					}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
				<Select
                    
					value={
						(table.getColumn("role")?.getFilterValue() as string) ?? "all"
					}
					onValueChange={(value) =>
						table.getColumn("role")?.setFilterValue(value)
					}
				>
					<SelectTrigger className="max-w-xs h-12! text-slate-100">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All roles</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
						<SelectItem value="user">User</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={
						(table.getColumn("banned")?.getFilterValue() as string) ?? "all"
					}
					onValueChange={(value) =>
						table.getColumn("banned")?.setFilterValue(value)
					}
				>
					<SelectTrigger className="max-w-xs h-12! text-slate-100">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All statuses</SelectItem>
						<SelectItem value="false">Active</SelectItem>
						<SelectItem value="true">Banned</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<Table className="text-slate-100">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id} className="text-slate-100">
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-white"
							>
								No users found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-white">
					{table.getFilteredRowModel().rows.length} user(s) total
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<span className="text-sm text-white">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
