import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import { CategorySelect } from "./category-select";
import { ProductImageUploader } from "./product-image-uploader";
import { SizeStockFields } from "./size-stock-fields";

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
        <CategorySelect
          defaultCategory={product?.category ?? "men"}
          defaultSubCategory={product?.subCategory ?? "shirt"}
        />
        <div>
          <label className={labelCls}>Variant Group (optional)</label>
          <input
            name="variantGroup"
            defaultValue={product?.variantGroup}
            className={inputCls}
            placeholder="e.g. linen-shirt"
          />
          <p className="mt-1 text-xs text-faint">
            Give the same value to products that are the same design in different colours —
            they&apos;ll link to each other as colour options on the product page. Leave blank
            if this design has no other colours.
          </p>
        </div>
      </section>

      <SizeStockFields product={product} />

      <section>
        <label className={labelCls}>Product Photos</label>
        <ProductImageUploader defaultImages={product?.images ?? []} />
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
