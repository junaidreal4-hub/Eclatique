// "OS" = One Size, used for accessories and other items sold without sizing.
// Numeric values are waist sizes, used for bottomwear.
export type Size =
  | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
  | "26" | "28" | "30" | "32" | "34" | "36" | "38" | "40" | "42"
  | "OS";

export type Category = "men" | "women";

export type SubCategory =
  | "shirt"
  | "tshirt"
  | "tops"
  | "bottomwear"
  | "jackets"
  | "accessories";

export interface Product {
  id: number;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  subCategory: SubCategory;
  variantGroup: string;
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
