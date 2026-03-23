"use client";

import { productSearchParsers } from "@/app/(public)/products/search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/db/schema";
import { cn, decodeHtmlEntities } from "@/lib/utils";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

type ProductFiltersProps = {
  categories: Category[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(productSearchParsers, {
    history: "replace",
    shallow: false,
    startTransition,
  });

  return (
    <div className="overflow-hidden bg-surface-low ring-1 ring-white/6">
      <div className="flex items-center justify-between border-b border-white/6 bg-black/10 px-5 py-4">
        <div>
          <h2 className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-white">
            <SlidersHorizontal className="size-4 text-primary-strong" />
            Catalog controls
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 text-[11px] uppercase tracking-[0.24em] text-primary-strong"
          onClick={() =>
            void setFilters({
              q: "",
              category: "all",
              sort: "featured",
              stock: "all",
              page: 1,
            })
          }
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>
      <div className="grid gap-6 p-5">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            Search
          </p>
          <div className="group flex h-12 items-center gap-3 rounded-[1.2rem] bg-surface-high px-4 ring-1 ring-white/6 transition focus-within:ring-primary-strong/40">
            <Search className="size-4 text-slate-500 transition group-focus-within:text-primary-strong" />
            <Input
              value={filters.q}
              onChange={(event) =>
                void setFilters({ q: event.target.value, page: 1 })
              }
              placeholder="Search title, slug, SKU"
              className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-white rounded-none placeholder:text-slate-500 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            Sort
          </p>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              void setFilters({
                sort: value as typeof filters.sort,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-12 w-full rounded-[1.2rem] border-white/6 bg-surface-high px-4 text-sm text-white focus-visible:border-primary-strong/40 focus-visible:ring-0 data-placeholder:text-slate-500 [&_svg]:text-slate-500">
              <SelectValue placeholder="Choose sort order" />
            </SelectTrigger>
            <SelectContent className="rounded-[1.2rem] border-white/6 bg-surface-high text-white ring-1 ring-white/6">
              <SelectItem value="featured">Featured first</SelectItem>
              <SelectItem value="price-asc">Price low to high</SelectItem>
              <SelectItem value="price-desc">Price high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            Inventory gate
          </p>
          <Button
            variant="outline"
            className={cn(
              "h-11 w-full justify-center rounded-[1.1rem] border-white/8 bg-surface-high text-xs uppercase tracking-[0.24em] text-slate-300 hover:bg-surface-elevated hover:text-white",
              filters.stock === "in-stock" &&
                "border-primary-strong/40 bg-primary-strong/10 text-primary-strong",
            )}
            onClick={() =>
              void setFilters({
                stock: filters.stock === "in-stock" ? "all" : "in-stock",
                page: 1,
              })
            }
          >
            {isPending
              ? "Updating..."
              : filters.stock === "in-stock"
                ? "In stock only"
                : "Show all inventory"}
          </Button>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            Category
          </p>
          <div className="grid max-h-88 gap-2 overflow-y-auto pr-1">
            <Button
              variant="ghost"
              className={cn(
                "h-auto justify-between rounded-[1.1rem] bg-surface-high px-4 py-3 text-left text-sm text-slate-300 hover:bg-surface-elevated hover:text-white",
                filters.category === "all" &&
                  "bg-primary-strong/12 text-primary-strong",
              )}
              onClick={() => void setFilters({ category: "all", page: 1 })}
            >
              <span>All categories</span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "h-auto justify-between rounded-[1.1rem] bg-surface-high px-4 py-3 text-left text-sm text-slate-300 hover:bg-surface-elevated hover:text-white",
                  filters.category === category.slug &&
                    "bg-primary-strong/12 text-primary-strong",
                )}
                onClick={() =>
                  void setFilters({ category: category.slug, page: 1 })
                }
              >
                  <span className="line-clamp-1">
                    {decodeHtmlEntities(category.name)}
                  </span>
              </Button>
            ))}
          </div>
        </div>
      
      </div>
    </div>
  );
}
