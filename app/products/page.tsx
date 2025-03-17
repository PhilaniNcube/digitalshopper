
import Filter from "./_components/filter";
import Search from "./_components/search";
import ProductsGrid from "@/components/Products/ProductsGrid";
import NoProducts from "@/components/Products/NoProducts";
import { Suspense } from "react";
import LoadMore from "@/components/Products/LoadMore";
import { fetchInStockProducts } from "@/utils/fetchers/products";

const page = async (
  props: {
    searchParams: Promise<{ [key: string]: string  }>;
  }
) => {
  const searchParams = await props.searchParams;
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const page = searchParams["page"] ?? "1";
  // const per_page = searchParams["per_page"] ?? "40";

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const search = searchParams["search"] ?? "";


  // const start = (Number(page) - 1) * Number(per_page);
  // const end = start + Number(per_page);

  const pageNumber = Number(page)

  const products = await fetchInStockProducts(pageNumber, search);







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
     
        </div>
 
      </section>
    </main>
  );
};
export default page;
