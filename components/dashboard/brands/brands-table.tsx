"use client";

import Link from "next/link";
import { useState } from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { BrandListItem, BrandPaginationMeta } from "@/dal/queries/brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<BrandListItem>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <p className="w-[32ch] truncate">{row.original.name}</p>,
	},
	{
		accessorKey: "slug",
		header: "Slug",
		cell: ({ row }) => <p className="w-[32ch] truncate text-slate-300">{row.original.slug}</p>,
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
	},
	{
		accessorKey: "updatedAt",
		header: "Updated",
		cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
	},
];

type BrandsTableProps = {
	brands: BrandListItem[];
	pagination: BrandPaginationMeta;
};

export function BrandsTable({ brands, pagination }: BrandsTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: brands,
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
			<div className="flex flex-wrap items-center gap-3">
				<Input
					placeholder="Search by name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
				<Input
					placeholder="Search by slug..."
					value={(table.getColumn("slug")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("slug")?.setFilterValue(event.target.value)
					}
					className="max-w-xs h-12 placeholder:text-slate-100"
				/>
			</div>

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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center text-white">
								No brands found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<div className="flex items-center justify-between">
				<p className="text-sm text-white">
					{columnFilters.length > 0
						? `${filteredCount} filtered brand item(s) on this page`
						: `${pagination.totalItems} brand item(s) total`}
				</p>
				<div className="flex items-center gap-2">
					<Button className="bg-primary-strong text-white! border-primary-strong hover:border-white!" size="sm" asChild disabled={!pagination.hasPreviousPage}>
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
					<Button className="bg-primary-strong text-white! border-primary-strong hover:border-white!" size="sm" asChild disabled={!pagination.hasNextPage}>
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
