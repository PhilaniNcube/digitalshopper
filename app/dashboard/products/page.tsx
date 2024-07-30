import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Database } from "@/schema";
import ProductsTable from "./ProductsTable";
import SearchProducts from "./SearchProducts";

export const dynamic = "force-dynamic";

const page = async ({searchParams}:{searchParams:{[key:string]:string | string[] | undefined}}) => {

  const page = searchParams['page'] ?? '1'

  const per_page = searchParams['per_page'] ?? '10'

  const search = searchParams['search'] ?? ''

  const start = (Number(page) - 1) * Number(per_page)
  const end = start + Number(per_page)

    const cookieStore = cookies()

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

  const {data: products, error, count} = await supabase.from("products").select("*, category(*), sub_category(*), brand(*), frame_style, gender", {
    count: "exact",
  }).range(start, end).ilike("title", `%${search}%`).order('title', { ascending: true });


  const hasPrevPage = start > 0;
  const hasNextPage = end < count!;
  console.log({ start, hasPrevPage, end, hasNextPage })

  return (
    <div className="w-full">
      <div className="flex items-end justify-between w-full">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/dashboard/products/create">
          <Button type="button">
            <PlusIcon />
            <span className="ml-2">Create Product</span>
          </Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <section className="w-full">
        <div className="w-full max-w-lg px-2 my-2">
         <SearchProducts />
        </div>
        <ProductsTable products={products!} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} page={page} search={search} />
      </section>
    </div>
  );
};
export default page;
