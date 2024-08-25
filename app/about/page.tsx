import PageHeader from "@/components/PageHeader";
import Image from "next/image";

import type { Metadata } from "next";
import AboutHero from "./_components/about-hero";
import Advantage from "./_components/advantage";
import Team from "./_components/team";

export const metadata: Metadata = {
  title: "About | Digital Shopper",
  description: "We are a small team of passionate people who are committed to providing our customers with a personal and unique shopping experience. We hand-pick all of our products, and we take the time to get to know our customers so that we can recommend the perfect items for them.",
};

const page = () => {
  return (
    <main className="">
      <AboutHero />
      <Advantage />
      <Team />
    </main>
  );
};
export default page;
