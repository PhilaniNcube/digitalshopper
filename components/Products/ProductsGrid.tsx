"use client"
import {useState, useEffect} from 'react'
import { createClient } from '@/utils/supabase/client';

import formatter from "@/lib/currency";
import analytics from "@/lib/utils";
import { Database } from "@/schema";
import Image from "next/image";
import Link from "next/link";
import ProductGridItem from "./ProductGridItem";

type ProductsGridProps = {
  products: Database['public']['Tables']['products']['Row'][] | [];
}

const ProductsGrid = ({products}: ProductsGridProps) => {


  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products?.map((product) => (
         <ProductGridItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
export default ProductsGrid;
