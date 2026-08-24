import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        &larr; Products
      </Link>
      <h1 className="mb-8 mt-3 text-3xl font-bold tracking-tight">Add Product</h1>
      <ProductForm />
    </div>
  );
}
