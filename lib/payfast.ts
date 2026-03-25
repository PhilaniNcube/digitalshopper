import type { Order } from "@/db/schema";
import { createHash } from "crypto";

export type PayfastFields = Record<string, string>;

const payfastDebugEnabled =
	process.env.PAYFAST_DEBUG === "true" || process.env.NODE_ENV !== "production";

function getRequiredValue(...values: Array<string | undefined>) {
	const value = values.find(Boolean);

	if (!value) {
		throw new Error("Missing Payfast configuration.");
	}

	return value;
}

/**
 * Replicate PHP's urlencode() behaviour so our signature matches
 * the one PayFast computes server-side.
 *
 * PHP urlencode keeps only A-Z a-z 0-9 - _ . unchanged and encodes
 * everything else (spaces become +). JS encodeURIComponent additionally
 * leaves ! ~ * ' ( ) untouched, so we encode those manually.
 */
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

export function getPayfastConfig() {
	return {
		merchantId: getRequiredValue(
			process.env.PAYFAST_MERCHANT_ID,
			process.env.NEXT_PUBLIC_MERCHANT_ID,
		).trim(),
		merchantKey: getRequiredValue(
			process.env.PAYFAST_MERCHANT_KEY,
			process.env.NEXT_PUBLIC_MERCHANT_KEY,
		).trim(),
		passphrase: (
			process.env.PAYFAST_PASSPHRASE ?? process.env.NEXT_PUBLIC_PASSPHRASE ?? ""
		).trim(),
		paymentUrl: (
			process.env.PAYFAST_URL ??
			process.env.NEXT_PUBLIC_PAYFAST_URL ??
			"https://sandbox.payfast.co.za/eng/process"
		).trim(),
		siteUrl: (
			process.env.BETTER_AUTH_URL ??
			process.env.NEXT_PUBLIC_SITE_URL ??
			"http://localhost:3000"
		).trim(),
	};
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

function debugPayfast(event: string, details: Record<string, unknown>) {
	if (!payfastDebugEnabled) {
		return;
	}

	console.info(`[payfast] ${event}`, details);
}

export function signPayfastFields(fields: PayfastFields) {
	const { passphrase } = getPayfastConfig();
	const signatureSource = buildSignatureSource(fields, passphrase);
	const signature = createHash("md5").update(signatureSource).digest("hex");

	debugPayfast("sign", {
		fields,
		signatureSource,
		signature,
		hasPassphrase: Boolean(passphrase),
	});

	return signature;
}

/**
 * Validate the signature on an incoming PayFast ITN payload.
 * Reconstructs the expected signature from the posted fields and compares it
 * against the `signature` field included in the payload.
 */
export function validatePayfastSignature(postedFields: PayfastFields): boolean {
	const { passphrase } = getPayfastConfig();
	const receivedSignature = postedFields.signature;
	if (!receivedSignature) {
		debugPayfast("validate:missing-signature", {
			postedFields,
			hasPassphrase: Boolean(passphrase),
		});
		return false;
	}

	const fieldsWithoutSignature = Object.entries(postedFields)
		.filter(([key]) => key !== "signature")
		.filter(([, value]) => value.length > 0)
		.reduce<PayfastFields>((accumulator, [key, value]) => {
			accumulator[key] = value;
			return accumulator;
		}, {});

	const signatureSource = buildSignatureSource(fieldsWithoutSignature, passphrase);
	const expectedSignature = createHash("md5").update(signatureSource).digest("hex");

	debugPayfast("validate", {
		postedFields,
		signatureSource,
		receivedSignature,
		expectedSignature,
		matches: expectedSignature === receivedSignature,
		hasPassphrase: Boolean(passphrase),
	});

	return expectedSignature === receivedSignature;
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
		amount: Number(order.total).toFixed(2),
		item_name: order.id,
		custom_str1: order.addressLine1,
		custom_str2: order.city,
	};

	debugPayfast("build-form-fields", {
		orderId: order.id,
		fields,
	});

	return {
		paymentUrl,
		fields: {
			...fields,
			signature: signPayfastFields(fields),
		},
	};
}