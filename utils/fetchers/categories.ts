"server only";

import { createClient } from "@/utils/supabase/server";

export const fetchCategoriesFromDatabase = async () => {
	const supabase = createClient();

	const { data: categories, error } = await supabase
		.from("categories")
		.select("*")
		.order("title", { ascending: false });

	if (error || !categories) {
		return [];
	}

	return categories;
};

export const fetchCategoryBySlug = async (slug: string) => {
	const supabase = createClient();

	const { data: category, error } = await supabase
		.from("categories")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error || !category) {
		return null;
	}

	return category;
};

export const fetchSubCategoriesByCategorySlug = async (slug: string) => {
	const supabase = createClient();

	const { data: sub_categories, error: sub_categoriesError } = await supabase
		.from("sub_categories")
		.select("*, category!inner(id, slug, title, image_url)")
		.eq("category.slug", slug);

	if (sub_categoriesError || !sub_categories) {
		return [];
	}

	return sub_categories;
};

export const fetchFrameStyles = async () => {
	const supabase = createClient();

	const { data: frame_styles, error: frame_styles_error } = await supabase
		.from("frame_styles")
		.select("*")
		.order("title", { ascending: true });

	if (frame_styles_error || !frame_styles) {
		return [];
	}

	return frame_styles;
};


export async function fetchSubCategories () {
  const supabase = createClient();

  const {data, error} = await supabase
     .from("sub_categories")
     .select("*, categories(id,slug, title, image_url)");

   if(error) {
    throw new Error(error.message)
   }

   return data
}
