import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Create Account | Digital Shopper",
	description: "Create a Digital Shopper account to start shopping for tech and electronics online.",
};

export default function SignUpPage() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-7xl items-center px-6 py-12 lg:px-10">
			<Card className="mx-auto w-full max-w-xl bg-surface-low">
				<CardHeader>
				
					<CardTitle>Create account</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<SignUpForm />
					<p className="text-sm text-muted-foreground">
						Already have an account? <Link href="/sign-in" className="text-foreground">Sign in</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}