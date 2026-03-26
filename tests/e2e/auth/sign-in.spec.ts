import { expect, test } from "@playwright/test";

import { getVerifiedUser } from "../../fixtures/auth";
import { signInViaUi } from "../../utils/auth";

test.describe("auth sign in", () => {
  test("renders the sign in form and recovery links @smoke", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { name: /^Sign in$/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("link", { name: /Forgot password\?/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Create account/i })).toBeVisible();
  });

  test("signs in a verified user and redirects to the dashboard", async ({ page }) => {
    const user = getVerifiedUser();
    test.skip(!user, "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run this test.");

    await signInViaUi(page, user!);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /Operations overview/i }),
    ).toBeVisible();
  });
});