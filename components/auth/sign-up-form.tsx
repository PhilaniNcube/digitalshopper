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

const signUpSchema = z.object({
	name: z.string().min(2, "Your name must be at least 2 characters."),
	email: z.string().email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = handleSubmit(async (values) => {
		const result = await authClient.signUp.email({
			name: values.name,
			email: values.email,
			password: values.password,
			callbackURL: "/sign-in?verification=verified",
		});

		if (result.error) {
			toast.error(result.error.message);
			return;
		}

		toast.success("Account created. Check your inbox to verify your email.");
		router.push(`/sign-in?verification=sent&email=${encodeURIComponent(values.email)}`);
		router.refresh();
	});

	return (
		<form className="grid gap-5 " onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="name" className="text-slate-100">Full name</Label>
				<Input id="name" placeholder="Digital Shopper" {...register("name")} />
				{errors.name ? <p className="text-sm text-red-300">{errors.name.message}</p> : null}
			</div>
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
				{isSubmitting ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}