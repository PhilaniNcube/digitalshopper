import { CATEGORIES_CACHE_TAG, getCategories } from "@/dal/queries/categories";
import { decodeHtmlEntities } from "@/lib/utils";
import { cacheLife, cacheTag } from "next/cache";
import NavCategoriesMenu, { NavMobileMenuSheet } from "./nav-categories-menu";

type CategoryRecord = Awaited<ReturnType<typeof getCategories>>[number];

type CategoryNode = CategoryRecord & {
  href: string;
  children: CategoryNode[];
};

function normalizeCategoryRecord(category: CategoryRecord): CategoryRecord {
  return {
    ...category,
    name: decodeHtmlEntities(category.name),
    path: decodeHtmlEntities(category.path),
    sourcePath: category.sourcePath ? decodeHtmlEntities(category.sourcePath) : category.sourcePath,
    sourcePathAlt: category.sourcePathAlt ? decodeHtmlEntities(category.sourcePathAlt) : category.sourcePathAlt,
  };
}

function createCategoryHref(slug: string) {
  return `/categories/${encodeURIComponent(slug)}`;
}

function buildCategoryTree(categories: CategoryRecord[]) {
  const categoryMap = new Map<string, CategoryNode>();

  for (const category of categories) {
    const normalizedCategory = normalizeCategoryRecord(category);

    categoryMap.set(category.id, {
      ...normalizedCategory,
      href: createCategoryHref(normalizedCategory.slug),
      children: [],
    });
  }

  const roots: CategoryNode[] = [];

  for (const category of categoryMap.values()) {
    if (category.parentId) {
      const parentCategory = categoryMap.get(category.parentId);

      if (parentCategory) {
        parentCategory.children.push(category);
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

async function getNavCategoryTree() {
  "use cache";

  cacheLife("days");
  cacheTag(CATEGORIES_CACHE_TAG);

  const categories = await getCategories();

  return buildCategoryTree(categories);
}

const NavCategories = async () => {
  const categoryTree = await getNavCategoryTree();

  return <NavCategoriesMenu categories={categoryTree} />;
};

export default NavCategories;

/** Server component — renders only the mobile hamburger Sheet. Place it in the header's right side so the button is always last/rightmost on mobile. */
export const NavMobileCategories = async () => {
  const categoryTree = await getNavCategoryTree();

  return <NavMobileMenuSheet categories={categoryTree} />;
};
