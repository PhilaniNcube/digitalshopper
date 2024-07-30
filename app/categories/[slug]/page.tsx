// import CategoryHeader from "@/components/CategoriesPage/CategoryHeader";
import { Database } from "@/schema";
import { cookies } from "next/headers";
// import Filter from "./Filter";
import ProductsGrid from "@/components/Products/ProductsGrid";
import { Suspense } from "react";
import ProductsSkeleton from "@/components/Products/ProductsSkeleton";
import { createServerClient } from "@supabase/ssr";
import NoProducts from "@/components/Products/NoProducts";

export const dynamic = "force-dynamic";

type Products = Database['public']['Tables']['products']['Row'][];

const page = async ({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
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

  const sub_category = searchParams["sub_category"] ? searchParams["sub_category"] : "";
  const frame_style = searchParams["frame_style"] ? searchParams["frame_style"] : "";
  const gender = searchParams["gender"] ? searchParams["gender"] : "";

  let query = supabase.from("products").select('*, category!inner(id, title,slug), sub_category!inner(id, title,slug)')

  if(slug === "eyewear" ) {
    query = query
    .eq("category.slug", slug)
  }

  if(slug === "eyewear" && frame_style.length !== 0) {
query = query
  .eq("category.slug", slug)
  .ilike("frame_style", `%${frame_style}%`);
  }

  if(slug === "eyewear" && gender.length !== 0) {
query = query
  .eq("category.slug", slug)
  .ilike("gender", `${gender}`);
  }

  if(slug !== "eyewear" ) {
    query = query
    .eq("category.slug", slug)
    .ilike("sub_category.slug", `%${sub_category}%`)
  }

  let products: Products = [];

  const { data, error } = await query

  if(error) {
    console.log(error.message)
    products =  []
  } else {
    products = data
  }



  // const { data: category, error } = await supabase
  //   .from("categories")
  //   .select("*")
  //   .eq("slug", slug)
  //   .single();

  //   if(!category) {
  //     return {
  //       notFound: true,
  //     }
  //   }

  //   let products:Products = []

  //   if(category.slug === "eyewear") {

  //     console.log("Fetching Eyewear")

  //         const { data, error: categoryError } = await supabase
  //           .from("products")
  //           .select(
  //             "*, category!inner(id, title,slug), sub_category!inner(id, title,slug)"
  //           )
  //           .eq("category.slug", category.slug)
  //           .ilike("frame_style", `%${frame_style}%`)
  //           .ilike("gender", `${gender}`);

  //           console.log({data, categoryError})

  //           if(categoryError) {
  //             console.log(categoryError.message)
  //             products = []
  //           } else {
  //             products = data
  //           }

  //   } else {
  //           const { data, error: categoryError } = await supabase
  //             .from("products")
  //             .select(
  //               "*, category!inner(id, title,slug), sub_category!inner(id, title,slug)"
  //             )
  //             .eq("category.slug", category.slug)
  //             .ilike("sub_category.slug", `%${sub_category}%`)

  //             if(categoryError) {
  //               products = []
  //             } else {
  //               products  = data
  //             }

  //   }


               return (
             <div className="flex justify-center w-full px-4">
              {products.length === 0 ? (<NoProducts />) :
               <ProductsGrid products={products!} />
              }
             </div>
           );

};
export default page;
