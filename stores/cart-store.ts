"use client";

import type { CartProduct } from "@/lib/demo-products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
	product: CartProduct;
	quantity: number;
};

type CartState = {
	items: CartLine[];
	open: boolean;
	addItem: (product: CartProduct) => void;
	increment: (productId: string) => void;
	decrement: (productId: string) => void;
	removeItem: (productId: string) => void;
	clear: () => void;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
};

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],
			open: false,
			addItem: (product) =>
				set((state) => {
					const existing = state.items.find((item) => item.product.id === product.id);

					if (existing) {
						return {
							items: state.items.map((item) =>
								item.product.id === product.id
									? { ...item, quantity: item.quantity + 1 }
									: item,
							),
							open: true,
						};
					}

					return {
						items: [...state.items, { product, quantity: 1 }],
						open: true,
					};
				}),
			increment: (productId) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.product.id === productId
							? { ...item, quantity: item.quantity + 1 }
							: item,
					),
				})),
			decrement: (productId) =>
				set((state) => ({
					items: state.items
						.map((item) =>
							item.product.id === productId
								? { ...item, quantity: item.quantity - 1 }
								: item,
						)
						.filter((item) => item.quantity > 0),
				})),
			removeItem: (productId) =>
				set((state) => ({
					items: state.items.filter((item) => item.product.id !== productId),
				})),
			clear: () => set({ items: [], open: false }),
			openCart: () => set({ open: true }),
			closeCart: () => set({ open: false }),
			toggleCart: () => set((state) => ({ open: !state.open })),
		}),
		{
			name: "digitalshopper-cart",
			storage: createJSONStorage(() => localStorage),
		}
	),
);

export function getCartCount(items: CartLine[]) {
	return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartLine[]) {
	return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}