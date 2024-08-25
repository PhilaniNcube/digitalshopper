import type { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import ProductDetails from "./ProductDetails";
import analytics from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const siteURL = "https://www.digitalshopper.co.za";

    const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

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
    category: product?.category?.title,
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

    const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )



  const {data:product, error} = await supabase.from("products").select("*, brand(*), category(*), sub_category(*)").eq("slug", slug).single();

    analytics.track("view_item", {
      item_id: product?.id,
      item_name: product?.title,
      item_category: product?.category?.title,
      item_brand: product?.brand?.name,
      price: product?.price,
      currency: "ZAR",
    });

  return (
    <main className="">
      {error ? (
        <div>
          <h1>Product not found</h1>
        </div>
      ) : (
        <ProductDetails product={product} />
      )}
    </main>
  );
};
export default page;
