import ProductDetails from "./ProductDetails";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import Script from "next/script";


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
      images: [
        {
          url: product.images[0],
          width:500,
          height:500,
          alt: product?.title
        }
      ],
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

  // Create JSON-LD for product
  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.id,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name,
    },
    category: `${product.category?.title}${product.sub_category ? ` > ${product.sub_category.title}` : ''}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ZAR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `https://www.digitalshopper.co.za/products/${slug}`,
    }
  } : null;


  return (
    <main className="">
      {error ? (
        <div>
          <h1>Product not found</h1>
        </div>
      ) : (
        <>
          {/* Add JSON-LD script */}
          {product && (
            <Script
              id="product-jsonld"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          )}
          {/* @ts-ignore */}
          <ProductDetails product={product} />
        </>
      )}
    </main>
  );
};
export default page;
