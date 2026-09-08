import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { isSoldOut, isOneSize } from "@/lib/product-utils";
import { categoryLabel, subCategoryLabel } from "@/lib/taxonomy";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-1 text-[10px] text-faint">Catalogue</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-1.5 text-[12.5px] text-muted">{products.length} in catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="label bg-accent px-5 py-3 text-[11px] text-[#f3ece6] hover:bg-[#57392f]"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-subtle">
            <tr className="label text-[9.5px] text-faint">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => {
              const totalStock = p.sizes.reduce((n, s) => n + (p.stock[s] ?? 0), 0);
              return (
                <tr key={p.id} className="align-middle hover:bg-subtle">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-14 w-11 flex-none items-center justify-center overflow-hidden rounded-[2px] bg-gradient-to-br from-[#efe7e2] to-[#e3d6cd] text-base font-bold text-accent">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill sizes="44px" className="object-cover" />
                        ) : (
                          <span>{p.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-faint">{p.colorway}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {categoryLabel(p.category)} · {subCategoryLabel(p.subCategory)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono tabular-nums">{formatPrice(p.price)}</span>
                    {p.compareAtPrice && (
                      <span className="ml-2 font-mono text-xs text-faint line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {isSoldOut(p) ? (
                      <span className="inline-flex items-center rounded-[2px] bg-[#f7e6e5] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-sale">
                        Sold Out
                      </span>
                    ) : (
                      <span className="text-muted">
                        {isOneSize(p) ? "One Size · " : ""}
                        {totalStock} units
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="border-b border-ink pb-px text-sm font-medium hover:border-accent hover:text-accent"
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
                <td colSpan={5} className="px-5 py-12 text-center text-muted">
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
