"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sql } from "@/lib/db";
import { db } from "@/lib/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { sendAbandonedCartEmail } from "@/lib/email";

const deleteOrderSchema = z.object({
	orderId: z.string().uuid("Invalid order id."),
});

export type DeleteOrderActionResult = {
	success: boolean;
	message: string;
}

export async function deleteOrderAction(orderId: string): Promise<DeleteOrderActionResult> {
	await requireAdmin();

	const parsedInput = deleteOrderSchema.safeParse({ orderId });

	if (!parsedInput.success) {
		return {
			success: false,
			message: parsedInput.error.issues[0]?.message ?? "Invalid order id.",
		};
	}

	try {
		const [deletedOrder] = await sql<{ id: string }[]>`
			delete from "orders"
			where "id" = ${parsedInput.data.orderId}
			returning "id"
		`;

		if (!deletedOrder) {
			throw new Error("ORDER_NOT_FOUND");
		}

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/orders");
		revalidatePath("/dashboard/payments");
		revalidatePath("/dashboard/shipping");

		return {
			success: true,
			message: "Order deleted successfully.",
		};
	} catch (error) {
		if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
			return {
				success: false,
				message: "Order not found.",
			};
		}

		console.error("Failed to delete order", error);

		return {
			success: false,
			message: "Unable to delete the order right now.",
		};
	}
}

const sendAbandonedCartSchema = z.object({
	orderId: z.string().uuid("Invalid order id."),
});

export type SendAbandonedCartActionResult = {
	success: boolean;
	message: string;
};

export async function sendAbandonedCartAction(
	orderId: string,
): Promise<SendAbandonedCartActionResult> {
	await requireAdmin();

	const parsed = sendAbandonedCartSchema.safeParse({ orderId });
	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? "Invalid order id.",
		};
	}

	const [order] = await db
		.select()
		.from(orders)
		.where(eq(orders.id, parsed.data.orderId))
		.limit(1);

	if (!order) {
		return { success: false, message: "Order not found." };
	}

	if (order.status !== "pending") {
		return {
			success: false,
			message: "Abandoned cart emails can only be sent for pending orders.",
		};
	}

	const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://digitalshopper.co.za"}/checkout`;

	try {
		await sendAbandonedCartEmail({
			to: order.email,
			customerName: `${order.firstName} ${order.lastName}`,
			orderId: order.id,
			items: order.items,
			subtotal: order.subtotal,
			total: order.total,
			checkoutUrl,
		});

		return {
			success: true,
			message: `Recovery email sent to ${order.email}.`,
		};
	} catch (error) {
		console.error("Failed to send abandoned cart email", error);
		return {
			success: false,
			message: "Failed to send the recovery email. Please try again.",
		};
	}
}