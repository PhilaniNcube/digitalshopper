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
	const orderId = params.get("item_name");
	const payfastPaymentId = params.get("pf_payment_id");

	if (!orderId) {
		return NextResponse.json({ received: true });
	}

	const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

	if (!order) {
		return NextResponse.json({ received: true });
	}

	if (paymentStatus === "COMPLETE") {
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
		await sendOrderConfirmationEmail({
			to: order.email,
			orderNumber: order.id,
			customerName: `${order.firstName} ${order.lastName}`,
			total: order.total,
			items: order.items,
		});

		// Send notification email to admins
		await sendAdminOrderNotificationEmail({
			orderNumber: order.id,
			customerName: `${order.firstName} ${order.lastName}`,
			customerEmail: order.email,
			total: order.total,
			items: order.items,
		});
	}

	return NextResponse.json({ received: true });
}