import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OrderSummary from "./_components/order-summary";
import type { Database } from "@/schema";

const OrderPage = async (props:{params: Promise<{id:string}>}) => {
    const params = await props.params;

    const {
        id
    } = params;

    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        },
    );

    const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("id", id).single();

    return <div>{order && <OrderSummary order={order} />}</div>;
};
export default OrderPage;
