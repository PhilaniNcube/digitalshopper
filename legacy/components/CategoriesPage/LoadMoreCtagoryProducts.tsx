"use client"
import { Database } from "@/schema";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams, useRouter, usePathname } from "next/navigation";


const LoadMoreCtagoryProducts = ({params: {slug}}:{params:{slug:string}}) => {

   const [end, setEnd] = useState(false);

   const searchParams = useSearchParams();

   const category = slug

     const search = searchParams.get("search") ?? "";
      // const category = searchParams.get("category") ?? "";
      const sub_category = searchParams.get("sub_category") ?? "";
      const frame_style = searchParams.get("frame_style") ?? "";
      const gender = searchParams.get("gender") ?? "";


  return <div>LoadMoreCtagoryProducts</div>;
};
export default LoadMoreCtagoryProducts;
