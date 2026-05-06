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
 * - `promoPrice` is the **supplier's promotional buy price** (your cost), not a
 *   customer-facing price. When present it is used as the base cost instead of `price`.
 * - `recommendedMargin` is a whole-number percentage (e.g. 14.95 = 14.95%).
 * - The result is always capped at `rrpIncl` (recommended retail price) so we
 *   never charge the customer more than the market rate.
 *
 * Priority:
 * 1. Cost × (1 + margin%) capped at RRP  — when margin is known.
 *    Cost = promoPrice (supplier promo buy price) if available, else price.
 * 2. rrpIncl — when no margin is available, sell at RRP.
 * 3. Fallback — price × 1.14 (VAT) × 1.15 (15% default margin).
 */
export function getDisplayPrice(product: {
  price: number;
  rrpIncl?: number | null;
  promoPrice?: number | null;   // supplier promo buy/cost price
  recommendedMargin?: number | null; // percentage, e.g. 14.95 = 14.95%
}): number {
  // The base cost is the promo buy price when the supplier offers one,
  // otherwise fall back to the regular cost price.
  const costPrice = product.promoPrice ?? product.price;

  // 1. Apply recommended margin and cap at RRP
  if (product.recommendedMargin != null) {
    const markedUp = Math.round(costPrice * (1 + product.recommendedMargin / 100));
    if (product.rrpIncl != null) {
      return Math.min(markedUp, product.rrpIncl);
    }
    return markedUp;
  }

  // 2. No margin info — use RRP directly
  if (product.rrpIncl != null) {
    return product.rrpIncl;
  }

  // 3. Fallback: estimated VAT + 15% default margin on the regular cost price
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
