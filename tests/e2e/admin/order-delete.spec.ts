import { expect, test } from "@playwright/test";

import { getAdminUser } from "../../fixtures/auth";
import { signInViaUi } from "../../utils/auth";
import {
  createOrderWithDependentRow,
  deleteOrderById,
  dropOrderDependencyTable,
  fetchDependentRowCount,
  fetchOrderById,
} from "../../utils/db";

test.describe("admin order deletion", () => {
  test("deletes an order and its dependent rows", async ({ page, browserName }, testInfo) => {
    const user = getAdminUser();
    test.skip(!user, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run this test.");

    const seed = `${browserName}${testInfo.parallelIndex}${Date.now()}`;
    const fixture = await createOrderWithDependentRow(seed);

    try {
      expect(fixture.dependentRowCount).toBe(1);

      await signInViaUi(page, user!);
      await page.goto("/dashboard/orders");

      await page.getByPlaceholder("Search by email...").fill(fixture.email);

      const orderRow = page.getByRole("row").filter({ hasText: fixture.email });
      await expect(orderRow).toBeVisible();

      await orderRow.getByRole("button", { name: /^Delete$/i }).click();
      await expect(page.getByText(/delete this order\?/i)).toBeVisible();
      await page.getByRole("button", { name: /^Delete order$/i }).click();

      await expect(page.getByText(/order deleted successfully\./i)).toBeVisible();
      await expect(orderRow).toHaveCount(0);

      await expect
        .poll(async () => fetchOrderById(fixture.orderId))
        .toBeNull();

      await expect
        .poll(async () => fetchDependentRowCount(fixture.dependentTableName, fixture.orderId))
        .toBe(0);
    } finally {
      await deleteOrderById(fixture.orderId);
      await dropOrderDependencyTable(fixture.dependentTableName);
    }
  });
});