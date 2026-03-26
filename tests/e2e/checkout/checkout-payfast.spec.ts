import { expect, test, type Page } from "@playwright/test";

import { checkoutCustomer, getCheckoutInputEntries } from "../../fixtures/checkout";
import { fetchOrderById } from "../../utils/db";
import { addFirstCatalogProductToCart } from "../../utils/catalog";
import {
  createNotifyPayload,
  getPayfastSandboxUrl,
  hasPayfastConfig,
} from "../../utils/payfast";

async function fillCheckoutForm(page: Page) {
  for (const [name, value] of getCheckoutInputEntries()) {
    const field = page.locator(`[name="${name}"]`);
    await field.fill(value);
  }
}

function parseFormBody(body: string | null) {
  const params = new URLSearchParams(body ?? "");
  return Object.fromEntries(params.entries());
}

async function closeCartIfOpen(page: Page) {
  const closeButton = page.getByRole("button", { name: /Close cart/i });

  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    await expect(closeButton).toBeHidden();
  }
}

test.describe("checkout payfast handoff", () => {
  test("posts the order to the Payfast sandbox with signed payment fields @checkout", async ({
    page,
  }) => {
    test.skip(!hasPayfastConfig(), "Payfast merchant configuration is required for this test.");

    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await closeCartIfOpen(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page);

    let capturedPostData: string | null = null;
    await page.route(getPayfastSandboxUrl(), async (route, request) => {
      capturedPostData = request.postData() ?? null;
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body><h1>Sandbox capture</h1></body></html>",
      });
    });

    await page.getByRole("button", { name: /Pay with Payfast/i }).click();
    await expect(page.getByRole("heading", { name: /Sandbox capture/i })).toBeVisible();

    expect(capturedPostData).toBeTruthy();

    if (!capturedPostData) {
      throw new Error("Expected the Payfast sandbox request to be captured.");
    }

    const payload = parseFormBody(capturedPostData);

    expect(payload.merchant_id).toBeTruthy();
    expect(payload.merchant_key).toBeTruthy();
    expect(payload.signature).toBeTruthy();
    expect(payload.name_first).toBe(checkoutCustomer.firstName);
    expect(payload.name_last).toBe(checkoutCustomer.lastName);
    expect(payload.email_address).toBe(checkoutCustomer.email);
    expect(payload.cell_number).toBe(checkoutCustomer.phone);
    expect(payload.return_url).toContain(`/orders/${payload.item_name}/success`);
    expect(payload.cancel_url).toContain(`/orders/${payload.item_name}/cancel`);
    expect(payload.notify_url).toContain("/api/payfast/notify");
    expect(payload.amount).toMatch(/^\d+\.\d{2}$/);
  });

  test("accepts a locally simulated Payfast ITN and marks the order as paid @checkout", async ({
    page,
    request,
  }) => {
    test.skip(!hasPayfastConfig(), "Payfast merchant configuration is required for this test.");

    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await closeCartIfOpen(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page);

    let orderId: string | null = null;
    await page.route(getPayfastSandboxUrl(), async (route, capturedRequest) => {
      const payload = parseFormBody(capturedRequest.postData() ?? null);
      orderId = payload.item_name ?? null;

      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body><h1>Sandbox capture</h1></body></html>",
      });
    });

    await page.getByRole("button", { name: /Pay with Payfast/i }).click();
    await expect(page.getByRole("heading", { name: /Sandbox capture/i })).toBeVisible();

    expect(orderId).toBeTruthy();

    const notifyPayload = createNotifyPayload(orderId!);
    const response = await request.post("/api/payfast/notify", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      form: notifyPayload,
    });

    expect(response.ok()).toBe(true);

    await expect
      .poll(async () => fetchOrderById(orderId!))
      .toMatchObject({
        id: orderId,
        status: "paid",
        payfastPaymentId: notifyPayload.pf_payment_id,
      });

    await page.goto(`/orders/${orderId}/success`);
    await expect(
      page.getByRole("heading", { name: /Your order is confirmed\./i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Continue shopping/i }),
    ).toBeVisible();
  });

  test("rejects a Payfast ITN with an invalid signature and leaves the order pending @checkout", async ({
    page,
    request,
  }) => {
    test.skip(!hasPayfastConfig(), "Payfast merchant configuration is required for this test.");

    const product = await addFirstCatalogProductToCart(page);
    test.skip(!product, "This test needs at least one catalog product.");

    await closeCartIfOpen(page);
    await page.goto("/checkout");
    await fillCheckoutForm(page);

    let orderId: string | null = null;
    await page.route(getPayfastSandboxUrl(), async (route, capturedRequest) => {
      const payload = parseFormBody(capturedRequest.postData() ?? null);
      orderId = payload.item_name ?? null;

      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body><h1>Sandbox capture</h1></body></html>",
      });
    });

    await page.getByRole("button", { name: /Pay with Payfast/i }).click();
    await expect(page.getByRole("heading", { name: /Sandbox capture/i })).toBeVisible();

    expect(orderId).toBeTruthy();

    const response = await request.post("/api/payfast/notify", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        payment_status: "COMPLETE",
        item_name: orderId!,
        pf_payment_id: `PF-INVALID-${Date.now()}`,
        signature: "invalid-signature",
      },
    });

    expect(response.status()).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid signature",
    });

    await expect
      .poll(async () => fetchOrderById(orderId!))
      .toMatchObject({
        id: orderId,
        status: "pending",
        payfastPaymentId: null,
      });
  });
});