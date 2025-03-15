import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Database } from "@/schema";
import SearchProducts from "../../products/SearchProducts";
import ProductsTable from "../../products/ProductsTable";
import { redirect } from "next/navigation";
import CategoryDetails from './_components/CategoryDetails';

export const dynamic = "force-dynamic";

const page =async (props:{params: Promise<{slug:string}>}) => {
  const params = await props.params;


  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )


  // fecth the category details
  const {data:category,error} = await supabase.from("categories").select("*").eq('slug', params.slug).single()

  // Fetch products by category from the supabase database

  if(error) {
    console.error(error.message)
    redirect('/dashboard/categories')
  }


  return (
    <section className="w-full">
   <CategoryDetails category={category} />

    </section>
  );
};
export default page;
