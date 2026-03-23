import { OrderConfirmationEmail } from "@/emails/order-confirmation-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";
import type { StoredOrderItem } from "@/db/schema";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY ?? process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resendFrom =
	process.env.RESEND_FROM_EMAIL ?? "Digital Shopper <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendResetPasswordEmail({
	to,
	resetUrl,
	userName,
}: {
	to: string;
	resetUrl: string;
	userName?: string;
}) {
	if (!resend) {
		return;
	}

	await resend.emails.send({
		from: resendFrom,
		to,
		subject: "Reset your Digital Shopper password",
		react: <ResetPasswordEmail resetUrl={resetUrl} userName={userName} />,
	});
}

export async function sendOrderConfirmationEmail({
	to,
	orderNumber,
	customerName,
	total,
	items,
}: {
	to: string;
	orderNumber: string;
	customerName: string;
	total: number;
	items: StoredOrderItem[];
}) {
	if (!resend) {
		return;
	}

	await resend.emails.send({
		from: resendFrom,
		to,
		subject: `Order confirmation ${orderNumber}`,
		react: (
			<OrderConfirmationEmail
				orderNumber={orderNumber}
				customerName={customerName}
				total={total}
				items={items}
			/>
		),
	});
}