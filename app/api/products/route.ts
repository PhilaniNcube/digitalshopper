import { db } from "@/lib/db";
import { products, brands, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = "https://www.digitalshopper.co.za";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function centsToRand(cents: number): string {
  return (cents / 100).toFixed(2);
}

export async function GET() {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      descriptionHtml: products.descriptionHtml,
      summary: products.summary,
      featuredImage: products.featuredImage,
      price: products.price,
      rrpIncl: products.rrpIncl,
      promoPrice: products.promoPrice,
      inStock: products.inStock,
      ean: products.ean,
      weightGrams: products.weightGrams,
      colour: products.colour,
      supplierSku: products.supplierSku,
      active: products.active,
      brandName: brands.name,
      categoryName: categories.name,
      categoryPath: categories.path,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.active, true));

  const items = rows
    .map((row) => {
      // const salePrice = row.rrpIncl ? row.rrpIncl : (row.price * 1.15) * 1.15;
      const regularPrice = row.promoPrice
        ? row.rrpIncl
        : row.rrpIncl;
      const title = escapeXml(row.title);
      const description = escapeXml((row.summary ?? row.title).slice(0, 5000));
      const link = `${SITE_URL}/products/${row.slug}`;
      const imageLink = row.featuredImage ? escapeXml(row.featuredImage) : "";

      const availability = row.inStock ? "in_stock" : "out_of_stock";
      const condition = "new";
      const categoryPath = row.categoryPath
        ? escapeXml(row.categoryPath.replace(/\//g, " > "))
        : "";

      let itemXml = `    <item>
      <g:id>${escapeXml(row.supplierSku)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:price>${regularPrice} ZAR</g:price>`;

      if (imageLink) {
        itemXml += `
      <g:image_link>${imageLink}</g:image_link>`;
      }

      if (row.brandName) {
        itemXml += `
      <g:brand>${escapeXml(row.brandName)}</g:brand>`;
      }

      if (row.ean) {
        itemXml += `
      <g:gtin>${escapeXml(row.ean)}</g:gtin>`;
      }

      if (categoryPath) {
        itemXml += `
      <g:product_type>${categoryPath}</g:product_type>`;
      }

      if (row.weightGrams) {
        const weightKg = (row.weightGrams / 1000).toFixed(3);
        itemXml += `
      <g:shipping_weight>${weightKg} kg</g:shipping_weight>`;
      }

      if (row.colour) {
        itemXml += `
      <g:color>${escapeXml(row.colour)}</g:color>`;
      }

      itemXml += `
    </item>`;

      return itemXml;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Digital Shopper</title>
    <link>${SITE_URL}</link>
    <description>Digital Shopper Product Feed</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
