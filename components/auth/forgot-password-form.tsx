"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
	email: z.string().email("Enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = handleSubmit(async ({ email }) => {
		const redirectTo = `${window.location.origin}/reset-password`;
		const result = await authClient.requestPasswordReset({
			email,
			redirectTo,
		});

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		toast.success("Password reset instructions sent.");
	});

	return (
		<form className="grid gap-5" onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="email" className="text-slate-100">Email</Label>
				<Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
				{errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
			</div>
			<Button type="submit" className="bg-primary-strong text-white rounded-none h-12" disabled={isSubmitting}>
				{isSubmitting ? "Sending link..." : "Send reset link"}
			</Button>
		</form>
	);
}