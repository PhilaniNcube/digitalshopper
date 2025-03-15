// import CategoryHeader from "@/components/CategoriesPage/CategoryHeader";
import { Database } from "@/schema";
import { cookies } from "next/headers";
// import Filter from "./Filter";
import ProductsGrid from "@/components/Products/ProductsGrid";
import { Suspense } from "react";
import ProductsSkeleton from "@/components/Products/ProductsSkeleton";
import { createServerClient } from "@supabase/ssr";
import NoProducts from "@/components/Products/NoProducts";
import Script from "next/script";


type Products = Database['public']['Tables']['products']['Row'][];

const page = async (
  props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    slug
  } = params;

  const cookieStore = await cookies();

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

  // Get category details for JSON-LD
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();



  let query = supabase.from("products").select('*, category!inner(id, title,slug), sub_category!inner(id, title,slug)')



  let products: Products = [];

  const { data, error } = await query

  if(error) {
    console.log(error.message)
    products =  []
  } else {
    products = data
  }

  // Create JSON-LD for category page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category ? `${category.title} Collection` : `Product Collection`,
    description: category ? `Browse our collection of ${category.title} products` : 'Browse our product collection',
    url: `https://www.digitalshopper.co.za/categories/${slug}`,
    ...(category?.image_url && { 
      image: category.image_url 
    }),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: product.images[0],
          url: `https://www.digitalshopper.co.za/products/${product.slug}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'ZAR',
            availability: product.instock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          }
        }
      }))
    }
  };




  return (
<div className="flex justify-center w-full px-4">
  {/* Add JSON-LD script */}
  <Script
    id="category-jsonld"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
  
  {products.length === 0 ? (<NoProducts />) :
    <ProductsGrid products={products!} />
  }
</div>
);
};
export default page;
