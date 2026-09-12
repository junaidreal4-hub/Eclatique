import {
  getAllProducts,
  getNewArrivals,
  getProductsByCategory,
  getProductsBySubCategory,
  getSaleProducts,
} from "./products";
import { CATEGORIES, SUBCATEGORIES, subCategoriesFor } from "./taxonomy";
import { collapseVariants } from "./product-utils";
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
      resolve: async () => collapseVariants(await getAllProducts()),
    };
  if (handle === "new")
    return {
      handle,
      title: "New Arrivals",
      subtitle: "The newest drop of the season.",
      resolve: async () => collapseVariants(await getNewArrivals(200)),
    };
  if (handle === "sale")
    return {
      handle,
      title: "Sale",
      subtitle: "Marked-down, not marked-off.",
      resolve: async () => collapseVariants(await getSaleProducts()),
    };

  // Whole category, e.g. "men" / "women"
  const cat = CATEGORIES.find((c) => c.slug === handle);
  if (cat)
    return {
      handle,
      title: cat.label,
      subtitle: `The ${cat.label}'s collection.`,
      resolve: async () => collapseVariants(await getProductsByCategory(cat.slug)),
    };

  // Category + sub-category, e.g. "men-shirt" / "women-jackets"
  const [c, s] = handle.split("-");
  const catMatch = CATEGORIES.find((x) => x.slug === c);
  const subMatch = SUBCATEGORIES.find((x) => x.slug === s);
  const subAllowed =
    subMatch && (!subMatch.categories || subMatch.categories.includes(c as Category));
  if (catMatch && subMatch && subAllowed)
    return {
      handle,
      title: `${catMatch.label}'s ${subMatch.label}`,
      subtitle: `${subMatch.label} from the ${catMatch.label.toLowerCase()}'s collection.`,
      resolve: async () =>
        collapseVariants(
          await getProductsBySubCategory(catMatch.slug as Category, subMatch.slug as SubCategory),
        ),
    };

  return undefined;
}

export function getAllCollectionHandles(): string[] {
  const base = ["all", "new", "sale", ...CATEGORIES.map((c) => c.slug)];
  const combos = CATEGORIES.flatMap((c) =>
    subCategoriesFor(c.slug).map((s) => `${c.slug}-${s.slug}`),
  );
  return [...base, ...combos];
}
