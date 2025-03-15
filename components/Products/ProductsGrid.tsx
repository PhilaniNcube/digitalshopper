"use client"

import type { Database } from "@/schema";
import ProductGridItem from "./ProductGridItem";

type ProductsGridProps = {
  products: Database['public']['Tables']['products']['Row'][] | [];
}

const ProductsGrid = ({products}: ProductsGridProps) => {


  return (
    <div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => (
         <ProductGridItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
export default ProductsGrid;
