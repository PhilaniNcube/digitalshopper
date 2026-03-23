"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters."),
		confirmPassword: z.string().min(8, "Confirm your new password."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
	const router = useRouter();
	const [token] = useQueryState("token");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = handleSubmit(async ({ password }) => {
		if (!token) {
			toast.error("This reset link is missing its token.");
			return;
		}

		const result = await authClient.resetPassword({
			newPassword: password,
			token,
		});

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		toast.success("Your password has been updated.");
		router.push("/sign-in");
		router.refresh();
	});

	return (
		<form className="grid gap-5" onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="password">New password</Label>
				<Input id="password" type="password" placeholder="••••••••" {...register("password")} />
				{errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
			</div>
			<div className="grid gap-2">
				<Label htmlFor="confirmPassword">Confirm password</Label>
				<Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
				{errors.confirmPassword ? (
					<p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
				) : null}
			</div>
			<Button type="submit" className="bg-primary-strong text-white rounded-none h-12" disabled={isSubmitting}>
				{isSubmitting ? "Updating password..." : "Update password"}
			</Button>
		</form>
	);
}