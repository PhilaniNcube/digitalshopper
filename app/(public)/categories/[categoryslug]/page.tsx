import { CategoryProducts, CategoryProductsSkeleton } from "@/components/products/category-products";
import { getCategoryBySlug } from "@/dal/queries/categories";
import { decodeHtmlEntities } from "@/lib/utils";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ categoryslug: string }>;
}): Promise<Metadata> {
	const { categoryslug } = await params;
	const category = await getCategoryBySlug(categoryslug);

	if (!category) {
		return { title: "Category Not Found | Digital Shopper" };
	}

	const name = decodeHtmlEntities(category.name);

	return {
		title: `${name} | Digital Shopper`,
		description: `Browse ${name} products at Digital Shopper. Fast delivery across South Africa.`,
		openGraph: {
			title: `${name} | Digital Shopper`,
			description: `Browse ${name} products at Digital Shopper.`,
		},
	};
}

export default function CategoryPage({
	params,
	searchParams,
}: {
	params: Promise<{ categoryslug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	return (
		<Suspense fallback={<CategoryProductsSkeleton />}>
			<CategoryProducts paramsPromise={params} searchParamsPromise={searchParams} />
		</Suspense>
	);
}