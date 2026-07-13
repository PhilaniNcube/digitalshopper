"use client";

import Link from "next/link";
import {
	ArrowRightIcon,
	ChevronRightIcon,
	MenuIcon,
	SearchIcon,
	SparklesIcon,
} from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MegaMenuCategory = {
	id: string;
	name: string;
	slug: string;
	path: string;
	depth: number;
	href: string;
	children: MegaMenuCategory[];
};

type NavCategoriesMenuProps = {
	categories: MegaMenuCategory[];
};

const MAX_PRIMARY_CATEGORIES = 4;

const PRIORITY_SLUGS = ["cpu", "notebooks", "headphones", "power"];

function collectFeaturedCategories(category: MegaMenuCategory) {
	if (category.children.length === 0) {
		return [];
	}

	return category.children.slice(0, 3);
}

function collectMenuSections(category: MegaMenuCategory) {
	if (category.children.length === 0) {
		return [category];
	}

	return category.children.slice(0, 12);
}

function flattenCategoryNodes(categories: MegaMenuCategory[]): Map<string, MegaMenuCategory> {
	const map = new Map<string, MegaMenuCategory>();

	const walk = (node: MegaMenuCategory) => {
		map.set(node.slug, node);
		for (const child of node.children) {
			walk(child);
		}
	};

	for (const category of categories) {
		walk(category);
	}

	return map;
}

function splitDesktopCategories(categories: MegaMenuCategory[]) {
	const flatNodes = flattenCategoryNodes(categories);

	const primaryCategories = PRIORITY_SLUGS
		.map((slug) => flatNodes.get(slug))
		.filter((category): category is MegaMenuCategory => Boolean(category))
		.slice(0, MAX_PRIMARY_CATEGORIES);

	const primaryIds = new Set(primaryCategories.map((category) => category.id));
	const overflowCategories = categories.filter((category) => !primaryIds.has(category.id));

	return {
		primaryCategories,
		overflowCategories,
	};
}

function CategoryPanel({ category }: { category: MegaMenuCategory }) {
	const featuredCategories = collectFeaturedCategories(category);
	const sections = collectMenuSections(category);

	return (
		<div className="mx-auto grid w-full max-h-[min(72vh,760px)] overflow-y-auto lg:grid-cols-[300px_minmax(0,1fr)]">
			<div className="relative p-6 border-b border-white/8 bg-primary lg:border-r lg:border-b-0">
				<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
				<p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/65">{category.path}</p>
				<h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
					{category.name}
				</h3>
				<p className="max-w-xs mt-3 text-sm leading-6 text-slate-300">
					Browse every {category.name.toLowerCase()} lane from the live catalog hierarchy.
				</p>
			
				<Link
					href={category.href}
					className="group mt-8 flex items-center justify-between rounded-[1.4rem] border border-white bg-black px-4 py-3 text-sm font-medium text-white! transition hover:border-primary-strong hover:bg-primary-strong"
				>
					<span>Shop all {category.name}</span>
					<ArrowRightIcon className="transition size-4 group-hover:translate-x-1" />
				</Link>
				{featuredCategories.length > 0 ? (
					<div className="mt-8 space-y-2">
						<p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Highlights</p>
						{featuredCategories.map((featuredCategory) => (
							<Link
								key={featuredCategory.id}
								href={featuredCategory.href}
								className="flex items-center justify-between px-3 py-2 text-sm transition rounded-2xl text-primary-strong! hover:bg-white/6 hover:text-white"
							>
								<span>{featuredCategory.name}</span>
								<ChevronRightIcon className="size-4 text-slate-500" />
							</Link>
						))}
					</div>
				) : null}
			</div>

			<div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4 bg-primary">
				{sections.map((section) => (
					<div key={section.id} className="rounded-[1.5rem] border border-white/8  p-4 text-white">
						<Link href={section.href} className="flex items-start justify-between gap-3 group">
							<div>
								<p className="text-base font-medium text-white transition group-hover:text-cyan-200">
									{section.name}
								</p>
								
							</div>
							<ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
						</Link>
						{section.children.length > 0 ? (
							<div className="flex flex-wrap gap-2 mt-4">
								{section.children.slice(0, 6).map((subCategory) => (
									<Link
										key={subCategory.id}
										href={subCategory.href}
										className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-100"
									>
										{subCategory.name}
									</Link>
								))}
							</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}

function OverflowCategoryPanel({ categories }: { categories: MegaMenuCategory[] }) {
	return (
		<div className="mx-auto grid w-full max-h-[min(72vh,760px)] overflow-y-auto lg:grid-cols-[300px_minmax(0,1fr)]">
			<div className="relative p-6 border-b border-white/8 bg-primary lg:border-r lg:border-b-0">
				<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
			
				<h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-white">More categories</h3>
				
				<Link
					href="/products"
					className="group mt-8 flex items-center justify-between rounded-[1.4rem] border border-white bg-black px-4 py-3 text-sm font-medium text-white! transition hover:border-primary-strong hover:bg-primary-strong"
				>
					<span>Open full catalog</span>
					<ArrowRightIcon className="transition size-4 group-hover:translate-x-1" />
				</Link>
			</div>

			<div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 bg-primary">
				{categories.map((category) => (
					<div key={category.id} className="rounded-[1.5rem] border border-white/8 p-4 text-white">
						<Link href={category.href} className="flex items-start justify-between gap-3 group">
							<div>
								<p className="text-base font-medium text-white transition group-hover:text-cyan-200">
									{category.name}
								</p>
							</div>
							<ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
						</Link>
						{category.children.length > 0 ? (
							<div className="flex flex-wrap gap-2 mt-4">
								{category.children.slice(0, 6).map((subCategory) => (
									<Link
										key={subCategory.id}
										href={subCategory.href}
										className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-100"
									>
										{subCategory.name}
									</Link>
								))}
							</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}

function MobileCategorySection({ category }: { category: MegaMenuCategory }) {
	return (
		<AccordionItem value={category.id} className="border-white/8">
			<AccordionTrigger className="py-4 text-base font-medium text-white hover:no-underline">
				{category.name}
			</AccordionTrigger>
			<AccordionContent className="pb-5">
				<div className="space-y-3">
					<SheetClose asChild>
						<Link
							href={category.href}
							className="flex items-center justify-between rounded-[1.25rem] border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-50"
						>
							<span>Shop all {category.name}</span>
							<ArrowRightIcon className="size-4" />
						</Link>
					</SheetClose>

					{category.children.length > 0 ? (
						<div className="space-y-3">
							{category.children.map((childCategory) => (
								<div key={childCategory.id} className="rounded-[1.25rem] border border-white/8 bg-white/3 p-4">
									<SheetClose asChild>
										<Link href={childCategory.href} className="flex items-center justify-between gap-3 text-sm font-medium text-white">
											<span>{childCategory.name}</span>
											<ChevronRightIcon className="size-4 text-slate-500" />
										</Link>
									</SheetClose>
									{childCategory.children.length > 0 ? (
										<div className="flex flex-wrap gap-2 mt-3">
											{childCategory.children.slice(0, 8).map((subCategory) => (
												<SheetClose asChild key={subCategory.id}>
													<Link
														href={subCategory.href}
														className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300"
													>
														{subCategory.name}
													</Link>
												</SheetClose>
											))}
										</div>
									) : null}
								</div>
							))}
						</div>
					) : null}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}

export default function NavCategoriesMenu({ categories }: NavCategoriesMenuProps) {
	if (categories.length === 0) {
		return null;
	}

	const { primaryCategories, overflowCategories } = splitDesktopCategories(categories);

	return (
		<div className="items-center hidden min-w-0 gap-3 lg:flex">
			<NavigationMenu viewport={false} className="max-w-full min-w-0">
				<NavigationMenuList className="gap-1">
					{primaryCategories.map((category) => (
						<NavigationMenuItem key={category.id}>
							<NavigationMenuTrigger className="px-3 text-sm font-medium bg-transparent rounded-none h-11 text-slate-300 hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white data-open:bg-transparent data-open:text-white">
								{category.name}
							</NavigationMenuTrigger>
							<NavigationMenuContent className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07101d]/95 p-0 text-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] supports-backdrop-filter:backdrop-blur-2xl lg:fixed lg:inset-x-0 lg:top-20 lg:z-50 lg:mx-auto lg:w-[90vw] lg:max-w-[90vw]">
								<CategoryPanel category={category} />
							</NavigationMenuContent>
						</NavigationMenuItem>
					))}
					{overflowCategories.length > 0 ? (
						<NavigationMenuItem>
							<NavigationMenuTrigger className="px-3 text-sm font-medium bg-transparent rounded-none h-11 text-slate-300 hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white data-open:bg-transparent data-open:text-white">
								More
							</NavigationMenuTrigger>
							<NavigationMenuContent className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07101d]/95 p-0 text-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] supports-backdrop-filter:backdrop-blur-2xl lg:fixed lg:inset-x-0 lg:top-20 lg:z-50 lg:mx-auto lg:w-[90vw] lg:max-w-[90vw]">
								<OverflowCategoryPanel categories={overflowCategories} />
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : null}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

/** Standalone mobile Sheet (trigger + drawer). Place this wherever the hamburger should appear in the header. Hidden on lg+. */
export function NavMobileMenuSheet({ categories }: NavCategoriesMenuProps) {
	if (categories.length === 0) return null;

	return (
		<div className="lg:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="text-white border rounded-full border-white/10 bg-white/4 hover:bg-white/8"
						aria-label="Open category menu"
					>
						<MenuIcon className="size-5" />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="right"
					className={cn(
						"w-[min(92vw,420px)] border-white/10 bg-[#050817]/95 p-0 text-white",
						"supports-backdrop-filter:backdrop-blur-2xl",
					)}
				>
					<SheetHeader className="pb-5 pr-12 space-y-4 border-b border-white/8">
						<div className="flex items-center gap-2 text-cyan-100">
							<span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
							<span className="text-[11px] uppercase tracking-[0.26em] text-cyan-100/75">Tech Lab Catalog</span>
						</div>
						<SheetTitle className="font-display text-3xl tracking-[-0.04em] text-white">Browse categories</SheetTitle>
						<SheetDescription className="max-w-sm text-sm leading-6 text-slate-400">
							A responsive megamenu shell generated from the live category hierarchy.
						</SheetDescription>
						<SheetClose asChild>
							<Link
								href="/products"
								className="flex items-center justify-between rounded-[1.35rem] border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-50"
							>
								<span>Open full catalog</span>
								<ArrowRightIcon className="size-4" />
							</Link>
						</SheetClose>
					</SheetHeader>

					<div className="max-h-[calc(100vh-180px)] overflow-y-auto px-4 pb-6">
						<Accordion type="multiple" className="w-full">
							{categories.map((category) => (
								<MobileCategorySection key={category.id} category={category} />
							))}
						</Accordion>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}