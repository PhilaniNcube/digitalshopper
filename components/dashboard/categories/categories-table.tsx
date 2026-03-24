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
import type { CategoryListItem, CategoryPaginationMeta } from "@/dal/queries/categories";
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
    cell: ({ row }) => (
      <p className="gap-2 w-[40ch] truncate">{row.original.name}</p>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <p className="gap-2 w-[30ch] truncate">{row.original.slug}</p>
    ),
  },

  {
    accessorKey: "depth",
    header: "Level",
    cell: ({ row }) => (
      <Badge variant="outline" className="border border-white text-white">
        Level {row.original.depth}
      </Badge>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      return String(row.getValue<number>(columnId)) === filterValue;
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export function CategoriesTable({
  categories,
  pagination,
}: {
  categories: CategoryListItem[];
  pagination: CategoryPaginationMeta;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: categories,
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

        <Select
          value={
            (table.getColumn("depth")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("depth")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="max-w-xs h-12! text-slate-100">
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
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-white"
              >
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-white">
          {columnFilters.length > 0
            ? `${filteredCount} filtered category item(s) on this page`
            : `${pagination.totalItems} category item(s) total`}
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
