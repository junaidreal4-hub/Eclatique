import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { isSoldOut } from "@/lib/product-utils";
import { categoryLabel, subCategoryLabel } from "@/lib/taxonomy";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} in catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="label bg-accent px-6 py-3 text-[11px] text-paper hover:opacity-90"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-subtle">
            <tr className="label text-[10px] text-faint">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => {
              const totalStock = p.sizes.reduce((n, s) => n + (p.stock[s] ?? 0), 0);
              return (
                <tr key={p.id} className="align-middle">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden bg-subtle">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-faint">{p.colorway}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted">
                    {categoryLabel(p.category)} · {subCategoryLabel(p.subCategory)}
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{formatPrice(p.price)}</span>
                    {p.compareAtPrice && (
                      <span className="ml-2 text-xs text-faint line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {isSoldOut(p) ? (
                      <span className="label text-[10px] text-sale">Sold Out</span>
                    ) : (
                      <span className="text-muted">{totalStock} units</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-sm font-medium text-ink underline underline-offset-2 hover:text-accent"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="underline">
                    Add your first product
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
