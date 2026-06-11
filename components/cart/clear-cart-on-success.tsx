"use client";

import { trackPurchase } from "@/lib/gtm";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export function ClearCartOnSuccess() {
	const items = useCartStore((state) => state.items);
	const clear = useCartStore((state) => state.clear);
	const { id } = useParams<{ id: string }>();
	const processedOrderIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (!id || processedOrderIdRef.current === id) {
			return;
		}

		if (items.length > 0) {
			const subtotal = getCartSubtotal(items);
			const shipping = subtotal >= 5000 ? 0 : 220;
			trackPurchase(id, items, subtotal + shipping, shipping);
			clear();
		}

		processedOrderIdRef.current = id;
	}, [clear, id, items]);

	return null;
}