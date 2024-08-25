"use server"

import { createClient } from "@/utils/supabase/server";


export async function fetchProducts(
		search: string | string[],
		category: string | string[],
		page = 1,
	) {
		const supabase = createClient();

		const per_page = 20;

		const start = (Number(page) - 1) * Number(per_page);
		const end = start + Number(per_page) - 1;

		try {
			const {
				data: products,
				error,
				count,
			} = await supabase
				.from("products")
				.select(
					"*, category!inner(id, slug, title), sub_category(*), brand(*), frame_style, gender",
					{
						count: "exact",
					},
				)
				.limit(Number(per_page))
				.range(Number(start), Number(end))
				.ilike("title", `%${search}%`)
				.ilike("sub_category.title", `%${search}%`)
				.ilike("description", `%${search}%`)
				.order("title", { ascending: true });

			if (error) {
				return [];
			}

			return products;
		} catch (error) {
			console.error("Error fetching products", error);
			return null;
		}
	}
