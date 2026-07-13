"use client";

import { categoryPageParsers } from "@/app/(public)/categories/search-params";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { type MouseEvent, useTransition } from "react";
import { useQueryStates } from "nuqs";

type CategoryGridPaginationProps = {
	categorySlug: string;
	currentPage: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	visiblePages: Array<number | "ellipsis">;
};

function buildCategoryHref(categorySlug: string, page: number) {
	if (page <= 1) {
		return `/categories/${categorySlug}`;
	}

	return `/categories/${categorySlug}?page=${page}`;
}

export function CategoryGridPagination({
	categorySlug,
	currentPage,
	totalPages,
	hasPreviousPage,
	hasNextPage,
	visiblePages,
}: CategoryGridPaginationProps) {
	const [isPending, startTransition] = useTransition();
	const [filters, setFilters] = useQueryStates(categoryPageParsers, {
		history: "push",
		shallow: false,
		startTransition,
	});

	const scrollToResultsTop = () => {
		const target = document.getElementById("category-results-top");

		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const goToPage = (event: MouseEvent<HTMLAnchorElement>, nextPage: number, enabled: boolean) => {
		event.preventDefault();

		if (!enabled || nextPage === filters.page) {
			return;
		}

		scrollToResultsTop();
		void setFilters({ page: nextPage });
	};

	return (
		<Pagination className="mx-0 justify-start sm:justify-end" aria-busy={isPending}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={buildCategoryHref(categorySlug, Math.max(1, currentPage - 1))}
						onClick={(event) => goToPage(event, Math.max(1, currentPage - 1), hasPreviousPage)}
						aria-disabled={!hasPreviousPage}
						tabIndex={hasPreviousPage ? undefined : -1}
						className={!hasPreviousPage ? "pointer-events-none bg-white!" : " bg-white! text-slate-200 hover:bg-surface-elevated hover:text-white"}
					/>
				</PaginationItem>
				{visiblePages.map((pageItem, index) => (
					<PaginationItem key={`${pageItem}-${index}`}>
						{pageItem === "ellipsis" ? (
							<PaginationEllipsis className="text-slate-500" />
						) : (
							<PaginationLink
								href={buildCategoryHref(categorySlug, pageItem)}
								onClick={(event) => goToPage(event, pageItem, true)}
								isActive={pageItem === currentPage}
								className={pageItem === currentPage ? "border-primary-strong bg-primary-strong text-primary-strong hover:bg-primary-strong/16 hover:text-primary-strong" : "border-white/8 bg-primary text-slate-100! hover:bg-surface-elevated hover:text-white"}
							>
								{pageItem}
							</PaginationLink>
						)}
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext
						href={buildCategoryHref(categorySlug, Math.min(totalPages, currentPage + 1))}
						onClick={(event) => goToPage(event, Math.min(totalPages, currentPage + 1), hasNextPage)}
						aria-disabled={!hasNextPage}
						tabIndex={hasNextPage ? undefined : -1}
						className={!hasNextPage ? "pointer-events-none opacity-40" : "border-white/8 bg-surface-high text-slate-200 hover:bg-surface-elevated hover:text-white"}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}