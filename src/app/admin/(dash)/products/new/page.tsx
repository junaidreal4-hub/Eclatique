import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        &larr; Products
      </Link>
      <h1 className="mb-8 mt-3 text-3xl font-extrabold tracking-tight">Add Product</h1>
      <div className="max-w-2xl border border-line bg-paper p-6 sm:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
