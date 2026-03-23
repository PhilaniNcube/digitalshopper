import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Reset Password | Digital Shopper",
	description: "Choose a new password for your Digital Shopper account.",
};

export default function ResetPasswordPage() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-6 py-12 lg:px-10">
			<Card className="mx-auto w-full max-w-xl bg-surface-low">
				<CardHeader>
					<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Password recovery</p>
					<CardTitle>Choose a new password</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset token...</p>}>
						<ResetPasswordForm />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}