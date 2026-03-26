import { expect, test } from "@playwright/test";

import { gotoCatalog } from "../../utils/catalog";

test.describe("storefront catalog", () => {
  test("updates the query string when searching from the catalog page @smoke", async ({
    page,
  }) => {
    await gotoCatalog(page);

    const searchInput = page.getByPlaceholder(/Search title, slug, SKU/i);
    await searchInput.fill("laptop");

    await expect(page).toHaveURL(/q=laptop/);
  });

  test("toggles the in-stock inventory filter from the sidebar", async ({ page }) => {
    await gotoCatalog(page);

    const stockButton = page.getByRole("button", { name: /Show all inventory/i });
    await stockButton.click();

    await expect(page).toHaveURL(/stock=in-stock/);
    await expect(
      page.getByRole("button", { name: /In stock only/i }),
    ).toBeVisible();
  });
});