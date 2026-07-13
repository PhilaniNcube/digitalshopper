import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, categories } from "@/db/schema";
import { count, eq } from "drizzle-orm";

const BASE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.digitalshopper.co.za";

const CATEGORY_PAGE_SIZE = 12;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [allProducts, allCategories, productCounts] = await Promise.all([
		db
			.select({ slug: products.slug, updatedAt: products.updatedAt })
			.from(products)
			.where(eq(products.active, true)),
		db
			.select({
				id: categories.id,
				slug: categories.slug,
				path: categories.path,
				updatedAt: categories.updatedAt,
			})
			.from(categories),
		db
			.select({ categoryId: products.categoryId, count: count() })
			.from(products)
			.where(eq(products.active, true))
			.groupBy(products.categoryId),
	]);

	const directCountByCategoryId = new Map<string, number>();
	for (const row of productCounts) {
		if (row.categoryId) {
			directCountByCategoryId.set(row.categoryId, Number(row.count));
		}
	}

	function computeDescendantProductCount(categoryPath: string) {
		let total = 0;
		const prefix = `${categoryPath}/`;
		for (const sibling of allCategories) {
			if (sibling.path === categoryPath || sibling.path.startsWith(prefix)) {
				total += directCountByCategoryId.get(sibling.id) ?? 0;
			}
		}
		return total;
	}

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${BASE_URL}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/categories`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/shipping`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/returns`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/privacy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/blogs`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
	];

	const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
		url: `${BASE_URL}/products/${p.slug}`,
		lastModified: p.updatedAt,
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const categoryRoutes: MetadataRoute.Sitemap = allCategories.flatMap((c) => {
		const totalItems = computeDescendantProductCount(c.path);
		const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / CATEGORY_PAGE_SIZE);
		const routes: MetadataRoute.Sitemap = [
			{
				url: `${BASE_URL}/categories/${c.slug}`,
				lastModified: c.updatedAt,
				changeFrequency: "weekly",
				priority: 0.6,
			},
		];

		for (let page = 2; page <= totalPages; page += 1) {
			routes.push({
				url: `${BASE_URL}/categories/${c.slug}?page=${page}`,
				lastModified: c.updatedAt,
				changeFrequency: "weekly",
				priority: 0.5,
			});
		}

		return routes;
	});

	const staticBlogs = [
		{ slug: "sticker-shock", lastModified: new Date("2026-04-18T13:30:00.000Z") },
		{ slug: "best-budget-anc-earbuds-and-wireless-headphones-under-R500", lastModified: new Date("2026-07-11T14:00:00.000Z") },
		{ slug: "best-desktop-computers-south-africa-2026-guide", lastModified: new Date("2026-07-11T16:00:00.000Z") },
	];

	const blogRoutes: MetadataRoute.Sitemap = staticBlogs.map((post) => ({
		url: `${BASE_URL}/blogs/${post.slug}`,
		lastModified: post.lastModified,
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}