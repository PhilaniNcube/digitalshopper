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
  promoStartsAt?: Date | string | null;
  promoEndsAt?: Date | string | null;
}): number {
  // 1. Check for active promotion first
  if (product.promoPrice != null && product.promoStartsAt && product.promoEndsAt) {
    const now = new Date();
    const start = new Date(product.promoStartsAt);
    const end = new Date(product.promoEndsAt);
    
    if (now >= start && now <= end) {
      // promoPrice is cost excluding VAT, so we add VAT (15%)
      const promoCostWithVat = product.promoPrice * 1.15;
      const marginMultiplier = product.recommendedMargin != null 
        ? 1 + product.recommendedMargin / 100 
        : 1.15; // default 15% margin if no recommended margin
        
      return Math.round(promoCostWithVat * marginMultiplier);
    }
  }

  // 2. Display RRP directly if available
  if (product.rrpIncl != null) {
    return product.rrpIncl;
  }

  // 3. Fallback calculations if RRP is missing
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
