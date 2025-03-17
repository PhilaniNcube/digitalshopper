"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";




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