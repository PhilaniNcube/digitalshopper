// write a supabase function to calculate the revenue received from the sales of products

import { createClient } from "../supabase/server";

export async function fetchRevenue() {
  const supabase = await createClient();

  try {
    // Only include orders that have been paid
    const { data: revenue, error } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("paid", true)

    //   calculate the total revenue from the orders
    const total_revenue = revenue?.reduce((acc, order) => acc + order.total_amount, 0);

    if (error || !revenue) {
      console.error("Error fetching revenue", error);
      return 0;
    }

    return total_revenue;
  } catch (error) {
    console.error("Error fetching revenue", error);
    return 0;
  }
}