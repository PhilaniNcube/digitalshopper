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
import type { CategoryListItem } from "@/dal/queries/categories";
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

const columns: ColumnDef<CategoryListItem>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "slug",
		header: "Slug",
	},
	{
		accessorKey: "path",
		header: "Path",
	},
	{
		accessorKey: "depth",
		header: "Level",
		cell: ({ row }) => <Badge variant="outline">Level {row.original.depth}</Badge>,
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return String(row.getValue<number>(columnId)) === filterValue;
		},
	},
	{
		id: "parent",
		header: "Parent",
		cell: ({ row }) => row.original.parentId ?? "Root",
		filterFn: (row, _columnId, filterValue) => {
			if (filterValue === "all") return true;
			return filterValue === "root" ? row.original.parentId === null : row.original.parentId !== null;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
	},
];

export function CategoriesTable({ categories }: { categories: CategoryListItem[] }) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: categories,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<Input
					placeholder="Search by name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
				<Input
					placeholder="Search by path..."
					value={(table.getColumn("path")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("path")?.setFilterValue(event.target.value)}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
				<Select
					value={(table.getColumn("depth")?.getFilterValue() as string) ?? "all"}
					onValueChange={(value) => table.getColumn("depth")?.setFilterValue(value)}
				>
					<SelectTrigger className="max-w-xs !h-12 text-slate-100">
						<SelectValue placeholder="Level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All levels</SelectItem>
						<SelectItem value="0">Level 0</SelectItem>
						<SelectItem value="1">Level 1</SelectItem>
						<SelectItem value="2">Level 2</SelectItem>
						<SelectItem value="3">Level 3</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={(table.getColumn("parent")?.getFilterValue() as string) ?? "all"}
					onValueChange={(value) => table.getColumn("parent")?.setFilterValue(value)}
				>
					<SelectTrigger className="max-w-xs !h-12 text-slate-100">
						<SelectValue placeholder="Hierarchy" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All categories</SelectItem>
						<SelectItem value="root">Root only</SelectItem>
						<SelectItem value="child">Children only</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Table className="text-slate-100">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id} className="text-slate-100">
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center text-white">
								No categories found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<div className="flex items-center justify-between">
				<p className="text-sm text-white">{table.getFilteredRowModel().rows.length} category item(s) total</p>
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
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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