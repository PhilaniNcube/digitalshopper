import { db } from "@/lib/db";
import { orders } from "@/db/schema";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const payload = await request.text();
	const params = new URLSearchParams(payload);
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

		await sendOrderConfirmationEmail({
			to: order.email,
			orderNumber: order.id,
			customerName: `${order.firstName} ${order.lastName}`,
			total: order.total,
			items: order.items,
		});
	}

	return NextResponse.json({ received: true });
}