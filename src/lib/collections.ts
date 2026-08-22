import {
  getAllProducts,
  getNewArrivals,
  getProductsByCategory,
  getProductsByType,
  getSaleProducts,
} from "./products";
import type { Product } from "./types";

export interface CollectionDef {
  handle: string;
  title: string;
  subtitle: string;
  resolve: () => Promise<Product[]>;
}

const collections: CollectionDef[] = [
  {
    handle: "all",
    title: "View All",
    subtitle: "Every piece, one place. The full Eclatique range.",
    resolve: () => getAllProducts(),
  },
  {
    handle: "new",
    title: "New Arrivals",
    subtitle: "The newest drop of the season.",
    resolve: () => getNewArrivals(50),
  },
  {
    handle: "men",
    title: "Men",
    subtitle: "Elevated essentials, cut clean.",
    resolve: () => getProductsByCategory("men"),
  },
  {
    handle: "women",
    title: "Women",
    subtitle: "Modern silhouettes for the bold.",
    resolve: () => getProductsByCategory("women"),
  },
  {
    handle: "shirts",
    title: "Shirts",
    subtitle: "Full-zip silhouettes, cut clean.",
    resolve: () => getProductsByType("shirts"),
  },
  {
    handle: "tops",
    title: "Tops",
    subtitle: "Lace-up backs and easy elegance.",
    resolve: () => getProductsByType("tops"),
  },
  {
    handle: "sale",
    title: "Sale",
    subtitle: "Marked-down, not marked-off.",
    resolve: () => getSaleProducts(),
  },
];

/** Primary top-nav, mirroring the reference site's flat type-based menu. */
export const NAV_HANDLES = ["all", "men", "women", "new", "sale"] as const;

export function getCollection(handle: string): CollectionDef | undefined {
  return collections.find((c) => c.handle === handle);
}

export function getNavCollections(): CollectionDef[] {
  return NAV_HANDLES.map((h) => getCollection(h)!).filter(Boolean);
}

export function getAllCollectionHandles(): string[] {
  return collections.map((c) => c.handle);
}
