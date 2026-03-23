import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
})

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

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
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
