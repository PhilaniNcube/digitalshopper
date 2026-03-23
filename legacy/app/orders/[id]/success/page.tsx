import type { Database } from "@/schema";
import Hero from "./Hero";
import OrderDetails from "./OrderDetails";
import { createClient } from "@/utils/supabase/server";


const page = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;

    const {
        id
    } = params;


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



    const data: {
		message: string;
		status: number;
		data: Database["public"]["Tables"]["orders"]["Row"] | null;
	} = await orderResponse;

    const order = data.data;



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
