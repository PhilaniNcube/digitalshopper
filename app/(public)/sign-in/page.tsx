import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Sign In | Digital Shopper",
	description: "Sign in to your Digital Shopper account to manage orders and checkout faster.",
};

export default function SignInPage() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-6 py-12 lg:px-10">
			<Card className="mx-auto w-full max-w-xl bg-surface-low">
				<CardHeader>
				
					<CardTitle>Sign in</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<SignInForm />
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<Link href="/forgot-password" className="hover:text-foreground">
							Forgot password?
						</Link>
						<Link href="/sign-up" className="hover:text-foreground">
							Create account
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}