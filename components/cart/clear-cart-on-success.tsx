"use client";

import { useCartStore } from "@/stores/cart-store";
import { useEffect } from "react";

export function ClearCartOnSuccess() {
	const clear = useCartStore((state) => state.clear);

	useEffect(() => {
		clear();
	}, [clear]);

	return null;
}