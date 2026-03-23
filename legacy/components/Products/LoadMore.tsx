"use client"

import type { Database } from "@/schema";
import { useEffect, useState } from "react";
import {useInView} from "react-intersection-observer"
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import ProductsGrid from "./ProductsGrid";
import Spinner from "@/app/products/_components/spinner";
import { fetchInStockProducts } from "@/utils/fetchers/products";

const LoadMore = () => {

  const router = useRouter()

  const [end, setEnd] = useState(false)

  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = searchParams.get("page") ?? "1";

  const [products, setProducts] = useState<Database["public"]['Tables']['products']['Row'][]>([])


  const {ref, inView} = useInView()

  // state to track the number of pages already loaded
  const [pagesLoaded, setPagesLoaded] = useState(Number(page));


  const pathName = usePathname();

  // a function to load more products
 const loadMoreProducts = async () => {

  console.log("scrolled to the end");





       const nextPage = pagesLoaded + 1;
       const newProducts = (await fetchInStockProducts(nextPage, search)) ?? [];

        if (newProducts.length === 0) {
          setEnd(true);
          console.log("No products left")
          return;
        }


      setProducts([...products, ...newProducts]);
      setPagesLoaded(nextPage);
 }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (inView) {

      loadMoreProducts();
    }


  },[inView])

  return (
    <div>
      <ProductsGrid products={products} />
      <div className="mt-5" ref={ref}>
        {end ? <p className="text-center">No more products</p> : <Spinner />}
      </div>
    </div>
  );
};
export default LoadMore;
