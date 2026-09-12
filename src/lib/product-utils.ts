import type { Product, Size } from "./types";

export const ONE_SIZE: Size = "OS";

// Pure helpers safe to import from client components (no DB imports).
export function isSoldOut(product: Product): boolean {
  return !product.sizes.some((s) => (product.stock[s] ?? 0) > 0);
}

/** A product sold without sizing (single "One Size" entry) — e.g. accessories. */
export function isOneSize(product: Product): boolean {
  return product.sizes.length === 1 && product.sizes[0] === ONE_SIZE;
}

/**
 * Collapses variant groups to a single representative card for listings: the
 * first product of each non-empty variantGroup is kept (order-preserving),
 * others are dropped. Ungrouped products are all kept. Used on storefront
 * grids so the group shows once; the product page still lists every variant.
 */
export function collapseVariants<T extends { variantGroup: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const p of items) {
    if (p.variantGroup) {
      if (seen.has(p.variantGroup)) continue;
      seen.add(p.variantGroup);
    }
    out.push(p);
  }
  return out;
}

/** Human label for a size code ("OS" -> "One Size"). */
export function sizeLabel(size: Size): string {
  return size === ONE_SIZE ? "One Size" : size;
}

/** Pretty-print a shipment status ("OUT_FOR_DELIVERY" -> "Out For Delivery"). */
export function prettyStatus(s?: string | null): string {
  if (!s) return "Booked";
  return s
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
