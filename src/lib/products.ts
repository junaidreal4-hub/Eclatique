import { prisma } from "./db";
import type { Category, Product, Size, SubCategory } from "./types";

/*
  Product data access. Backed by the Prisma/SQLite database. Read helpers return
  the app's `Product` shape; write helpers power the admin panel.
*/

type Row = {
  id: number;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  subCategory: string;
  images: string;
  sizes: string;
  stock: string;
  description: string;
  details: string;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toProduct(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    colorway: r.colorway,
    price: r.price,
    compareAtPrice: r.compareAtPrice ?? undefined,
    category: r.category as Category,
    subCategory: r.subCategory as SubCategory,
    images: safeParse<string[]>(r.images, []),
    sizes: safeParse<Size[]>(r.sizes, []),
    stock: safeParse<Partial<Record<Size, number>>>(r.stock, {}),
    description: r.description,
    details: r.details,
    isNew: r.isNew,
    createdAt: r.createdAt.toISOString().slice(0, 10),
  };
}

// ---- Reads -----------------------------------------------------------------

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const r = await prisma.product.findUnique({ where: { slug } });
  return r ? toProduct(r) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const r = await prisma.product.findUnique({ where: { id } });
  return r ? toProduct(r) : null;
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getProductsBySubCategory(
  category: Category,
  subCategory: SubCategory,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category, subCategory },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getSaleProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows
    .map(toProduct)
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProduct);
}

// ---- Writes (admin) --------------------------------------------------------

export interface ProductInput {
  name: string;
  colorway: string;
  price: number;
  compareAtPrice: number | null;
  category: Category;
  subCategory: SubCategory;
  images: string[];
  sizes: Size[];
  stock: Partial<Record<Size, number>>;
  description: string;
  details: string;
  isNew: boolean;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  const root = base || "product";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

function serialize(input: ProductInput) {
  return {
    name: input.name,
    colorway: input.colorway,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    category: input.category,
    subCategory: input.subCategory,
    images: JSON.stringify(input.images),
    sizes: JSON.stringify(input.sizes),
    stock: JSON.stringify(input.stock),
    description: input.description,
    details: input.details,
    isNew: input.isNew,
  };
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const slug = await uniqueSlug(slugify(input.name));
  const row = await prisma.product.create({
    data: { slug, ...serialize(input) },
  });
  return toProduct(row);
}

export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  const slug = await uniqueSlug(slugify(input.name), id);
  const row = await prisma.product.update({
    where: { id },
    data: { slug, ...serialize(input) },
  });
  return toProduct(row);
}

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function countProducts(): Promise<number> {
  return prisma.product.count();
}
