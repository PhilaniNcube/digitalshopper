import type { Database } from "@/schema";

import ProductDetails from "./ProductDetails";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { sendGTMEvent } from "@next/third-parties/google";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const siteURL = "https://www.digitalshopper.co.za";

  const supabase = createClient()


  const { data: product, error } = await supabase
    .from("products")
    .select("*, brand(*), category(*), sub_category(*)")
    .eq("slug", slug)
    .single();

  return {
    title: `${product?.title} | Digital Shopper`,
    description: product?.description,
    keywords: product?.attributes
      ?.map((attribute) => attribute.value)
      .join(", "),
    creator: "Athena Media",

    robots: "index, follow",

    openGraph: {
      title: `${product?.title} | Digital Shopper`,
      description: product?.description,
      siteName: "Digital Shopper",
      type: "website",

      url: `${siteURL}/products/${slug}`,
      images: [
        {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          url: product?.images[0]!,
          width: 500,
          height: 500,
          alt: product?.title,
        },
      ],
    },
    alternates: {
      canonical: `${siteURL}/products/${slug}`,
    },
  };
}

const page = async ({ params: { slug } }: { params: { slug: string } }) => {


const supabase = createClient();



  const {data:product, error} = await supabase.from("products").select("*, brand(*), category(*), sub_category(*)").eq("slug", slug).single();

  sendGTMEvent({
    event: "view_item",
    data: {
      currency: "ZAR",
      value: product?.price ,
      items: [
        {
          item_id: product?.id,
          item_name: product?.title,
        },
      ],
    },
  })

  return (
    <main className="">
      {error ? (
        <div>
          <h1>Product not found</h1>
        </div>
      ) : (
        // @ts-ignore
        <ProductDetails product={product} />
      )}
    </main>
  );
};
export default page;
