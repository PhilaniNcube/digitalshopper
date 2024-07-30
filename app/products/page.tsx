import { cookies } from "next/headers";
import Filter from "./_components/filter";
import Search from "./_components/search";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/schema";
import ProductsGrid from "@/components/Products/ProductsGrid";
import NoProducts from "@/components/Products/NoProducts";
import { Suspense } from "react";
import Pagination from "./_components/pagination";
import { fetchProducts } from "@/actions/products";
import Spinner from "./_components/spinner";
import LoadMore from "@/components/Products/LoadMore";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams["page"] ?? "1";

  // const per_page = searchParams["per_page"] ?? "40";

  const search = searchParams["search"] ?? "";
  const category = searchParams["category"] ?? "";

  // const start = (Number(page) - 1) * Number(per_page);
  // const end = start + Number(per_page);

  const products = await fetchProducts(Number(page), search, category);

  // const cookieStore = cookies();

  // const supabase = createServerClient<Database>(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return cookieStore.get(name)?.value;
  //       },
  //     },
  //   }
  // );



  //   const {
  //     data: products,
  //     error,
  //     count,
  //   } = await supabase
  //     .from("products")
  //     .select(
  //       "*, category!inner(id, slug, title), sub_category(*), brand(*), frame_style, gender",
  //       {
  //         count: "exact",
  //       }
  //     )
  //     .limit(Number(per_page))
  //     .range(Number(start), Number(end))
  //     .ilike("category.slug", `%${category}%`)
  //     .ilike("title", `%${search}%`)
  //     .ilike("sub_category.title", `%${search}%`)
  //     .ilike("description", `%${search}%`)
  //     .order("title", { ascending: true });

      // const { data, error: errorSearch } = await supabase
      //   .rpc("filter_products", {
      //     search_text: search,
      //   })
      //   .limit(Number(per_page))
      //   .range(Number(start), Number(end));

      // console.log({data, error:errorSearch});



  // const hasPrevPage = start > 0;
  // const hasNextPage = end < count!;

  // console.log({ hasPrevPage, hasNextPage });

  return (
    <main className="container py-10">
      <Search />
      <section className="flex flex-col gap-4 lg:flex-row">
        <Filter searchParams={searchParams} />
        <div className="flex-1 mt-3">
          <Suspense fallback="...Loading">
            {!products || products.length === 0 ? (
              <NoProducts />
            ) : (
              <ProductsGrid products={products} />
            )}
          </Suspense>
          <LoadMore />
        </div>
        <div className="h-[40px]">
        </div>
      </section>
    </main>
  );
};
export default page;
