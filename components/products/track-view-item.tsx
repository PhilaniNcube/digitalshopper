"use client";

import { useEffect } from "react";
import type { CartProduct } from "@/lib/demo-products";
import { trackViewItem } from "@/lib/gtm";

export function TrackViewItem({ product }: { product: CartProduct }) {
	useEffect(() => {
		trackViewItem(product);
	}, [product]);

	return null;
}
