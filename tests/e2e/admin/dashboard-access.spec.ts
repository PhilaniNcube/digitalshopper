import { expect, test } from "@playwright/test";

import { getAdminUser, getNonAdminUser } from "../../fixtures/auth";
import { signInViaUi } from "../../utils/auth";

test.describe("dashboard access", () => {
  test("redirects signed out users from dashboard to sign in @smoke", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByRole("heading", { name: /^Sign in$/i })).toBeVisible();
  });

  test("allows an admin user to reach the dashboard", async ({ page }) => {
    const user = getAdminUser();
    test.skip(!user, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run this test.");

    await signInViaUi(page, user!);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /Operations overview/i }),
    ).toBeVisible();
  });

  test("redirects a non-admin user away from dashboard", async ({ page }) => {
    const user = getNonAdminUser();
    test.skip(
      !user,
      "Set E2E_NON_ADMIN_EMAIL and E2E_NON_ADMIN_PASSWORD to run this test.",
    );

    await signInViaUi(page, user!);

    await expect(page).toHaveURL(/^(?!.*\/dashboard).*/);
  });
});