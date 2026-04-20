"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { DeleteOrderButton } from "@/components/dashboard/orders/delete-order-button";
import type { OrderListItem, OrderPaginationMeta } from "@/dal/queries/orders";
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
import { formatCurrency } from "@/lib/utils";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
	paid: "default",
	pending: "outline",
	failed: "destructive",
	cancelled: "secondary",
};


const columns: ColumnDef<OrderListItem>[] = [
	{
		accessorKey: "firstName",
		header: "Customer",
		cell: ({ row }) => {
			return `${row.original.firstName} ${row.original.lastName}`;
		},
		filterFn: (row, _columnId, filterValue) => {
			const fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase();
			return fullName.includes((filterValue as string).toLowerCase());
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "total",
		header: "Total",
		cell: ({ row }) => formatCurrency(row.original.total),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue<string>("status");
			return (
				<Badge variant={statusVariant[status] ?? "secondary"}>
					{status}
				</Badge>
			);
		},
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return row.getValue<string>(columnId) === filterValue;
		},
	},
	{
		accessorKey: "city",
		header: "City",
	},
	{
		accessorKey: "province",
		header: "Province",
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => {
			const date = row.getValue<Date>("createdAt");
			return new Date(date).toLocaleDateString();
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => (
			// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation only
			<div
				className="flex justify-end gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				<DeleteOrderButton order={row.original} />
			</div>
		),
	},
];

type OrdersTableProps = {
	orders: OrderListItem[];
	pagination: OrderPaginationMeta;
};

export function OrdersTable({ orders, pagination }: OrdersTableProps) {
	const router = useRouter();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: orders,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const filteredCount = table.getFilteredRowModel().rows.length;
	const currentPage = pagination.page;
	const totalPages = Math.max(1, pagination.totalPages);
	const previousPageHref = `?page=${Math.max(1, currentPage - 1)}&pageSize=${pagination.pageSize}`;
	const nextPageHref = `?page=${currentPage + 1}&pageSize=${pagination.pageSize}`;

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<Input
					placeholder="Search by customer..."
					value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
					onChange={(e) =>
						table.getColumn("firstName")?.setFilterValue(e.target.value)
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
						(table.getColumn("status")?.getFilterValue() as string) ?? "all"
					}
					onValueChange={(value) =>
						table.getColumn("status")?.setFilterValue(value)
					}
				>
					<SelectTrigger className="max-w-xs h-12! text-slate-100">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All statuses</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="paid">Paid</SelectItem>
						<SelectItem value="failed">Failed</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
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
							<TableRow
								key={row.id}
								className="cursor-pointer"
								onClick={() =>
									router.push(`/dashboard/orders/${row.original.id}`)
								}
							>
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
								No orders found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-white">
					{columnFilters.length > 0
						? `${filteredCount} filtered order(s) on this page`
						: `${pagination.totalItems} order(s) total`}
				</p>
				<div className="flex items-center gap-2">
					<Button className='bg-primary-strong text-white! border-primary-strong hover:border-white!' size="sm" asChild disabled={!pagination.hasPreviousPage}>
						<Link
							href={previousPageHref}
							aria-disabled={!pagination.hasPreviousPage}
							tabIndex={pagination.hasPreviousPage ? undefined : -1}
						>
							Previous
						</Link>
					</Button>
					<span className="text-sm text-white">
						Page {currentPage} of {totalPages}
					</span>
					<Button className='bg-primary-strong text-white! border-primary-strong hover:border-white!' size="sm" asChild disabled={!pagination.hasNextPage}>
						<Link
							href={nextPageHref}
							aria-disabled={!pagination.hasNextPage}
							tabIndex={pagination.hasNextPage ? undefined : -1}
						>
							Next
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
