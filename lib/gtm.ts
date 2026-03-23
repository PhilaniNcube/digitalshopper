import { sendGTMEvent } from "@next/third-parties/google";
import type { CartProduct } from "@/lib/demo-products";
import type { CartLine } from "@/stores/cart-store";

type GtmItem = {
	item_id: string;
	item_name: string;
	item_category?: string;
	price: number;
	quantity: number;
};

function toGtmItem(product: CartProduct, quantity = 1): GtmItem {
	return {
		item_id: product.id,
		item_name: product.title,
		item_category: product.category,
		price: product.price,
		quantity,
	};
}

export function trackViewItem(product: CartProduct) {
	sendGTMEvent({
		event: "view_item",
		ecommerce: {
			currency: "ZAR",
			value: product.price,
			items: [toGtmItem(product)],
		},
	});
}

export function trackViewItemList(
	products: CartProduct[],
	listName = "Product Grid",
) {
	sendGTMEvent({
		event: "view_item_list",
		ecommerce: {
			item_list_name: listName,
			items: products.map((p, index) => ({
				...toGtmItem(p),
				index,
			})),
		},
	});
}

export function trackAddToCart(product: CartProduct) {
	sendGTMEvent({
		event: "add_to_cart",
		ecommerce: {
			currency: "ZAR",
			value: product.price,
			items: [toGtmItem(product)],
		},
	});
}

export function trackBeginCheckout(items: CartLine[], value: number) {
	sendGTMEvent({
		event: "begin_checkout",
		ecommerce: {
			currency: "ZAR",
			value: value,
			items: items.map((line) =>
				toGtmItem(line.product, line.quantity),
			),
		},
	});
}

export function trackPurchase(
	transactionId: string,
	items: CartLine[],
	value: number,
	shipping = 0,
) {
	sendGTMEvent({
		event: "purchase",
		ecommerce: {
			transaction_id: transactionId,
			currency: "ZAR",
			value: value,
			shipping: shipping,
			items: items.map((line) =>
				toGtmItem(line.product, line.quantity),
			),
		},
	});
}
