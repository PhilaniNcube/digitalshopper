"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryState, parseAsString } from "nuqs";

import { useRouter } from "next/navigation";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ProductListItem, ProductPaginationMeta } from "@/dal/queries/products";
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
import { formatCurrency, cn } from "@/lib/utils";


const columns: ColumnDef<ProductListItem>[] = [
	{
		accessorKey: "title",
		header: "Product",
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="flex items-center gap-2">
					<p className='max-w-[28ch] truncate'>{product.title}</p>
				</div>
			);
		}
	},
	{
		accessorKey: "supplierSku",
		header: "SKU",
	},
	{
		id: "brand",
		header: "Brand",
		cell: ({ row }) => <p className='max-w-[28ch] truncate'>{row.original.brand?.name ?? "Unassigned"}</p>,
		filterFn: (row, _columnId, filterValue) => {
			const brandName = row.original.brand?.name?.toLowerCase() ?? "";
			return brandName.includes((filterValue as string).toLowerCase());
		},
	},
	{
		id: "category",
		header: "Category",
		cell: ({ row }) => <p className='max-w-[23ch] truncate'>{row.original.category?.name ?? "Unassigned"}</p>,
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => formatCurrency(row.original.price),
	},
	{
		accessorKey: "totalStock",
		header: "Stock",
	},
	{
		accessorKey: "active",
		header: "Active",
		cell: ({ row }) => (
			<Badge variant={row.original.active ? "default" : "secondary"}>
				{row.original.active ? "Active" : "Hidden"}
			</Badge>
		),
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return String(row.getValue<boolean>(columnId)) === filterValue;
		},
	},
	{
		accessorKey: "inStock",
		header: "Availability",
		cell: ({ row }) => (
			<Badge variant={row.original.inStock ? "outline" : "destructive"} className={cn(
				row.original.inStock ? "text-white! border-white!" : "bg-destructive text-destructive-foreground"
			)}>
				{row.original.inStock ? "In stock" : "Out of stock"}
			</Badge>
		),
		filterFn: (row, columnId, filterValue) => {
			if (filterValue === "all") return true;
			return String(row.getValue<boolean>(columnId)) === filterValue;
		},
	},
];

type ProductsTableProps = {
	products: ProductListItem[];
	pagination: ProductPaginationMeta;
};

export function ProductsTable({ products, pagination }: ProductsTableProps) {
	const router = useRouter();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [q, setQ] = useQueryState(
		"q",
		parseAsString.withDefault("").withOptions({
			shallow: false,
			throttleMs: 300,
		}),
	);
	const [sku, setSku] = useQueryState(
		"sku",
		parseAsString.withDefault("").withOptions({
			shallow: false,
			throttleMs: 300,
		}),
	);

	const table = useReactTable({
		data: products,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const filteredCount = table.getFilteredRowModel().rows.length;
	const currentPage = pagination.page;
	const totalPages = Math.max(1, pagination.totalPages);

	const baseParams = new URLSearchParams();
	if (q) baseParams.set("q", q);
	if (sku) baseParams.set("sku", sku);
	baseParams.set("pageSize", pagination.pageSize.toString());

	const prevParams = new URLSearchParams(baseParams);
	prevParams.set("page", Math.max(1, currentPage - 1).toString());
	const previousPageHref = `?${prevParams.toString()}`;

	const nextParams = new URLSearchParams(baseParams);
	nextParams.set("page", (currentPage + 1).toString());
	const nextPageHref = `?${nextParams.toString()}`;

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<Input
					placeholder="Search by product..."
					value={q}
					onChange={(event) => setQ(event.target.value)}
					className="max-w-xs h-12 placeholder:text-slate-100 text-white"
				/>
				<Input
					placeholder="Search by SKU..."
					value={sku}
					onChange={(event) => setSku(event.target.value)}
					className="max-w-xs h-12 placeholder:text-slate-100 text-white"
				/>
				<Select
					value={(table.getColumn("active")?.getFilterValue() as string) ?? "all"}
					onValueChange={(value) => table.getColumn("active")?.setFilterValue(value)}
				>
					<SelectTrigger className="max-w-xs h-12! text-slate-100">
						<SelectValue placeholder="Visibility" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All visibility</SelectItem>
						<SelectItem value="true">Active</SelectItem>
						<SelectItem value="false">Hidden</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={(table.getColumn("inStock")?.getFilterValue() as string) ?? "all"}
					onValueChange={(value) => table.getColumn("inStock")?.setFilterValue(value)}
				>
					<SelectTrigger className="max-w-xs h-12! text-slate-100">
						<SelectValue placeholder="Stock" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All stock states</SelectItem>
						<SelectItem value="true">In stock</SelectItem>
						<SelectItem value="false">Out of stock</SelectItem>
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
							<TableRow
								key={row.id}
								className="cursor-pointer"
								onClick={() => router.push(`/dashboard/products/${row.original.id}`)}
							>
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
								No products found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<div className="flex items-center justify-between">
				<p className="text-sm text-white">
					{columnFilters.length > 0
						? `${filteredCount} filtered product(s) on this page`
						: `${pagination.totalItems} product(s) total`}
				</p>
				<div className="flex items-center gap-2">
					<Button className='bg-primary-strong text-white! border-primary-strong hover:border-white!' size="sm" asChild disabled={!pagination.hasPreviousPage}>
						<Link href={previousPageHref} aria-disabled={!pagination.hasPreviousPage} tabIndex={pagination.hasPreviousPage ? undefined : -1}>
							Previous
						</Link>
					</Button>
					<span className="text-sm text-white">
						Page {currentPage} of {totalPages}
					</span>
					<Button className='bg-primary-strong text-white! border-primary-strong hover:border-white!' size="sm" asChild disabled={!pagination.hasNextPage}>
						<Link href={nextPageHref} aria-disabled={!pagination.hasNextPage} tabIndex={pagination.hasNextPage ? undefined : -1}>
							Next
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}