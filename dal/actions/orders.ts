"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

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