/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Ok4qvDiYyLx
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/schema";
import ProductGridItem from "./ProductGridItem";

export default async function FeaturedProducts() {

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

       const { data: products, error } = await supabase.from("products").select('*').eq("featured", true).limit(4);

  return (
    <section className="container ">
      <h2 className="text-2xl md:text-4xl font-bold text-center">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6">
        {products?.map((product) => (
          <ProductGridItem key={product.id} product={product!} />
        ))}
      </div>
    </section>
  );
}
