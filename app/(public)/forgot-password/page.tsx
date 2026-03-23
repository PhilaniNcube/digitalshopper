import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Forgot Password | Digital Shopper",
	description: "Request a password reset link for your Digital Shopper account.",
};

export default function ForgotPasswordPage() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-6 py-12 lg:px-10">
			<Card className="mx-auto w-full max-w-xl bg-surface-low">
				<CardHeader>
					<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Password recovery</p>
					<CardTitle>Request a reset link</CardTitle>
				</CardHeader>
				<CardContent>
					<ForgotPasswordForm />
				</CardContent>
			</Card>
		</div>
	);
}