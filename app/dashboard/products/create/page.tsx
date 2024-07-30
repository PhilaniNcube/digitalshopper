import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import CreateProductForm from "./CreateProductForm";

export const dynamic = "force-dynamic";

const page = async () => {

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

  const categoriesData = supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: true });
  const brandsData = supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });
  const sub_categoriesData = supabase.from("sub_categories").select("*, category(*)").order('title', { ascending: true });
  const frameStylesData = supabase.from("frame_styles").select("*").order('title', { ascending: true });
  const coloursData = supabase.from("colour").select("*");
  const sizeData = supabase.from("size").select("*");

  const [
    { data: categories, error: categoriesError },
    { data: brands, error: brandsError },
    { data: sub_categories, error: sub_categoriesError },
    { data: colours, error: coloursError },
    { data: sizes, error: sizesError },
    { data: frame_styles, error: frameStylesError },
  ] = await Promise.all([
    categoriesData,
    brandsData,
    sub_categoriesData,
    coloursData,
    sizeData,
    frameStylesData,
  ]);

   console.log({frame_styles})

  return <div className="w-full">
    <div className="w-full flex items-end justify-between">
      <h1 className="text-3xl font-bold">New Product</h1>
    </div>
    <Separator />
    <CreateProductForm colours={colours!} sizes={sizes!} categories={categories!} sub_categories={sub_categories!} brands={brands!} frame_styles={frame_styles!} />
  </div>;
};
export default page;
