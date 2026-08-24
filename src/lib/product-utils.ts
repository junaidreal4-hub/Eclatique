import type { Product } from "./types";

// Pure helpers safe to import from client components (no DB imports).
export function isSoldOut(product: Product): boolean {
  return !product.sizes.some((s) => (product.stock[s] ?? 0) > 0);
}
