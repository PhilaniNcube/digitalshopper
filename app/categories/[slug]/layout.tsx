import CategoryHeader from "@/components/CategoriesPage/CategoryHeader";
import { Database } from "@/schema";
import { cookies } from "next/headers";
import { ReactNode, Suspense } from "react";
import Filter from "./Filter";
import ProductsSkeleton from "./loading";
import { createServerClient } from "@supabase/ssr";

const layout = async ({
  children,
  params: { slug },

}: {
  children: ReactNode,
  params: { slug: string },

}) => {
   const cookieStore = cookies();

   const supabase = createServerClient<Database>(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         get(name: string) {
           return cookieStore.get(name)?.value;
         },
       },
     }
   );

  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: sub_categories, error: sub_categoriesError } = await supabase
    .from("sub_categories")
    .select("*, category!inner(id, slug, title, image_url)")
    .eq(`category.slug`, slug);

    const { data: frame_styles, error: frame_styles_error } = await supabase
      .from("frame_styles")
      .select("*")
      .order("title", { ascending: true });

  return (
    <main>
      <CategoryHeader title={category?.title!} />
      <div className="container flex py-10">
        <Filter
          filter_title={category?.title!}
          sub_categories={sub_categories!}
          slug={slug}
          frame_styles={frame_styles!}
        />

        {children}
      </div>
    </main>
  );
};
export default layout;
