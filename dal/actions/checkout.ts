"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { buildPayfastFormFields } from "@/lib/payfast";
import { orders, type StoredOrderItem } from "@/db/schema";
import { headers } from "next/headers";
import { z } from "zod";

const checkoutSchema = z.object({
	firstName: z.string().min(2, "At least 2 characters"),
	lastName: z.string().min(2, "At least 2 characters"),
	email: z.string().email("Enter a valid email"),
	phone: z.string().min(10, "At least 10 digits"),
	addressLine1: z.string().min(5, "At least 5 characters"),
	addressLine2: z.string().optional(),
	city: z.string().min(2, "At least 2 characters"),
	province: z.string().min(2, "At least 2 characters"),
	postalCode: z.string().min(4, "At least 4 characters"),
});

const itemSchema = z.array(
	z.object({
		id: z.string(),
		title: z.string(),
		price: z.number().nonnegative(),
		quantity: z.number().int().positive(),
		image: z.string().url(),
	}),
).min(1, "Add at least one product to continue.");

export type CheckoutState = {
	success: boolean;
	message?: string;
	paymentUrl?: string;
	fields?: Record<string, string>;
	fieldErrors?: Partial<Record<keyof z.infer<typeof checkoutSchema>, string[]>>;
};

export async function checkoutAction(
	_prevState: CheckoutState,
	formData: FormData,
): Promise<CheckoutState> {
	const raw = Object.fromEntries(formData);

	const result = checkoutSchema.safeParse(raw);
	if (!result.success) {
		return {
			success: false,
			message: "Please fix the errors below.",
			fieldErrors: result.error.flatten().fieldErrors,
		};
	}

	const itemsRaw = formData.get("items");
	const itemsParsed = itemSchema.safeParse(
		typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : [],
	);

	if (!itemsParsed.success) {
		return {
			success: false,
			message: itemsParsed.error.flatten().formErrors.join(", ") || "Invalid cart items.",
		};
	}

	const items: StoredOrderItem[] = itemsParsed.data;
	const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	const shipping = subtotal >= 5000 ? 0 : 220;
	const total = subtotal + shipping;

	const reqHeaders = await headers();
	const session = await auth.api.getSession({ headers: reqHeaders });

	const [order] = await db
		.insert(orders)
		.values({
			userId: session?.user.id,
			firstName: result.data.firstName,
			lastName: result.data.lastName,
			email: result.data.email,
			phone: result.data.phone,
			addressLine1: result.data.addressLine1,
			addressLine2: result.data.addressLine2,
			city: result.data.city,
			province: result.data.province,
			postalCode: result.data.postalCode,
			items,
			subtotal,
			shipping,
			total,
		})
		.returning();

	const payment = buildPayfastFormFields(order);

	return {
		success: true,
		paymentUrl: payment.paymentUrl,
		fields: payment.fields,
	};
}
