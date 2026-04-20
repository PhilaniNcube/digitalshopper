"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendAbandonedCartAction } from "@/dal/actions/orders";
import { toast } from "sonner";

type SendAbandonedCartButtonProps = {
	orderId: string;
};

export function SendAbandonedCartButton({ orderId }: SendAbandonedCartButtonProps) {
	const [loading, setLoading] = useState(false);

	async function handleClick() {
		setLoading(true);
		try {
			const result = await sendAbandonedCartAction(orderId);
			if (result.success) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleClick}
			disabled={loading}
			className="gap-2"
		>
			<Mail className="size-4" />
			{loading ? "Sending…" : "Send recovery email"}
		</Button>
	);
}
