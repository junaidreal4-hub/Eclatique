export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export type Category = "men" | "women";

export type ProductType =
  | "shirts"
  | "tops"
  | "tshirts"
  | "bottomwear"
  | "jackets"
  | "knits"
  | "accessories";

export interface Product {
  id: number;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  type: ProductType;
  images: string[];
  sizes: Size[];
  /** stock per size; a size missing or <= 0 renders as sold out */
  stock: Partial<Record<Size, number>>;
  description: string;
  details: string;
  isNew?: boolean;
  createdAt: string;
}

export interface CartLine {
  key: string; // productId + size
  productId: number;
  slug: string;
  name: string;
  colorway: string;
  size: Size;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
}
