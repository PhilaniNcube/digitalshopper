"use server";

import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/email";

const newsletterSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
});

export type NewsletterState = {
	success: boolean;
	message: string;
	errors?: {
		email?: string[];
	};
};

export async function subscribeAction(
	_prevState: NewsletterState,
	formData: FormData,
): Promise<NewsletterState> {
	const email = formData.get("email") as string;

	const validatedFields = newsletterSchema.safeParse({
		email,
	});

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid email address.",
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	try {
		await subscribeToNewsletter(validatedFields.data.email);

		return {
			success: true,
			message: "Thanks for subscribing! Check your inbox soon.",
		};
	} catch (error) {
		console.error("Newsletter subscription error:", error);
		return {
			success: false,
			message: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
		};
	}
}
