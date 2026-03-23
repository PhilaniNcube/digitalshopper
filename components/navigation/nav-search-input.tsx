"use client";

import {
  productSearchParsers,
  serializeProductSearch,
} from "@/app/(public)/products/search-params";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { debounce, useQueryStates } from "nuqs";
import type { ChangeEvent, FormEvent } from "react";
import { useTransition } from "react";

const NavSearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isProductsPage = pathname === "/products";
  const [, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(productSearchParsers, {
    history: "replace",
    shallow: false,
    scroll: false,
    startTransition,
    limitUrlUpdates: debounce(300),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "");
    const nextFilters = {
      q: query,
      page: 1,
    };

    if (isProductsPage) {
      void setFilters(nextFilters, {
        shallow: false,
        scroll: false,
      });
      return;
    }

    router.push(serializeProductSearch("/products", nextFilters), {
      scroll: false,
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isProductsPage) {
      return;
    }

    void setFilters(
      {
        q: event.target.value,
        page: 1,
      },
      {
        shallow: false,
        scroll: false,
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "hidden items-center lg:flex",
        "ml-3 xl:ml-4"
      )}
      role="search"
      aria-label="Search products"
    >
      <div className="group flex h-11 w-24 lg:w-48 items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/4 px-3 text-slate-300 transition hover:border-white/20 focus-within:border-primary-strong/50 focus-within:bg-white/6 focus-within:text-white">
        <SearchIcon className="transition size-4 shrink-0 text-slate-500 group-focus-within:text-primary-strong" />
        {isProductsPage ? (
          <Input
            key="products-search"
            type="search"
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Search"
            className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-sm text-white placeholder:text-slate-500 focus-visible:border-0 focus-visible:ring-0 rounded-full"
            autoComplete="off"
          />
        ) : (
          <Input
            key="site-search"
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search"
            className="h-auto flex-1 border-0 bg-transparent px-0 py-0 text-sm text-white placeholder:text-slate-500 focus-visible:border-0 focus-visible:ring-0 rounded-full"
            autoComplete="off"
          />
        )}
        <Button
          type="submit"
          size="sm"
          className="h-8 rounded-full bg-primary-strong px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-black hover:bg-cyan-300"
        >
         <SearchIcon className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};

export default NavSearchInput;