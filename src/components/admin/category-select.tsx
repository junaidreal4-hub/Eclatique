"use client";

import { useState } from "react";
import { CATEGORIES, subCategoriesFor } from "@/lib/taxonomy";
import type { Category, SubCategory } from "@/lib/types";

const labelCls = "label mb-2 block text-[10px] text-faint";
const inputCls =
  "w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-ink";

export function CategorySelect({
  defaultCategory = "men",
  defaultSubCategory = "shirt",
}: {
  defaultCategory?: Category;
  defaultSubCategory?: SubCategory;
}) {
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [subCategory, setSubCategory] = useState<SubCategory>(defaultSubCategory);

  const subs = subCategoriesFor(category);

  function onCategoryChange(next: Category) {
    setCategory(next);
    // If the current sub-category isn't valid for the new category, reset it.
    const nextSubs = subCategoriesFor(next);
    if (!nextSubs.some((s) => s.slug === subCategory)) {
      setSubCategory(nextSubs[0].slug);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>Category *</label>
        <select
          name="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as Category)}
          className={inputCls}
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Sub-category *</label>
        <select
          name="subCategory"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value as SubCategory)}
          className={inputCls}
        >
          {subs.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
