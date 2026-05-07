import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



const htmlNamedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Computes the customer-facing display price for a product.
 *
 * To keep it simple, we display the rrpIncl (recommended retail price) to the customer.
 * If rrpIncl is not available, we fall back to a margin-based calculation.
 */
export function getDisplayPrice(product: {
  price: number;
  rrpIncl?: number | null;
  promoPrice?: number | null;   // supplier promo buy/cost price
  recommendedMargin?: number | null; // percentage, e.g. 14.95 = 14.95%
}): number {
  // 1. Display RRP directly if available
  if (product.rrpIncl != null) {
    return product.rrpIncl;
  }

  // 2. Fallback calculations if RRP is missing
  const costPrice = product.promoPrice ?? product.price;

  if (product.recommendedMargin != null) {
    return Math.round(costPrice * (1 + product.recommendedMargin / 100));
  }

  return Math.round(product.price * 1.14 * 1.15);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(value)
}

export function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith("#x")) {
      const codePoint = Number.parseInt(entity.slice(2), 16)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match
    }

    if (entity.startsWith("#")) {
      const codePoint = Number.parseInt(entity.slice(1), 10)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match
    }

    return htmlNamedEntities[entity.toLowerCase()] ?? match
  })
}
