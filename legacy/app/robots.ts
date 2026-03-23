import type { MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/orders", "/dashboard/*", "/dashboard", "/auth/*"],
    },
    sitemap: "https://digitalshopper.co.za/sitemap.xml"
  }
}
