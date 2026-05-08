"use cache";

import { fetchFeaturedProducts } from "@/dal/queries/products";
import { formatCurrency, getDisplayPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

import React from "react";

const FeaturedProducts = async () => {
  const featuredProducts = await fetchFeaturedProducts(4);

  return (
    <div className="py-10 bg-primary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between">
          <h2 className="mb-6 text-2xl font-semibold">
            <Check className="inline-block mr-2 text-primary-strong!" />
            <span className="text-white!">Featured Products</span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            Explore our handpicked selection of top-tier products, chosen for
            their quality and performance.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              prefetch={false}
              className="block transition-shadow group bg-surface-low hover:shadow-lg"
            >
              <div className="relative w-full overflow-hidden aspect-square">
                <ViewTransition
                  name={`product-image-${product.slug}`}
                  share="product-image-morph"
                >
                  <Image
                    src={product.mainImage!}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-cover object-center w-full h-full transition-transform aspect-square group-hover:scale-105"
                  />
                </ViewTransition>
              </div>
              <div className="flex flex-col p-4 md:flex-row md:justify-between md:items-start">
                <h3 className="text-sm text-white! font-medium ">
                  {product.title}
                </h3>
                <p className="text-sm md:text-lg font-semibold text-primary-strong!">
                  {formatCurrency(getDisplayPrice(product))}
                </p>
              </div>
              <div className="px-4 pb-4">
                <small className="text-xs text-muted-foreground">
                  {product.specs && product.specs.length > 0
                    ? product.specs.slice(0, 2).join(" • ")
                    : null}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
