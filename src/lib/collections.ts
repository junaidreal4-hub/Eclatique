import {
  getAllProducts,
  getNewArrivals,
  getProductsByCategory,
  getProductsBySubCategory,
  getSaleProducts,
} from "./products";
import { CATEGORIES, SUBCATEGORIES } from "./taxonomy";
import type { Category, Product, SubCategory } from "./types";

export interface CollectionDef {
  handle: string;
  title: string;
  subtitle: string;
  resolve: () => Promise<Product[]>;
}

export function getCollection(handle: string): CollectionDef | undefined {
  if (handle === "all")
    return {
      handle,
      title: "View All",
      subtitle: "Every piece, one place. The full Eclatique range.",
      resolve: () => getAllProducts(),
    };
  if (handle === "new")
    return {
      handle,
      title: "New Arrivals",
      subtitle: "The newest drop of the season.",
      resolve: () => getNewArrivals(100),
    };
  if (handle === "sale")
    return {
      handle,
      title: "Sale",
      subtitle: "Marked-down, not marked-off.",
      resolve: () => getSaleProducts(),
    };

  // Whole category, e.g. "men" / "women"
  const cat = CATEGORIES.find((c) => c.slug === handle);
  if (cat)
    return {
      handle,
      title: cat.label,
      subtitle: `The ${cat.label}'s collection.`,
      resolve: () => getProductsByCategory(cat.slug),
    };

  // Category + sub-category, e.g. "men-shirt" / "women-jackets"
  const [c, s] = handle.split("-");
  const catMatch = CATEGORIES.find((x) => x.slug === c);
  const subMatch = SUBCATEGORIES.find((x) => x.slug === s);
  if (catMatch && subMatch)
    return {
      handle,
      title: `${catMatch.label}'s ${subMatch.label}`,
      subtitle: `${subMatch.label} from the ${catMatch.label.toLowerCase()}'s collection.`,
      resolve: () =>
        getProductsBySubCategory(catMatch.slug as Category, subMatch.slug as SubCategory),
    };

  return undefined;
}

export function getAllCollectionHandles(): string[] {
  const base = ["all", "new", "sale", ...CATEGORIES.map((c) => c.slug)];
  const combos = CATEGORIES.flatMap((c) =>
    SUBCATEGORIES.map((s) => `${c.slug}-${s.slug}`),
  );
  return [...base, ...combos];
}
