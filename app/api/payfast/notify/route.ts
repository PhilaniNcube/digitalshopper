import { db } from "@/lib/db";
import { orders } from "@/db/schema";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/email";
import { validatePayfastSignature, type PayfastFields } from "@/lib/payfast";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const payfastDebugEnabled =
	process.env.PAYFAST_DEBUG === "true" || process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
	const payload = await request.text();
	const params = new URLSearchParams(payload);

	// Convert URLSearchParams to a plain object for signature validation
	const postedFields: PayfastFields = {};
	for (const [key, value] of params.entries()) {
		postedFields[key] = value;
	}

	if (payfastDebugEnabled) {
		console.info("[payfast] notify:received", {
			payload,
			postedFields,
		});
	}

	// Validate PayFast signature
	if (!validatePayfastSignature(postedFields)) {
		if (payfastDebugEnabled) {
			console.warn("[payfast] notify:invalid-signature", {
				payload,
				postedFields,
			});
		}

		return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
	}

	const paymentStatus = params.get("payment_status");
	// m_payment_id holds the full order UUID; item_name is only a human-readable label
	const orderId = params.get("m_payment_id") ?? params.get("item_name");
	const payfastPaymentId = params.get("pf_payment_id");

	if (!orderId) {
		console.warn("[payfast] notify:missing-order-id", { postedFields });
		return NextResponse.json({ received: true });
	}

	const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

	if (!order) {
		console.warn("[payfast] notify:order-not-found", { orderId, paymentStatus });
		return NextResponse.json({ received: true });
	}

	if (paymentStatus === "COMPLETE") {
		// Idempotency guard: skip if already marked paid
		if (order.status === "paid") {
			if (payfastDebugEnabled) {
				console.info("[payfast] notify:already-paid", { orderId });
			}
			return NextResponse.json({ received: true });
		}

		await db
			.update(orders)
			.set({
				status: "paid",
				payfastPaymentId: payfastPaymentId ?? undefined,
				paidAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(orders.id, orderId));

		// Send confirmation email to customer
		try {
			await sendOrderConfirmationEmail({
				to: order.email,
				orderNumber: order.id,
				customerName: `${order.firstName} ${order.lastName}`,
				total: order.total,
				items: order.items,
			});
		} catch (err) {
			console.error("[payfast] notify:customer-email-failed", { orderId, err });
		}

		// Send notification email to admins
		try {
			await sendAdminOrderNotificationEmail({
				orderNumber: order.id,
				customerName: `${order.firstName} ${order.lastName}`,
				customerEmail: order.email,
				total: order.total,
				items: order.items,
			});
		} catch (err) {
			console.error("[payfast] notify:admin-email-failed", { orderId, err });
		}
	}

	return NextResponse.json({ received: true });
}