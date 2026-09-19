"use client";

import { productSearchParsers } from "@/app/(public)/products/search-params";
import { ProductGridContent } from "@/components/products/product-grid-content";
import type { PaginatedProductsResult } from "@/dal/queries/products";
import { useQueryStates } from "nuqs";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 12;

type ProductResultsProps = {
	initialProducts: PaginatedProductsResult;
};

export function ProductResults({ initialProducts }: ProductResultsProps) {
	const [filters] = useQueryStates(productSearchParsers, {
		history: "replace",
		shallow: true,
	});
	const [products, setProducts] = useState(initialProducts);
	const [isStale, setIsStale] = useState(false);
	const requestId = useRef(0);

	const { q, category, sort, stock, page } = filters;
	const isDefault =
		q === "" && category === "all" && sort === "featured" && stock === "all" && page === 1;

	useEffect(() => {
		if (isDefault) {
			setProducts(initialProducts);
			setIsStale(false);
			return;
		}

		const controller = new AbortController();
		const id = ++requestId.current;
		setIsStale(true);

		const params = new URLSearchParams();
		params.set("page", String(page));
		params.set("pageSize", String(PAGE_SIZE));
		if (q) params.set("q", q);
		if (category !== "all") params.set("category", category);
		if (sort !== "featured") params.set("sort", sort);
		if (stock !== "all") params.set("stock", stock);

		fetch(`/api/products/list?${params.toString()}`, { signal: controller.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to load products: ${response.status}`);
				}
				return response.json() as Promise<PaginatedProductsResult>;
			})
			.then((data) => {
				if (id === requestId.current) {
					setProducts(data);
					setIsStale(false);
				}
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}
				console.error(error);
				if (id === requestId.current) {
					setIsStale(false);
				}
			});

		return () => controller.abort();
	}, [isDefault, q, category, sort, stock, page, initialProducts]);

	return (
		<div
			aria-busy={isStale}
			className={isStale ? "opacity-60 transition-opacity" : "transition-opacity"}
		>
			<ProductGridContent
				products={products}
				filters={{ q, category, sort, stock }}
			/>
		</div>
	);
}
