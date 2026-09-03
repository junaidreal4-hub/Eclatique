// "OS" = One Size, used for accessories and other items sold without sizing.
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "OS";

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
