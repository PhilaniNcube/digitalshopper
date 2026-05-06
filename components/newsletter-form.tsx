"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeAction, type NewsletterState } from "@/dal/actions/newsletter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const initialState: NewsletterState = {
	success: false,
	message: "",
};

export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeAction, initialState);

	useEffect(() => {
		if (state.message) {
			if (state.success) {
				toast.success(state.message);
			} else {
				toast.error(state.message);
			}
		}
	}, [state]);

	return (
		<form action={action} className="flex flex-col gap-2">
			<div className="space-y-1">
				<Input
					name="email"
					type="email"
					placeholder="YOUR_EMAIL"
					required
					disabled={isPending}
					className="bg-background/50 border-border/50 text-xs placeholder:text-muted-foreground/50 rounded-none h-9"
				/>
				{state.errors?.email && (
					<p className="text-[10px] text-destructive uppercase tracking-tight">
						{state.errors.email[0]}
					</p>
				)}
			</div>
			<Button
				type="submit"
				size="sm"
				disabled={isPending}
				className="w-full h-9 px-4 text-xs font-bold tracking-wider bg-primary-strong rounded-none text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-3 w-3 animate-spin" />
						PROCESSING
					</>
				) : (
					"SUBMIT"
				)}
			</Button>
			{state.success && (
				<p className="text-[10px] text-primary uppercase tracking-wider text-center mt-2 animate-in fade-in slide-in-from-bottom-1">
					Welcome to the inner circle.
				</p>
			)}
		</form>
	);
}
