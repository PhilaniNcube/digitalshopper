"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
	email: z.string().email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
	const [isResendingVerification, setIsResendingVerification] = useState(false);
	const initialEmail = searchParams.get("email")?.trim() ?? "";
	const verificationStatus = searchParams.get("verification");
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: initialEmail,
			password: "",
		},
	});

	const verificationNotice =
		verificationStatus === "sent"
			? "We sent a verification link to your inbox. Open it before signing in."
			: verificationStatus === "verified"
				? "Your email has been verified. You can sign in now."
				: verificationStatus === "resent"
					? "A fresh verification link has been sent to your inbox."
					: null;

	const onSubmit = handleSubmit(async (values) => {
		setUnverifiedEmail(null);

		const result = await authClient.signIn.email({
			email: values.email,
			password: values.password,
			callbackURL: "/dashboard",
		});

		if (result.error) {
			const errorCode =
				typeof result.error === "object" &&
				result.error !== null &&
				"code" in result.error &&
				typeof result.error.code === "string"
					? result.error.code
					: undefined;

			if (errorCode === "EMAIL_NOT_VERIFIED" || /not verified/i.test(result.error.message)) {
				setUnverifiedEmail(values.email);
				toast.error("Verify your email before signing in. A verification link has been sent.");
				return;
			}

			toast.error(result.error.message);
			return;
		}

		toast.success("Signed in successfully.");
		router.push("/dashboard");
		router.refresh();
	});

	async function handleResendVerification() {
		const email = unverifiedEmail ?? getValues("email").trim();

		if (!email) {
			toast.error("Enter your email address to resend the verification link.");
			return;
		}

		setIsResendingVerification(true);

		const result = await authClient.sendVerificationEmail({
			email,
			callbackURL: "/sign-in?verification=verified",
		});

		setIsResendingVerification(false);

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		setUnverifiedEmail(email);
		router.replace(`/sign-in?verification=resent&email=${encodeURIComponent(email)}`);
		toast.success("Verification email sent.");
	}

	return (
		<form className="grid gap-5" onSubmit={onSubmit}>
			{verificationNotice || unverifiedEmail ? (
				<Alert className="border-cyan-500/30 bg-cyan-500/10 text-cyan-50">
					<MailCheck className="size-4" />
					<AlertTitle>
						{unverifiedEmail ? "Email verification required" : "Check your inbox"}
					</AlertTitle>
					<AlertDescription className="text-cyan-100/80">
						{unverifiedEmail
							? "Your account exists, but the email address still needs verification before password sign-in is allowed."
							: verificationNotice}
					</AlertDescription>
					{(unverifiedEmail || initialEmail) && verificationStatus !== "verified" ? (
						<AlertAction>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="border-cyan-300/30 bg-transparent text-cyan-50 hover:bg-cyan-400/10 hover:text-cyan-50"
								disabled={isResendingVerification}
								onClick={handleResendVerification}
							>
								{isResendingVerification ? "Sending..." : "Resend link"}
							</Button>
						</AlertAction>
					) : null}
				</Alert>
			) : null}
			<div className="grid gap-2">
				<Label htmlFor="email" className="text-slate-100">Email</Label>
				<Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
				{errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password" className="text-slate-100">Password</Label>
				<Input id="password" type="password" placeholder="••••••••" {...register("password")} />
				{errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
			</div>
			<Button type="submit" className="bg-primary-strong text-white rounded-none h-12" disabled={isSubmitting}>
				{isSubmitting ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}