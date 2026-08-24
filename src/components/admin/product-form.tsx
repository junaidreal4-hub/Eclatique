import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions";
import { ALL_SIZES, CATEGORIES, SUBCATEGORIES } from "@/lib/taxonomy";
import type { Product } from "@/lib/types";

const labelCls = "label mb-2 block text-[10px] text-faint";
const inputCls =
  "w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-ink";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProductAction} className="max-w-2xl space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="space-y-5">
        <div>
          <label className={labelCls}>Product Name *</label>
          <input name="name" required defaultValue={product?.name} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Colour / Colourway</label>
            <input name="colorway" defaultValue={product?.colorway} className={inputCls} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? true} />
              Mark as New Arrival
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Price (Rs.) *</label>
            <input name="price" type="number" min="0" required defaultValue={product?.price} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Compare-at Price (optional)</label>
            <input
              name="compareAtPrice"
              type="number"
              min="0"
              defaultValue={product?.compareAtPrice ?? ""}
              className={inputCls}
              placeholder="Original price for a sale"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Category *</label>
            <select name="category" defaultValue={product?.category ?? "men"} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sub-category *</label>
            <select name="subCategory" defaultValue={product?.subCategory ?? "shirt"} className={inputCls}>
              {SUBCATEGORIES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <label className={labelCls}>Sizes &amp; Stock</label>
        <p className="mb-3 text-xs text-faint">
          Enter a quantity to offer a size (0 = shown but sold out). Leave blank to hide the size.
        </p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {ALL_SIZES.map((size) => {
            const offered = product?.sizes.includes(size);
            const value = offered ? (product?.stock[size] ?? 0) : "";
            return (
              <div key={size}>
                <label className="mb-1 block text-center text-xs font-medium">{size}</label>
                <input
                  name={`stock_${size}`}
                  type="number"
                  min="0"
                  defaultValue={value}
                  className="w-full border border-line bg-transparent px-2 py-2 text-center text-sm outline-none focus:border-ink"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <label className={labelCls}>Image URLs</label>
        <p className="mb-2 text-xs text-faint">
          One per line. Paste Cloudinary (or any) image URLs. The first is the main image.
        </p>
        <textarea
          name="images"
          rows={4}
          defaultValue={product?.images.join("\n")}
          className={`${inputCls} font-mono text-xs`}
          placeholder="https://res.cloudinary.com/.../image-1.jpg"
        />
      </section>

      <section className="space-y-5">
        <div>
          <label className={labelCls}>Description</label>
          <textarea name="description" rows={5} defaultValue={product?.description} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Details &amp; Care</label>
          <textarea name="details" rows={4} defaultValue={product?.details} className={inputCls} />
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          className="label bg-accent px-8 py-3 text-[11px] text-paper hover:opacity-90"
        >
          {product ? "Save Changes" : "Create Product"}
        </button>
        <Link href="/admin/products" className="label px-4 py-3 text-[11px] text-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
