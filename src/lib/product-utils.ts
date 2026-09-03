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

/** Human label for a size code ("OS" -> "One Size"). */
export function sizeLabel(size: Size): string {
  return size === ONE_SIZE ? "One Size" : size;
}
