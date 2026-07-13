import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES_CACHE_TAG, getCategories } from "@/dal/queries/categories";
import { decodeHtmlEntities } from "@/lib/utils";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
	title: "Categories | Digital Shopper",
	description:
		"Browse every category in the Digital Shopper catalog — from notebooks and components to power and smart TVs.",
	openGraph: {
		title: "Categories | Digital Shopper",
		description:
			"Browse every category in the Digital Shopper catalog — from notebooks and components to power and smart TVs.",
	},
};

type CategoryRecord = Awaited<ReturnType<typeof getCategories>>[number];

type CategoryNode = CategoryRecord & {
	children: CategoryNode[];
};

function buildCategoryTree(allCategories: CategoryRecord[]): CategoryNode[] {
	const categoryMap = new Map<string, CategoryNode>();

	for (const category of allCategories) {
		categoryMap.set(category.id, {
			...category,
			name: decodeHtmlEntities(category.name),
			path: decodeHtmlEntities(category.path),
			children: [],
		});
	}

	const roots: CategoryNode[] = [];

	for (const category of categoryMap.values()) {
		if (category.parentId) {
			const parent = categoryMap.get(category.parentId);

			if (parent) {
				parent.children.push(category);
				continue;
			}
		}

		roots.push(category);
	}

	const sortTree = (nodes: CategoryNode[]) => {
		nodes.sort((left, right) => left.name.localeCompare(right.name));

		for (const node of nodes) {
			sortTree(node.children);
		}
	};

	sortTree(roots);

	return roots;
}

async function getCategoryTree() {
	"use cache";

	cacheLife("days");
	cacheTag(CATEGORIES_CACHE_TAG);

	const allCategories = await getCategories();

	return buildCategoryTree(allCategories);
}

export default async function CategoriesPage() {
	const categoryTree = await getCategoryTree();

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<section className="relative overflow-hidden bg-surface-low px-6 py-8 ring-1 ring-white/6 sm:px-8 lg:px-10 lg:py-10">
				<h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
					Explore Categories
				</h1>
				<p className="mt-4 max-w-3xl text-lg leading-7 text-slate-400">
					Dive into the full Digital Shopper catalog. Pick a category to see every matching product, with
					pagination handled on its own dedicated page.
				</p>
			</section>

			<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{categoryTree.map((category) => (
					<Link
						key={category.id}
						href={`/categories/${category.slug}`}
						prefetch={false}
						className="group flex h-full flex-col justify-between gap-5 rounded-[1.6rem] bg-surface-low p-6 ring-1 ring-white/6 transition duration-300 hover:-translate-y-1 hover:bg-surface-high hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
					>
						<div className="space-y-3">
							<p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{category.path}</p>
							<h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
								{category.name}
							</h2>
						</div>
						<div className="space-y-4">
							{category.children.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{category.children.slice(0, 5).map((child) => (
										<span
											key={child.id}
											className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300"
										>
											{child.name}
										</span>
									))}
								</div>
							) : null}
							<div className="flex items-center gap-2 text-sm font-medium text-primary-strong">
								<span>Shop {category.name}</span>
								<ArrowRight className="size-4 transition group-hover:translate-x-1" />
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}