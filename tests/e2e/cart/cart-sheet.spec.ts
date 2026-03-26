import { expect, test } from "@playwright/test";

import { addFirstCatalogProductToCart } from "../../utils/catalog";

test.describe("cart sheet", () => {
  test("adds a product to the cart and opens the cart sheet", async ({ page }) => {
    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await expect(page.getByTestId("cart-sheet")).toBeVisible();
    await expect(page.getByText(product!.title)).toBeVisible();
    await expect(page.getByRole("link", { name: /Proceed to checkout/i })).toBeVisible();
  });

  test("increments and decrements cart quantity", async ({ page }) => {
    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    const increaseButton = page.getByRole("button", {
      name: new RegExp(`Increase quantity for ${product!.title}`, "i"),
    });
    const decreaseButton = page.getByRole("button", {
      name: new RegExp(`Decrease quantity for ${product!.title}`, "i"),
    });

    await increaseButton.click();
    await expect(page.getByText(/^2$/)).toBeVisible();

    await decreaseButton.click();
    await expect(page.getByText(/^1$/)).toBeVisible();
  });
});