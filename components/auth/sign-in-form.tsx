"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = handleSubmit(async (values) => {
		const result = await authClient.signIn.email({
			email: values.email,
			password: values.password,
			callbackURL: "/dashboard",
		});

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		toast.success("Signed in successfully.");
		router.push("/dashboard");
		router.refresh();
	});

	return (
		<form className="grid gap-5" onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
				{errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" placeholder="••••••••" {...register("password")} />
				{errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
			</div>
			<Button type="submit" className="bg-primary-strong text-white rounded-none h-12" disabled={isSubmitting}>
				{isSubmitting ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}