"use client";

import { trackPurchase } from "@/lib/gtm";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export function ClearCartOnSuccess() {
	const items = useCartStore((state) => state.items);
	const clear = useCartStore((state) => state.clear);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (items.length > 0) {
			const subtotal = getCartSubtotal(items);
			const shipping = subtotal >= 2500 ? 0 : 150;
			trackPurchase(id, items, subtotal + shipping, shipping);
		}
		clear();
	}, [clear, id, items]);

	return null;
}