import { expect, type Page } from "@playwright/test";

import type { E2EUser } from "../fixtures/auth";

export async function signInViaUi(page: Page, user: E2EUser) {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();

  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: /^Sign in$/i }).click();
}