import { createHash } from "node:crypto";

import { getEnvValue } from "./env";

export type PayfastFields = Record<string, string>;

export type PayfastNotifyPayload = PayfastFields & {
  payment_status: "COMPLETE";
  item_name: string;
  pf_payment_id: string;
  signature: string;
};

function encode(value: string) {
  return encodeURIComponent(value.trim())
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/~/g, "%7E")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function buildSignatureSource(fields: PayfastFields, passphrase: string) {
  const pairs = Object.entries(fields)
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => `${key}=${encode(value)}`);

  if (passphrase) {
    pairs.push(`passphrase=${encode(passphrase)}`);
  }

  return pairs.join("&");
}

function getPassphrase() {
  return (
    getEnvValue("PAYFAST_PASSPHRASE") ??
    getEnvValue("NEXT_PUBLIC_PASSPHRASE") ??
    ""
  ).trim();
}

export function getPayfastSandboxUrl() {
  return (
    getEnvValue("PAYFAST_URL") ??
    getEnvValue("NEXT_PUBLIC_PAYFAST_URL") ??
    "https://sandbox.payfast.co.za/eng/process"
  ).trim();
}

export function hasPayfastConfig() {
  const merchantId = getEnvValue("PAYFAST_MERCHANT_ID") ?? getEnvValue("NEXT_PUBLIC_MERCHANT_ID");
  const merchantKey = getEnvValue("PAYFAST_MERCHANT_KEY") ?? getEnvValue("NEXT_PUBLIC_MERCHANT_KEY");

  return Boolean(merchantId?.trim() && merchantKey?.trim());
}

export function signPayfastFields(fields: PayfastFields) {
  const signatureSource = buildSignatureSource(fields, getPassphrase());
  return createHash("md5").update(signatureSource).digest("hex");
}

export function createNotifyPayload(
  orderId: string,
  paymentId = `PF-${Date.now()}`,
): PayfastNotifyPayload {
  const fields: PayfastFields = {
    payment_status: "COMPLETE",
    item_name: orderId,
    pf_payment_id: paymentId,
  };

  return {
    payment_status: "COMPLETE",
    item_name: orderId,
    pf_payment_id: paymentId,
    ...fields,
    signature: signPayfastFields(fields),
  };
}