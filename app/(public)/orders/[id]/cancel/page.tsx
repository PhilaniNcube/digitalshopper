import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Payment Cancelled | Digital Shopper",
	description: "Your payment was not completed. Your cart is still available.",
};

export default function OrderCancelPage() {
	return (
		<div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl items-center justify-center px-6 py-12 lg:px-10">
			<div className="max-w-2xl rounded-[2rem] bg-surface-low p-10 text-center ring-1 ring-white/5">
				<p className="text-xs uppercase tracking-[0.22em] text-red-300">Checkout interrupted</p>
				<h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] text-white">
					Payment was not completed.
				</h1>
				<p className="mt-4 text-base leading-7 text-muted-foreground">
					Your cart remains available so you can review the order and try again.
				</p>
				<div className="mt-8 flex justify-center gap-4">
					<Button asChild>
						<Link href="/checkout">Back to checkout</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}