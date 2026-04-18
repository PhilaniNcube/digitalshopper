import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchPublishedPosts } from "@/dal/queries/posts";

const BASE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.digitalshopper.co.za";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [allProducts, allCategories, allPosts] = await Promise.all([
		db
			.select({ slug: products.slug, updatedAt: products.updatedAt })
			.from(products)
			.where(eq(products.active, true)),
		db
			.select({ slug: categories.slug, updatedAt: categories.updatedAt })
			.from(categories),
		fetchPublishedPosts(),
	]);

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

	const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((c) => ({
		url: `${BASE_URL}/products?category=${c.slug}`,
		lastModified: c.updatedAt,
		changeFrequency: "weekly",
		priority: 0.6,
	}));

	const blogRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
		url: `${BASE_URL}/blogs/${post.slug}`,
		lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
