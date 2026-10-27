import type { Category, Size, SubCategory } from "./types";

export const SUBCATEGORIES: {
  slug: SubCategory;
  label: string;
  /** If set, this sub-category only appears for these categories. */
  categories?: Category[];
  /** Heading for the variant swatches on a product page (e.g. "Colour"). */
  variantLabel: string;
}[] = [
  { slug: "shirt", label: "Shirt", variantLabel: "Colour" },
  { slug: "tshirt", label: "T-Shirt", variantLabel: "Colour" },
  { slug: "tops", label: "Tops", categories: ["women"], variantLabel: "Colour" },
  { slug: "bottomwear", label: "Bottomwear", variantLabel: "Colour" },
  { slug: "jackets", label: "Jackets", variantLabel: "Colour" },
  { slug: "accessories", label: "Accessories", variantLabel: "Style" },
];

/** The variant-swatch heading suited to a sub-category ("Colour", "Style", …). */
export function variantLabelFor(subCategory: string): string {
  return SUBCATEGORIES.find((s) => s.slug === subCategory)?.variantLabel ?? "Options";
}

/** Sub-categories available for a given category (respects `categories` limits). */
export function subCategoriesFor(category: Category) {
  return SUBCATEGORIES.filter(
    (s) => !s.categories || s.categories.includes(category),
  );
}

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
];

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

/** Waist sizes, used for bottomwear. */
export const WAIST_SIZES = ["26", "28", "30", "32", "34", "36", "38", "40", "42"] as const;

/** Every size that can be entered via the admin form (for parsing submissions). */
export const SIZES_FOR_INPUT = [...ALL_SIZES, ...WAIST_SIZES] as const;

/** The size set offered for a given sub-category (waist sizes for bottomwear). */
export function sizesForSubCategory(subCategory: string): readonly Size[] {
  return subCategory === "bottomwear" ? WAIST_SIZES : ALL_SIZES;
}

export function subCategoryLabel(slug: string): string {
  return SUBCATEGORIES.find((s) => s.slug === slug)?.label ?? slug;
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
