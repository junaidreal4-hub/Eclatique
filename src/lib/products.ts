import type { Category, Product, ProductType } from "./types";

/*
  Product catalogue — real Eclatique products, pulled from eclatiqueclothing.in.

  This is the single source of truth for the storefront today. Every read goes
  through the async helpers below, so when the admin + database layer lands, only
  THIS file changes (swap the array for Prisma queries) — pages/components stay
  identical.
*/

const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "blue-striped-full-zip-shirt",
    name: "Blue Striped Full-Zip Shirt",
    colorway: "Blue Stripe",
    price: 899,
    compareAtPrice: 1099,
    category: "men",
    type: "shirts",
    images: [
      "/products/blue-zip-shirt-1.webp",
      "/products/blue-zip-shirt-2.webp",
      "/products/blue-zip-shirt-3.webp",
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    stock: { S: 0, M: 1, L: 0, XL: 5, XXL: 0, XXXL: 0 },
    description:
      "Redefine everyday dressing with this blue striped half-sleeve shirt, perfect for coastal vacations, summer brunches, creative office wear, and relaxed evenings. Crafted from a breathable cotton-poly blend, it delivers comfort with a clean, structured look. The modern full-zip front adds versatility, making it easy to style for both casual and elevated settings.\n\nStyling Suggestion: Pair with white or beige trousers and sneakers for a clean, Mediterranean-inspired look.",
    details:
      "Fit: Slim Fit · Model wears size M\nSleeve: Half Sleeve · Closure: Full Zip\nPattern: Striped\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: "2026-08-14",
  },
  {
    id: 2,
    slug: "butter-yellow-full-zip-shirt",
    name: "Butter Yellow Striped Full-Zip Shirt",
    colorway: "Butter Yellow",
    price: 899,
    compareAtPrice: 1099,
    category: "men",
    type: "shirts",
    images: [
      "/products/butter-zip-shirt-1.webp",
      "/products/butter-zip-shirt-2.webp",
      "/products/butter-zip-shirt-3.webp",
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    stock: { S: 1, M: 3, L: 3, XL: 0, XXL: 2, XXXL: 1 },
    description:
      "Fresh and refined, this butter yellow half-sleeve shirt is ideal for summer travel, daytime events, resort wear, and smart casual outings. Made from a lightweight cotton-poly blend, it offers breathable comfort with a modern silhouette. The full-zip design keeps the look sharp yet relaxed.\n\nStyling Suggestion: Style with neutral trousers and minimal sneakers or loafers.",
    details:
      "Fit: Slim Fit · Model wears size M\nSleeve: Half Sleeve · Closure: Full Zip\nColour: Butter Yellow\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: "2026-08-13",
  },
  {
    id: 3,
    slug: "blue-striped-lace-up-top",
    name: "Blue Striped Lace-Up Top",
    colorway: "Blue Stripe",
    price: 699,
    compareAtPrice: 899,
    category: "women",
    type: "tops",
    images: [
      "/products/blue-laceup-top-1.webp",
      "/products/blue-laceup-top-2.webp",
      "/products/blue-laceup-top-3.webp",
      "/products/blue-laceup-top-4.webp",
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 6, S: 1, M: 0, L: 5 },
    description:
      "Designed for brunch dates, casual evenings, vacation wear, and contemporary day looks, this blue striped top blends comfort with elegance. Crafted from a structured cotton-poly fabric, it features an adjustable lace-up back that enhances the silhouette while remaining easy to wear.\n\nStyling Suggestion: Pair with high-waist denim or skirts for an effortless, flattering look.",
    details:
      "Fit: Slim Fit · Model wears size S\nSleeve: Sleeveless · Closure: Lace-Up Back\nPattern: Striped\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: "2026-08-14",
  },
  {
    id: 4,
    slug: "butter-yellow-lace-up-top",
    name: "Butter Yellow Striped Lace-Up Top",
    colorway: "Butter Yellow",
    price: 699,
    compareAtPrice: 899,
    category: "women",
    type: "tops",
    images: [
      "/products/butter-laceup-top-1.webp",
      "/products/butter-laceup-top-2.webp",
      "/products/butter-laceup-top-3.webp",
      "/products/butter-laceup-top-4.webp",
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 0, S: 0, M: 0, L: 2 },
    description:
      "Soft and versatile, this butter yellow top is perfect for summer outings, vacations, daytime events, and soft evening looks. Made from a lightweight cotton-poly blend, it offers breathable comfort with a flattering shape, finished with an adjustable lace-up back.\n\nStyling Suggestion: Style with white or pastel bottoms and minimal accessories.",
    details:
      "Fit: Slim Fit · Model wears size S\nSleeve: Sleeveless · Closure: Lace-Up Back\nColour: Butter Yellow\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: "2026-08-13",
  },
];

// ---- Access layer (swap these bodies for DB calls later) --------------------

export async function getAllProducts(): Promise<Product[]> {
  return [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(
  category: Category,
): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === category);
}

export async function getProductsByType(type: ProductType): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.type === type);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.isNew).slice(0, limit);
}

export async function getSaleProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.price,
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return (await getAllProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function isSoldOut(product: Product): boolean {
  return !product.sizes.some((s) => (product.stock[s] ?? 0) > 0);
}
