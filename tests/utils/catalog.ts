import { expect, type Page } from "@playwright/test";

export type CatalogProduct = {
  title: string;
};

export async function gotoCatalog(page: Page) {
  await page.goto("/products");
  await expect(
    page.getByRole("heading", {
      name: /Explore Our Extensive Product Catalog/i,
    }),
  ).toBeVisible();
}

export async function openFirstCatalogProduct(
  page: Page,
): Promise<CatalogProduct | null> {
  await gotoCatalog(page);

  const emptyState = page.getByRole("heading", {
    name: /No products matched the current filter set/i,
  });

  if (await emptyState.isVisible().catch(() => false)) {
    return null;
  }

  const productLink = page
    .locator('a[href^="/products/"]')
    .filter({ has: page.locator("h3") })
    .first();

  if ((await productLink.count()) === 0) {
    return null;
  }

  const title = (await productLink.locator("h3").textContent())?.trim() ?? "product";

  await productLink.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return { title };
}

export async function addFirstCatalogProductToCart(
  page: Page,
): Promise<CatalogProduct | null> {
  const product = await openFirstCatalogProduct(page);

  if (!product) {
    return null;
  }

  await page.getByRole("button", { name: /Add to cart/i }).click();
  await expect(page.getByRole("heading", { name: /^Cart$/i })).toBeVisible();

  return product;
}