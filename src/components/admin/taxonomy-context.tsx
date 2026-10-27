"use client";

import { createContext, useContext, useState } from "react";
import { subCategoriesFor } from "@/lib/taxonomy";
import type { Category, SubCategory } from "@/lib/types";

type TaxonomyCtx = {
  category: Category;
  subCategory: SubCategory;
  setCategory: (c: Category) => void;
  setSubCategory: (s: SubCategory) => void;
};

const Ctx = createContext<TaxonomyCtx | null>(null);

export function useTaxonomy() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useTaxonomy must be used within <TaxonomyProvider>");
  return value;
}

export function TaxonomyProvider({
  defaultCategory,
  defaultSubCategory,
  children,
}: {
  defaultCategory: Category;
  defaultSubCategory: SubCategory;
  children: React.ReactNode;
}) {
  const [category, setCategoryState] = useState<Category>(defaultCategory);
  const [subCategory, setSubCategory] = useState<SubCategory>(defaultSubCategory);

  function setCategory(next: Category) {
    setCategoryState(next);
    // If the current sub-category isn't valid for the new category, reset it.
    const nextSubs = subCategoriesFor(next);
    if (!nextSubs.some((s) => s.slug === subCategory)) {
      setSubCategory(nextSubs[0].slug);
    }
  }

  return (
    <Ctx.Provider value={{ category, subCategory, setCategory, setSubCategory }}>
      {children}
    </Ctx.Provider>
  );
}
