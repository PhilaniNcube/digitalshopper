import { expect, test } from "@playwright/test";

import { addFirstCatalogProductToCart } from "../../utils/catalog";

test.describe("checkout validation", () => {
  test("disables checkout submission when the cart is empty @smoke", async ({
    page,
  }) => {
    await page.goto("/checkout");

    await expect(page.getByRole("heading", { name: /^Checkout$/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Pay with Payfast/i }),
    ).toBeDisabled();
  });

  test("shows validation errors when submitting an incomplete checkout form", async ({
    page,
  }) => {
    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await page.goto("/checkout");
    await page.getByRole("button", { name: /Pay with Payfast/i }).click();

    await expect(page.getByText(/At least 2 characters/i).first()).toBeVisible();
    await expect(page.getByText(/Enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/At least 10 digits/i)).toBeVisible();
  });
});