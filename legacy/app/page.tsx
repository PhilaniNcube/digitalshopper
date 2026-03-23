import { cookies } from 'next/headers'
import { Database } from '@/schema'
import HomepageHero from '@/components/Homepage/HomepageHero'
import CategoriesSection from '@/components/Homepage/CategoriesSection'
import FeaturedHeadphones from '@/components/Homepage/FeaturedHeadphones'
import FeaturedBathProduct from '@/components/Homepage/FeaturedBathProduct'
import FeaturedWatches from '@/components/Homepage/FeaturedWatches'
import WhyUsSection from '@/components/Homepage/WhyUsSection'
import { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import HomeHero from '@/components/Homepage/HomeHero'
import FeaturedProducts from '@/components/Products/FeaturedProducts'



export const metadata:Metadata = {
  title: "Digital Shopper",
  description:
    "Digital Shopper for a personalised online shopping experience. Shop for your favourite products and get them delivered to your doorstep. As a small team we give each of our customers the best experience possible.",
    alternates: {
      canonical: "https://www.digitalshopper.co.za",
    },

};


export default async function Index() {


  return (
    <main className="">
      <HomeHero />
      <CategoriesSection />
      <FeaturedProducts />
      {/* <FeaturedHeadphones /> */}
      <FeaturedBathProduct />
      <FeaturedWatches />
      <WhyUsSection />
    </main>
  );
}
