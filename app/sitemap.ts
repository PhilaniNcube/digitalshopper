import { Database } from "@/schema";
import { cookies } from "next/headers";
import fs from "fs";
import { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

        const cookieStore = cookies();

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




  const liveURL = "https://digitalshopper.co.za"


  // const res = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Accept": "application/json",
  //   }
  // }).then(res => {
  //   const data = res.json();

  //   console.log(JSON.stringify(data));
  //   return data
  // }).catch(err => console.log(err))

  //   console.log(JSON.stringify(res, null, 2))

  //   const data =await res

  //   console.log(data)



  // // const {productSlugs, categorySlugs} = await res;

   const { data: productSlugs, error:productError } = await supabase.from("products")
    .select("*");
    const { data: categorySlugs, error:categoryError } = await supabase.from("categories").select("*");

    const productUrls = productSlugs?.map((item) => (
      {
        url: `${liveURL}/products/${item.slug}`,
        priority: 0.9,
        lastModified: new Date(),
        id: item.id,
        title: item.title,
        description: item.description,
        link: `${liveURL}/products/${item.slug}`,
        image: item.images[0],
        availability: "in_stock",
        price: `${item.price} ZAR`,
        // brand: item.brand.name,
        identifier_exists: 'no',
        condition: "new",
      }
    ))


    // write the headings of the .txt file for a google merchant center feed
   let feedData = `id\ttitle\tdescription\tlink\timage_link\tavailability\tprice\tbrand\tgoogle_product_category\tproduct_type\tidentifier_exists\n`

   // loop over each product and concantenate the data to the feedData string




    // const productsString = productSlugs?.map((item) => {

    //   //escape tabs and special characters from the product description
    //  let description = item.description.replace(/\t/g, ' ').replace(/"/g, ' ').replace(/'/g, ' ').replace(/&/g, 'and').replace(/</g, ' ').replace(/>/g, ' ').replace(/\\/g, ' ').replace(/\n/g, ' ')

    //      let title = item.title.replace(/\t/g, ' ').replace(/"/g, ' ').replace(/'/g, ' ').replace(/&/g, 'and').replace(/</g, ' ').replace(/>/g, ' ').replace(/\\/g, ' ').replace(/\n/g, ' ')

    //   // return `${item.id}\t${title}\t${description}\t${liveURL}/products/${item.slug}\t${item.images[0]}\tin_stock\t${item.price} ZAR\t${item.brand.name}\t${item.category.title}\t${item.sub_category.title}\tno\n`

    //  // return a string with the product data
    //   return `${item.id}\t${title}\t${description}\t${liveURL}/products/${item.slug}\t${item.images[0]}\tin_stock\t${item.price} ZAR\t${item.brand.name}\t${item.category.title}\t${item.sub_category.title}\tno\n`

    // }).join('')

    // // add the productsString to the feedData string
    // feedData+=productsString

    // // write the feedData to a .txt file
    // fs.writeFile('public/product-feed.txt', feedData, (err) => {
    //   if (err) throw err;
    //   console.log('The file has been saved!');
    // });

  const categoryUrls = categorySlugs?.map((item:any) => ({
    url: `${liveURL}/categories/${item.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))


  return [
    {
      url: `${liveURL}`,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${liveURL}/contact`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date()
    },
    {
      url: `${liveURL}/about`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date()
    },
    {
      url: `${liveURL}/returns`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date()
    },
    {
      url: `${liveURL}/privacy`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date()
    },
    {
      url: `${liveURL}/checkout`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date()
    },
    ...productUrls!,
    ...categoryUrls!
  ]




}
