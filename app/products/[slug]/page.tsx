
import ProductDetails from "./ProductDetails";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";


export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const siteURL = "https://www.digitalshopper.co.za";

  const supabase = await createClient()


  const { data: product, error } = await supabase
    .from("products")
    .select("*, brand(*), category(*), sub_category(*)")
    .eq("slug", slug)
    .single();

  return {
    title: `${product?.title} | Digital Shopper`,
    description: product?.description,
    creator: "Athena Media",

    robots: "index, follow",

    openGraph: {
      title: `${product?.title} | Digital Shopper`,
      description: product?.description,
      siteName: "Digital Shopper",
      type: "website",

      url: `${siteURL}/products/${slug}`,
    },
    alternates: {
      canonical: `${siteURL}/products/${slug}`,
    },
  };
}

const page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;

  const {
    slug
  } = params;


  const supabase = await createClient();



  const {data:product, error} = await supabase.from("products").select("*, brand(*), category(*), sub_category(*)").eq("slug", slug).single();



  return (
    <main className="">
      {error ? (
        <div>
          <h1>Product not found</h1>
        </div>
      ) : (
        // @ts-ignore
        (<ProductDetails product={product} />)
      )}
    </main>
  );
};
export default page;
