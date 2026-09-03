"use client";

import { useState } from "react";
import { ALL_SIZES } from "@/lib/taxonomy";
import { ONE_SIZE } from "@/lib/product-utils";
import type { Product } from "@/lib/types";

const labelCls = "label mb-2 block text-[10px] text-faint";
const cellCls =
  "w-full border border-line bg-transparent px-2 py-2 text-center text-sm outline-none focus:border-ink";

export function SizeStockFields({ product }: { product?: Product }) {
  const initialOneSize =
    product?.sizes.length === 1 && product.sizes[0] === ONE_SIZE;
  const [oneSize, setOneSize] = useState(initialOneSize);

  const osStock = initialOneSize ? (product?.stock[ONE_SIZE] ?? 0) : "";

  return (
    <section>
      <label className={labelCls}>Sizes &amp; Stock</label>

      <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="oneSize"
          checked={oneSize}
          onChange={(e) => setOneSize(e.target.checked)}
        />
        No sizes — sold as one size (accessories, caps, etc.)
      </label>

      {oneSize ? (
        <div className="max-w-[12rem]">
          <label className="mb-1 block text-xs font-medium">Stock quantity</label>
          <input
            name="os_stock"
            type="number"
            min="0"
            defaultValue={osStock === "" ? 0 : osStock}
            className={cellCls}
          />
          <p className="mt-2 text-xs text-faint">
            Total units available. 0 = sold out.
          </p>
        </div>
      ) : (
        <>
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
                    className={cellCls}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
