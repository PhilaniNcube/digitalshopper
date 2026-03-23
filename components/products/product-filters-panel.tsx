import { getCategories } from "@/dal/queries/categories";
import { cacheLife } from "next/cache";

import { ProductFilters } from "@/components/products/product-filters";

export async function ProductFiltersPanel() {
	"use cache";

	cacheLife("days");

	const categories = await getCategories();
	const rootCategories = categories.filter((category) => category.depth <= 1).slice(0, 10);

	return <ProductFilters categories={rootCategories} />;
}