import type { Category, SubCategory } from "./types";

export const SUBCATEGORIES: { slug: SubCategory; label: string }[] = [
  { slug: "shirt", label: "Shirt" },
  { slug: "tshirt", label: "T-Shirt" },
  { slug: "bottomwear", label: "Bottomwear" },
  { slug: "jackets", label: "Jackets" },
  { slug: "accessories", label: "Accessories" },
];

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
];

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

export function subCategoryLabel(slug: string): string {
  return SUBCATEGORIES.find((s) => s.slug === slug)?.label ?? slug;
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
