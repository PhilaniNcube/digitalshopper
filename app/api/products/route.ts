import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    // Fetch product data from your database
    const supabase = await createClient();
    const { data: products, error } = await supabase.from("products").select("*, brand(*), category(*), sub_category(*)");

    if (error) {
        return new NextResponse("An error occurred while fetching products", { status: 500 });
    }

    // Generate XML feed
    const xmlFeed = generateGoogleMerchantFeed(products);

    // Ensure no extra characters are sent before the XML
    return new NextResponse(xmlFeed.trim(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}

// Function to generate Google Merchant Center-compatible XML feed
function generateGoogleMerchantFeed(products: any[]) {
    const items = products
        .map((product) => {
            return `
        <item>
          <g:id>${product.id}</g:id>
          <g:title><![CDATA[${product.title}]]></g:title>
          <g:description><![CDATA[${product.description}]]></g:description>
          <g:link>https://digitalshopper.co.za/${product.slug}</g:link>
          <g:image_link><![CDATA[${product.images[0]}]]></g:image_link>
          <g:availability>in_stock</g:availability>
          <g:price>${product.price} ZAR</g:price>
          <g:brand><![CDATA[${product.brand.title}]]></g:brand>
          <g:condition><![CDATA[New]]></g:condition>
        </item>
      `;
        })
        .join("");

    return `
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Digital Shopper</title>
    <link>https://digitalshopper.co.za</link>
    <description>Digital Shopper Product Feed</description>
    ${items}
  </channel>
</rss>
  `.trim(); // Trim any extra whitespace
}