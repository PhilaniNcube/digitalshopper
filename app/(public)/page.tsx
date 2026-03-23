import type { Metadata } from "next";
import BrandGrid from "@/components/homepage/brand-grid";
import { Hero } from "@/components/homepage/hero";
import FeaturedCategories from "@/components/homepage/featured-categories";
import FeaturedProducts from "@/components/homepage/featured-products";

export const metadata: Metadata = {
	title: "Digital Shopper | Shop Tech & Electronics Online in South Africa",
	description:
		"Browse and buy the latest tech, electronics, and computer hardware online. Fast delivery across South Africa.",
	openGraph: {
		title: "Digital Shopper | Shop Tech & Electronics Online",
		description:
			"Browse and buy the latest tech, electronics, and computer hardware online. Fast delivery across South Africa.",
		type: "website",
	},
};

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BrandGrid />
      <FeaturedCategories />
	  <FeaturedProducts />
    </div>
  );
}
