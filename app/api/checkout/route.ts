import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { buildPayfastFormFields } from "@/lib/payfast";
import { orders } from "@/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

const checkoutPayloadSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(10),
	addressLine1: z.string().min(5),
	addressLine2: z.string().optional(),
	city: z.string().min(2),
	province: z.string().min(2),
	postalCode: z.string().min(4),
	items: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				price: z.number().nonnegative(),
				quantity: z.number().int().positive(),
				image: z.string().url(),
			}),
		)
		.min(1),
	subtotal: z.number().nonnegative(),
	shipping: z.number().nonnegative(),
	total: z.number().nonnegative(),
});

export async function POST(request: Request) {
	try {
		const payload = checkoutPayloadSchema.parse(await request.json());
		const session = await auth.api.getSession({ headers: request.headers });

		const [order] = await db
			.insert(orders)
			.values({
				userId: session?.user.id,
				firstName: payload.firstName,
				lastName: payload.lastName,
				email: payload.email,
				phone: payload.phone,
				addressLine1: payload.addressLine1,
				addressLine2: payload.addressLine2,
				city: payload.city,
				province: payload.province,
				postalCode: payload.postalCode,
				items: payload.items,
				subtotal: payload.subtotal,
				shipping: payload.shipping,
				total: payload.total,
			})
			.returning();

		const payment = buildPayfastFormFields(order);

		return NextResponse.json(payment);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: "Invalid checkout payload.", issues: error.issues },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: error instanceof Error ? error.message : "Unable to create order." },
			{ status: 500 },
		);
	}
}