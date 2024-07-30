"use client"

import BackButton from "@/components/BackButton";
import formatter from "@/lib/currency";
import { Database } from "@/schema";
import Image from "next/image";
import CartButton from "./CartButton";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import analytics, { cn } from "@/lib/utils";



type DetailProps = {
  product: Database["public"]["Tables"]["products"]["Row"];
}

const ProductDetails = ({product}:DetailProps) => {

  const [selectedImage, setSelectedImage] = useState(product.images[0]);


  useEffect(() => {

    analytics.track("view_item", {
      currency: "ZAR",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category.title,
          item_category_2: product.sub_category.title,
          item_brand: product.brand.name,
          price: product.price,
        },
      ],
    });


  },[])



  return (
    <div
      itemScope
      itemType="https://schema.org/Product"
      className="container py-10"
    >
      <div>
        <BackButton />
      </div>
      <div className="grid w-full grid-cols-1 gap-6 mt-5 md:grid-cols-2">
        <div className="flex w-full gap-4">
          <div className="flex flex-col gap-2 w-[16%]">
            {product.images?.map((image, index) => (
              <Image
                src={image}
                itemProp="image"
                width={300}
                height={200}
                alt={product.title}
                key={index}
                onClick={() => setSelectedImage(image)}
                className="object-cover w-full border cursor-pointer border-slate-200 hover:border-2"
              />
            ))}
          </div>
          <Image
            src={selectedImage}
            width={800}
            height={800}
            alt={product.title}
            className={cn(
              "flex-1 w-[80%] object-cover border border-transparent hover:border-slate-200",
              product.category.slug === "eyewear"
                ? " h-[280px] p-3"
                : "rounded-md aspect-square"
            )}
          />
        </div>
        <span className="hidden" aria-hidden itemProp="name">
          {product.title}
        </span>
        <span className="hidden" aria-hidden itemProp="description">
          {product.description}
        </span>
        <span className="hidden" aria-hidden itemProp="sku">
          {product.id}
        </span>
        <div
          className="w-full"
          itemProp="offers"
          itemType="https://schema.org/Offer"
          itemScope
        >
          <h1 itemProp="name" className="text-3xl font-extrabold text-black">
            {product.title}
          </h1>
          <p
            itemProp="description"
            className="mt-5 mb-4 text-sm font-medium tracking-wider lg:text-md text-slate-600"
          >
            {product.description}
          </p>
          <span
            className="hidden"
            aria-hidden
            itemProp="price"
            content={`${product.price}`}
          >
            {product.price}
          </span>
          <span
            className="hidden"
            aria-hidden
            itemProp="priceCurrency"
            content="ZAR"
          >
            ZAR
          </span>
          <span
            className="hidden"
            aria-hidden
            itemProp="availability"
            content="inStock"
          >
            in stock
          </span>

          <h2 className="text-3xl lg:text-5xl" suppressHydrationWarning>{formatter(product.price)}</h2>

          {product.has_variants && (
            <div className="mt-5">
              <h2 className="text-2xl font-semibold">Variants</h2>
            </div>
          )}

          <div className="mt-5">
            <CartButton product={product} />
          </div>
          <Separator className="my-4" />
          <div className="w-full">
            <h2 className="text-2xl font-semibold">Details</h2>
            {product.attributes?.map((attribute, index) => (
              <div className="flex mt-1 space-x-6" key={index}>
                <h4 className="text-sm font-semibold lg:text-md">
                  {attribute.key}:
                </h4>
                <h4 className="text-sm lg:text-md">{attribute.value}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
