import { expect, test } from "@playwright/test";

test.describe("storefront home", () => {
  test("shows the homepage hero and primary actions @smoke", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /South Africa's Tech Picks/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Explore catalog/i }),
    ).toBeVisible();
    await expect(page.getByText(/Official warranty support/i)).toBeVisible();
  });

  test("navigates from the homepage to the products page @smoke", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Explore catalog/i }).click();

    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole("heading", {
        name: /Explore Our Extensive Product Catalog/i,
      }),
    ).toBeVisible();
  });
});