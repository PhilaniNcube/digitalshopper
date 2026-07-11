import React, { Suspense } from "react";
import { fetchProductsByIds } from "@/dal/queries/products";
import { ProductCard } from "@/components/products/product-card";

async function FeaturedProductsGrid({ productIds }: { productIds: string[] }) {
  const products = await fetchProductsByIds(productIds);
  if (products.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function BlogFeaturedProducts({ productIds }: { productIds: string[] }) {
  if (!productIds || productIds.length === 0) return null;

  return (
    <div className="mt-16 border-t border-white/8 pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-white mb-6 font-display">
        Featured Products Mentioned
      </h2>
      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(3, productIds.length) }).map((_, i) => (
              <div key={i} className="aspect-[4/5] w-full rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        }
      >
        <FeaturedProductsGrid productIds={productIds} />
      </Suspense>
    </div>
  );
}
