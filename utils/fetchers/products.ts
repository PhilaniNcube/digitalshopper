import { createClient } from "@/utils/supabase/server";

export async function fetchProductBySlug(slug: string) {
	const supabase = createClient();

	const { data: product, error } = await supabase
		.from("products")
		.select("*, brand(*), category(*), sub_category(*)")
		.eq("slug", slug)
		.single();

    if (error) {
        throw new Error("Product not found");
    }

   return product;
}
