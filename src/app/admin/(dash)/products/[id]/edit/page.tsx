import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        &larr; Products
      </Link>
      <h1 className="mb-8 mt-3 text-3xl font-bold tracking-tight">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
