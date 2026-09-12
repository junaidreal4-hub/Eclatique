import type { Category, SubCategory } from "./types";

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

export function subCategoryLabel(slug: string): string {
  return SUBCATEGORIES.find((s) => s.slug === slug)?.label ?? slug;
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
