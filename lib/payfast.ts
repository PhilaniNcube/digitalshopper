import type { Order } from "@/db/schema";
import { createHash } from "crypto";

type PayfastFields = Record<string, string>;

function getRequiredValue(...values: Array<string | undefined>) {
	const value = values.find(Boolean);

	if (!value) {
		throw new Error("Missing Payfast configuration.");
	}

	return value;
}

function encode(value: string) {
	return encodeURIComponent(value).replace(/%20/g, "+");
}

export function getPayfastConfig() {
	return {
		merchantId: getRequiredValue(
			process.env.PAYFAST_MERCHANT_ID,
			process.env.NEXT_PUBLIC_MERCHANT_ID,
		),
		merchantKey: getRequiredValue(
			process.env.PAYFAST_MERCHANT_KEY,
			process.env.NEXT_PUBLIC_MERCHANT_KEY,
		),
		passphrase:
			process.env.PAYFAST_PASSPHRASE ?? process.env.NEXT_PUBLIC_PASSPHRASE ?? "",
		paymentUrl:
			process.env.PAYFAST_URL ??
			process.env.NEXT_PUBLIC_PAYFAST_URL ??
			"https://sandbox.payfast.co.za/eng/process",
		siteUrl:
			process.env.BETTER_AUTH_URL ??
			process.env.NEXT_PUBLIC_SITE_URL ??
			"http://localhost:3000",
	};
}

export function signPayfastFields(fields: PayfastFields) {
	const { passphrase } = getPayfastConfig();
	const pairs = Object.entries(fields)
		.filter(([, value]) => value.length > 0)
		.map(([key, value]) => `${key}=${encode(value)}`);

	if (passphrase) {
		pairs.push(`passphrase=${encode(passphrase)}`);
	}

	return createHash("md5").update(pairs.join("&")).digest("hex");
}

export function buildPayfastFormFields(order: Order) {
	const { merchantId, merchantKey, paymentUrl, siteUrl } = getPayfastConfig();

	const fields: PayfastFields = {
		merchant_id: merchantId,
		merchant_key: merchantKey,
		return_url: `${siteUrl}/orders/${order.id}/success`,
		cancel_url: `${siteUrl}/orders/${order.id}/cancel`,
		notify_url: `${siteUrl}/api/payfast/notify`,
		name_first: order.firstName,
		name_last: order.lastName,
		email_address: order.email,
		cell_number: order.phone,
		amount: order.total.toFixed(2),
		item_name: order.id,
		custom_str1: order.addressLine1,
		custom_str2: order.city,
	};

	return {
		paymentUrl,
		fields: {
			...fields,
			signature: signPayfastFields(fields),
		},
	};
}