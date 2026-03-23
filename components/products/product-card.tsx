import { AddToCartButton } from "@/components/products/add-to-cart-button";
import type { ProductListItem } from "@/dal/queries/products";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getDisplayPrice(product: ProductListItem) {
  return product.promoPrice ?? product.rrpIncl ?? product.price * 1.14 * 1.15;
}

function getAvailabilityLabel(product: ProductListItem) {
  if (!product.inStock) {
    return "Back order";
  }

  if (product.totalStock <= 5) {
    return `Low stock: ${product.totalStock} left`;
  }

  return `${product.totalStock} units ready`;
}

function getSignalStrength(product: ProductListItem) {
  if (!product.inStock) {
    return 1;
  }

  if (product.totalStock <= 2) {
    return 3;
  }

  if (product.totalStock <= 5) {
    return 4;
  }

  return 5;
}

function getCartProduct(product: ProductListItem) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category?.slug ?? "uncategorized",
    price: Math.round(getDisplayPrice(product)),
    image: product.mainImage ?? "/images/banner.webp",
    summary:
      product.summary ??
      product.shortDescription ??
      "Precision hardware selected for high-performance builds.",
    specs: product.specs.slice(0, 3),
    featured: product.featured,
    inStock: product.inStock,
  };
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const imageSrc = product.mainImage ?? "/images/banner.webp";
  const signalStrength = getSignalStrength(product);
  const price = getDisplayPrice(product);
  const cartProduct = getCartProduct(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col bg-surface-low ring-1 ring-white/6 transition duration-300 hover:-translate-y-1 hover:bg-surface-high hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
    >
      <article className="group flex h-full flex-col bg-surface-low ring-1 ring-white/6 transition duration-300 hover:-translate-y-1 hover:bg-surface-high hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-square overflow-hidden p-0">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 768px) 28vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="mt-5 flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-slate-500">
              {product.brand?.name ?? "Digital Shopper"}
            </p>
            <h3 className="line-clamp-2 font-display text-md font-semibold leading-[1.05] tracking-[-0.05em] text-white">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>{product.category?.name ?? "Catalog component"}</span>
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/6 pt-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-white">
                {formatCurrency(price)}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-primary-strong">
                {getAvailabilityLabel(product)}
              </p>
            </div>
            <AddToCartButton
              product={cartProduct}
              variant="secondary"
              size="icon-lg"
              aria-label={`Add ${product.title} to cart`}
              className="shrink-0 rounded-[0.7rem] border-white/8 bg-white/8 text-slate-300 hover:bg-primary-strong hover:text-black"
            >
              <ShoppingCart className="size-4" />
            </AddToCartButton>
          </div>
        </div>
      </article>
    </Link>
  );
}
