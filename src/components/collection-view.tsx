"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CollectionView({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "newest":
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
        <span className="text-sm text-muted">{products.length} products</span>
        <label className="flex items-center gap-2 text-sm">
          <span className="label text-[11px] text-faint">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="cursor-pointer bg-transparent py-1 text-sm outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <div className="py-24 text-center text-sm text-muted">
          No products here yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {sorted.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
