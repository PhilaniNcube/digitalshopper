import { expect, test } from "@playwright/test";

import { openFirstCatalogProduct } from "../../utils/catalog";

test.describe("product details", () => {
  test("opens a product details page from the catalog", async ({ page }) => {
    const product = await openFirstCatalogProduct(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(
      page.getByRole("heading", { name: new RegExp(product!.title, "i") }),
    ).toBeVisible();
    await expect(page.getByText(/Products/i).first()).toBeVisible();
  });

  test("shows add to cart and stock messaging on the product page", async ({
    page,
  }) => {
    const product = await openFirstCatalogProduct(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await expect(page.getByRole("button", { name: /Add to cart/i })).toBeVisible();
    await expect(page.getByText(/In stock|Low stock|Back order/i)).toBeVisible();
  });
});