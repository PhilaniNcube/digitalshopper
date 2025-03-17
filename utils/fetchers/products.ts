import { createClient } from "@/utils/supabase/server";

export async function fetchProductBySlug(slug: string) {
	const supabase = await createClient();

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


export async function fetchInStockProducts(	page = 1,
	search = "",) {
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
			).eq("instock", true)
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


	export async function getProductsCount() {
		const supabase = await createClient();
	
		const { data, error , count} = await supabase
			.from("products")
			.select("id", {
				count: "exact",
			});
	
		if (error) {
			console.error("Error fetching products count", error);
			return 0;
		}
	
		return count
	}