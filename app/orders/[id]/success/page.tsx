import type { Database } from "@/schema";
import Hero from "./Hero";
import OrderDetails from "./OrderDetails";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@/utils/supabase/server";
import { sendGTMEvent } from "@next/third-parties/google";

const page = async ({ params: { id } }: { params: { id: string } }) => {
	const supabase = createClient();

	const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${id}`;

	const orderResponse = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-cache",
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Network response was not ok (${res.status})`);
			}
			return res.json();
		})
		.then((data) => {
			console.log(data);
			return data;
		})
		.catch((error) => console.log(error));

	//  console.log({orderResponse});

	const data: {
		message: string;
		status: number;
		data: Database["public"]["Tables"]["orders"]["Row"] | null;
	} = await orderResponse;

	const order = data.data;

	if (order?.paid) {
		sendGTMEvent({
			event: "purchase",
			value: order?.total_amount,
			transaction_id: order?.id,
			affiliation: "Digital Shopper",
			currency: "ZAR",
			shipping: order?.shipping,
			items: order?.order_items.map((item) => ({
				item_id: item.product.id,
				item_name: item.product.title,
				item_category: item.product.category.title,
				item_brand: item.product.brand.name,
				price: item.product.price,
				quantity: item.quantity,
			})),
		});
	}

	return (
		<main className="container py-10">
			<Hero />
			{order ? (
				<OrderDetails order={order} />
			) : (
				<div className="flex items-center justify-center w-full py-5">
					<p className="text-lg font-medium">
						There was an error fetching the details for order {id.split("-")[0]}{" "}
						please try again later.
					</p>
				</div>
			)}
		</main>
	);
};
export default page;
