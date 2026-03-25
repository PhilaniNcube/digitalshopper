import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { TrackViewItem } from "@/components/products/track-view-item";
import { Badge } from "@/components/ui/badge";
import {
  fetchProductBySlug,
  type ProductWithImagesAndInventory,
} from "@/dal/queries/products";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";


function getDisplayPrice(product: ProductWithImagesAndInventory) {
  return product.promoPrice ?? product.rrpIncl ?? product.price * 1.14 * 1.15;
}

function getCartProduct(product: ProductWithImagesAndInventory) {
  const mainImage =
    product.images.find((i) => i.isPrimary)?.url ??
    product.featuredImage ??
    "/images/banner.webp";

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category?.slug ?? "uncategorized",
    price: Math.round(getDisplayPrice(product)),
    image: mainImage,
    summary:
      product.summary ??
      product.shortDescription ??
      "Precision hardware selected for high-performance builds.",
    specs: product.specs.slice(0, 3),
    featured: product.featured,
    inStock: product.inStock,
  };
}

function getStockLabel(product: ProductWithImagesAndInventory) {
  if (!product.inStock) return "Back order";
  if (product.totalStock <= 5) return `Low stock · ${product.totalStock} left`;
  return "In stock";
}

function getWarehouseLabel(inventory: ProductWithImagesAndInventory["inventory"]) {
  const stocked = inventory.filter((w) => w.quantity > 0);
  if (stocked.length === 0) return null;

  return stocked.map((w) => w.warehouseCode).join(", ");
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 border-t border-white/6 pt-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p className="font-display text-sm font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

const ProductDetails = async ({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ slug: string }>;
}) => {
  const { slug } = await searchParamsPromise;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const price = getDisplayPrice(product);
  const cartProduct = getCartProduct(product);
  const warehouseLabel = getWarehouseLabel(product.inventory);
  const hasPromo = product.promoPrice != null && product.promoPrice < (product.rrpIncl ?? product.price * 1.14 * 1.15);

  const galleryImages =
    product.images.length > 0
      ? product.images.map((i) => ({ url: i.url, isPrimary: i.isPrimary }))
      : [{ url: product.featuredImage ?? "/images/banner.webp", isPrimary: true }];

  const highlightSpecs = product.specs.slice(0, 4);

  const rawAttrs = product.rawAttributes ?? {};
  const specEntries = Object.entries(rawAttrs).filter(
    ([, v]) => v != null && String(v).trim() !== "",
  );

  const mainImage =
    product.images.find((i) => i.isPrimary)?.url ??
    product.featuredImage ??
    "/images/banner.webp";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(product.summary && { description: product.summary }),
    image: mainImage,
    ...(product.supplierSku && { sku: product.supplierSku }),
    ...(product.ean && { gtin: product.ean }),
    ...(product.brand?.name && {
      brand: { "@type": "Brand", name: product.brand.name },
    }),
    offers: {
      "@type": "Offer",
      url: `https://digitalshopper.co.za/products?slug=${product.slug}`,
      priceCurrency: "ZAR",
      price: Math.round(price),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/BackOrder",
      ...(product.category?.name && {
        itemCondition: "https://schema.org/NewCondition",
      }),
    },
  };

  return (
    <>
      <TrackViewItem product={cartProduct} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Breadcrumb ── */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/products" className="transition hover:text-white">
          Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="transition hover:text-white"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-400">{product.title}</span>
      </nav>

      {/* ── Hero Section ── */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Image Gallery */}
        <ProductImageGallery images={galleryImages} title={product.title} />

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Category / Brand label */}
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-primary-strong">
            {product.brand?.name ?? "Digital Shopper"}
            {product.category && (
              <span className="text-slate-500">
                {" "}
                // {product.category.name}
              </span>
            )}
          </p>

          {/* Product Title */}
          <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-white md:text-4xl lg:text-5xl">
            {product.title}
          </h1>

          {/* Summary */}
          {product.summary && (
            <p className="max-w-lg text-sm leading-relaxed text-slate-400">
              {product.summary}
            </p>
          )}

          {/* Highlight Specs Grid */}
          {highlightSpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {highlightSpecs.map((spec) => (
                <SpecItem key={spec} label="" value={spec} />
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-2 space-y-3">
            <AddToCartButton
              product={cartProduct}
              size="lg"
              className="w-full rounded-none bg-primary-strong py-6 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-primary-strong/90"
            >
              <ShoppingCart className="mr-2 size-4" />
              Add to cart — {formatCurrency(price)}
            </AddToCartButton>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={
                  product.inStock
                    ? "size-2 rounded-full bg-emerald-500"
                    : "size-2 rounded-full bg-amber-500"
                }
              />
              <span className="font-medium uppercase tracking-widest text-slate-400">
                {getStockLabel(product)}
              </span>
              {warehouseLabel && (
                <span className="text-slate-600">
                  · {warehouseLabel}
                </span>
              )}
            </div>
          </div>

          {/* Extra details */}
          <div className="mt-4 flex flex-wrap gap-3">
            {product.warranty && (
              <Badge
                variant="outline"
                className="gap-1.5 border-white/8 bg-white/4 text-slate-400"
              >
                <PackageCheck className="size-3" />
                {product.warranty}
              </Badge>
            )}
            {product.ean && (
              <Badge
                variant="outline"
                className="border-white/8 bg-white/4 text-slate-400"
              >
                EAN: {product.ean}
              </Badge>
            )}
            {product.colour && (
              <Badge
                variant="outline"
                className="border-white/8 bg-white/4 text-slate-400"
              >
                {product.colour}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Technical Specifications ── */}
      {specEntries.length > 0 && (
        <section className="mt-16">
          <div className="mb-8 flex items-end justify-between border-b border-white/6 pb-4">
            <h2 className="font-display text-xl font-bold uppercase tracking-[-0.02em] text-white md:text-2xl">
              Technical Specifications
            </h2>
            {product.supplierSku && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                SKU: {product.supplierSku}
              </p>
            )}
          </div>

          <div className="grid gap-px bg-white/4 sm:grid-cols-2">
            {specEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline gap-6 bg-site-background px-5 py-3.5"
              >
                <span className="w-36 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  {key}
                </span>
                <span className="text-sm text-slate-300">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── HTML Description ── */}
      {product.descriptionHtml && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-[-0.02em] text-white md:text-2xl">
            Description
          </h2>
          <div
            className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:text-white! prose-a:text-primary-strong! prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </section>
      )}
    </>
  );
};

export default ProductDetails;