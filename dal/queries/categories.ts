import { categories } from "@/db/schema";
import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";

export const CATEGORIES_CACHE_TAG = "categories";

export async function getCategories() {
  "use cache";

  cacheLife("days");
  cacheTag(CATEGORIES_CACHE_TAG);

  return await db.select().from(categories).orderBy(categories.name);
}
