import { OrderConfirmationEmail } from "@/emails/order-confirmation-email";
import { AdminOrderNotificationEmail } from "@/emails/admin-order-notification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";
import { VerifyEmail } from "@/emails/verify-email";
import type { StoredOrderItem } from "@/db/schema";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY ?? process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resendFrom = "Digital Shopper <info@digitalshopper.co.za>";

const ADMIN_EMAILS = ["info@digitalshopper.co.za", "ncbphi001@gmail.com"];

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

export async function sendVerificationEmail({
	to,
	verificationUrl,
	userName,
}: {
	to: string;
	verificationUrl: string;
	userName?: string;
}) {
	if (!resend) {
		return;
	}

	await resend.emails.send({
		from: resendFrom,
		to,
		subject: "Verify your Digital Shopper account",
		react: <VerifyEmail verificationUrl={verificationUrl} userName={userName} />,
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

export async function sendAdminOrderNotificationEmail({
	orderNumber,
	customerName,
	customerEmail,
	total,
	items,
}: {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	total: number;
	items: StoredOrderItem[];
}) {
	if (!resend) {
		return;
	}

	await resend.emails.send({
		from: resendFrom,
		to: ADMIN_EMAILS,
		subject: `New order received: ${orderNumber}`,
		react: (
			<AdminOrderNotificationEmail
				orderNumber={orderNumber}
				customerName={customerName}
				customerEmail={customerEmail}
				total={total}
				items={items}
			/>
		),
	});
}