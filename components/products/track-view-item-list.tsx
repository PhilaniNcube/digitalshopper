"use client";

import { useEffect } from "react";
import type { CartProduct } from "@/lib/demo-products";
import { trackViewItemList } from "@/lib/gtm";

export function TrackViewItemList({
	products,
	listName,
}: {
	products: CartProduct[];
	listName?: string;
}) {
	useEffect(() => {
		if (products.length > 0) {
			trackViewItemList(products, listName);
		}
	}, [products, listName]);

	return null;
}
