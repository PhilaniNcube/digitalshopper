import type { Metadata } from "next";
import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/cart/clear-cart-on-success";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order Confirmed | Digital Shopper",
  description: "Your payment was received and your order is confirmed.",
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl items-center justify-center px-6 py-12 lg:px-10">
      <Suspense>
        <ClearCartOnSuccess />
      </Suspense>
      <div className="max-w-2xl rounded-[2rem] bg-surface-low p-10 text-center ring-1 ring-white/5">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">
          Payment received
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.04em] text-white">
          Your order is confirmed.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          We will email the order confirmation as soon as the Payfast
          notification is processed.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
