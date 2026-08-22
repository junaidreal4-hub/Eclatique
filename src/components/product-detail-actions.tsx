"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./cart-context";
import type { Product, Size } from "@/lib/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const selectedStock = size ? (product.stock[size] ?? 0) : 0;
  const guideImage =
    product.category === "women"
      ? "/brand/size-guide-women.webp"
      : "/brand/size-guide-men.webp";

  function handleAdd() {
    if (!size) {
      setError(true);
      return;
    }
    addItem(product, size);
  }

  return (
    <div>
      {/* Size selector */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="label text-[11px]">Size</span>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {product.sizes.map((s) => {
            const stock = product.stock[s] ?? 0;
            const soldOut = stock <= 0;
            const selected = size === s;
            return (
              <button
                key={s}
                type="button"
                disabled={soldOut}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                className={`relative border py-3 text-sm transition-colors ${
                  soldOut
                    ? "cursor-not-allowed border-dashed border-line text-faint"
                    : selected
                      ? "border-accent bg-accent text-paper"
                      : "border-line hover:border-ink"
                }`}
              >
                {s}
                {soldOut && (
                  <span className="absolute inset-x-0 -bottom-4 text-[9px] text-faint">
                    Sold out
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {size && selectedStock > 0 && selectedStock <= 5 && (
          <p className="mt-6 text-xs font-medium text-sale">
            Only {selectedStock} left in {size}.
          </p>
        )}
        {error && (
          <p className="mt-4 text-xs font-medium text-sale">
            Please select a size.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
      >
        Add to Cart
      </button>

      {/* Size guide modal */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-paper p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="absolute right-3 top-3 z-10 text-2xl leading-none text-ink/60 hover:text-ink"
              aria-label="Close size guide"
            >
              &times;
            </button>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={guideImage}
                alt={`${product.category} size guide`}
                fill
                sizes="512px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
