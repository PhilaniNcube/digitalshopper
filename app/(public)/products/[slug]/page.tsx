import type { Metadata } from "next";
import { fetchProductBySlug } from "@/dal/queries/products";
import ProductDetails from "@/components/products/product-details";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Digital Shopper" };
  }

  const price = product.rrpIncl ?? product.price * 1.14 * 1.15;

  return {
    title: `${product.title} | Digital Shopper`,
    description:
      product.shortDescription ??
      product.summary ??
      `Buy ${product.title} for R${price} at Digital Shopper.`,
    openGraph: {
      title: product.title,
      description:
        product.shortDescription ??
        product.summary ??
        `Buy ${product.title} for R${price} at Digital Shopper.`,
      images: product.featuredImage ? [product.featuredImage] : [],
    },
  };
}

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-white/8" />
        <span className="text-slate-700">/</span>
        <div className="h-3 w-24 rounded bg-white/8" />
      </div>

      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image placeholder */}
        <div className="aspect-square w-full rounded bg-white/6" />

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="h-3 w-32 rounded bg-white/8" />
          <div className="space-y-2">
            <div className="h-8 w-3/4 rounded bg-white/8" />
            <div className="h-8 w-1/2 rounded bg-white/8" />
          </div>
          <div className="h-4 w-full max-w-lg rounded bg-white/6" />
          <div className="h-4 w-2/3 max-w-lg rounded bg-white/6" />

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1 border-t border-white/6 pt-3">
                <div className="h-3 w-full rounded bg-white/6" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-2 space-y-3">
            <div className="h-12 w-full rounded bg-white/8" />
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-white/10" />
              <div className="h-3 w-20 rounded bg-white/8" />
            </div>
          </div>

          {/* Badges */}
          <div className="mt-4 flex gap-3">
            <div className="h-6 w-24 rounded-full bg-white/6" />
            <div className="h-6 w-20 rounded-full bg-white/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <div>
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails searchParamsPromise={params} />;
    </Suspense>
  </div>
);
};

export default ProductPage;
