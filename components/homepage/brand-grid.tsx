import Image from "next/image";
import React from "react";

const brands = [
  { src: "https://www.syntech.co.za/wp-content/uploads/2024/07/ACER-01.jpg", alt: "Acer" },
  { src: "https://www.syntech.co.za/wp-content/uploads/2020/08/2021-Logo_AMD_wr.png", alt: "AMD" },
  { src: "https://www.syntech.co.za/wp-content/uploads/2025/06/Asus_500x500px-01.jpg", alt: "Asus" },
  { src: "https://www.syntech.co.za/wp-content/uploads/2017/04/2021-Logo_GIZZU_wr.png", alt: "Gizzu" },
  { src: "https://www.syntech.co.za/wp-content/uploads/2020/04/Xiaomi_Website_Logo_500x500px-36.jpg", alt: "Xiaomi" },
  { src: "https://www.syntech.co.za/wp-content/uploads/2017/04/2021-Logo_Redragon_wr.png", alt: "Redragon" },
];

const BrandGrid = () => {
  return (
    <section id="brand-grid" className="py-10 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-semibold text-center text-primary!">
          Featured Brands
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <div key={brand.alt} className="flex items-center justify-center p-4">
              <Image
                src={brand.src}
                alt={brand.alt}
                className="max-h-12"
                width={100}
                height={48}
                loading="lazy"
                sizes="100px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGrid;
