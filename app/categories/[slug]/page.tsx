// import CategoryHeader from "@/components/CategoriesPage/CategoryHeader";
import { Database } from "@/schema";
import ProductsGrid from "@/components/Products/ProductsGrid";
import NoProducts from "@/components/Products/NoProducts";
import Script from "next/script";
import { createClient } from "@/utils/supabase/server";


type Products = Database['public']['Tables']['products']['Row'][];

const page = async (
  props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const sub_category = searchParams.sub_category as string || "";

  const {
    slug
  } = params;

  const supabase = await createClient();



  // Get category details for JSON-LD
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

    // create a a query to search the supabase database for products in the category with the slug
        



  let query = sub_category  ? supabase.from("products").select('*, category!inner(id, title,slug), sub_category!inner(id, title,slug)').eq("category.slug", slug).filter('sub_category.slug', 'like' ,`${sub_category}` ).order('created_at', {ascending: false})
   : supabase.from("products").select('*, category!inner(id, title,slug), sub_category!inner(id, title,slug)').eq("category.slug", slug).order('created_at', {ascending: false})

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
            shipping: `150 ZAR` ,
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
