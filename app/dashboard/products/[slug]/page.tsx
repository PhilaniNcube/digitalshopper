import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import ProductUpdateForm from "./ProductUpdateForm";
import { Database } from "@/schema";
import ProductTags from "./ProductTags";

const page = async ({params:{slug}}:{params: {slug:string}}) => {

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
  const productData = await supabase.from("products").select("*").eq("slug", slug).single();
  const categoriesData = supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: true });
  const brandsData = supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });
  const sub_categoriesData = supabase
    .from("sub_categories")
    .select("*, category(*)")
    .order("title", { ascending: true });
  const frameStylesData = supabase
    .from("frame_styles")
    .select("*")
    .order("title", { ascending: true });
  const coloursData = supabase.from("colour").select("*");
  const sizeData = supabase.from("size").select("*");

  const [
    { data: product, error: productError },
    { data: categories, error: categoriesError },
    { data: brands, error: brandsError },
    { data: sub_categories, error: sub_categoriesError },
    { data: colours, error: coloursError },
    { data: sizes, error: sizesError },
    { data: frame_styles, error: frameStylesError },
  ] = await Promise.all([
    productData,
    categoriesData,
    brandsData,
    sub_categoriesData,
    coloursData,
    sizeData,
    frameStylesData,
  ]);

  return (
    <div className="w-full">
      <div className="w-full flex items-end justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/dashboard/products">
          <Button type="button">
            <ArrowLeft />
            <span className="ml-2">Back</span>
          </Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <ProductUpdateForm
        product={product!}
        colours={colours!}
        sizes={sizes!}
        categories={categories!}
        sub_categories={sub_categories!}
        brands={brands!}
        frame_styles={frame_styles!}
      />
    </div>
  );
};
export default page;
