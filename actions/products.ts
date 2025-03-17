"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export async function fetchProducts(
  page = 1,
  search = "",

	) {
		const supabase = await createClient();

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


	export async function toggleInStockAction(id: string, instock: boolean) {
		const supabase = await createClient();

		const { data: product, error } = await supabase
			.from("products")
			.update({ instock: !instock })
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		revalidatePath("/dashboard/products");

		return product;
	}

	export async function toggleFeaturedAction(id: string, featured: boolean) {
		const supabase = await createClient();

		const { data: product, error } = await supabase
			.from("products")
			.update({ featured: !featured })
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		revalidatePath("/dashboard/products");

		return product;
	}