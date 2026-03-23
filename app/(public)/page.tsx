import BrandGrid from "@/components/homepage/brand-grid";
import { Hero } from "@/components/homepage/hero";
import FeaturedCategories from "@/components/homepage/featured-categories";
import FeaturedProducts from "@/components/homepage/featured-products";

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
