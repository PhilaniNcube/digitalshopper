"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/lib/demo-products";
import { trackAddToCart } from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function AddToCartButton({
	product,
	className,
	children,
	...props
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & {
	product: CartProduct;
	className?: string;
	children?: React.ReactNode;
}) {
	const addItem = useCartStore((state) => state.addItem);

	return (
		<Button className={cn(className)} onClick={() => { addItem(product); trackAddToCart(product); }} {...props}>
			{children ?? "Add to cart"}
		</Button>
	);
}