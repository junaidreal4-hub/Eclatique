import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { searchProducts } from "@/lib/products";
import { collapseVariants } from "@/lib/product-utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? collapseVariants(await searchProducts(query)) : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <p className="label text-[10px] text-faint">Search</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search products"}
      </h1>

      {/* Search box (also lets you refine on the results page) */}
      <form action="/search" className="mt-6 flex max-w-md items-center gap-2 border-b border-ink pb-2">
        <SearchIcon />
        <input
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Search for shirts, tops, charms…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
        />
        <button type="submit" className="label text-[11px] text-muted hover:text-ink">
          Go
        </button>
      </form>

      {query && (
        <p className="mt-6 text-sm text-muted">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      )}

      <div className="mt-6">
        {query && results.length === 0 ? (
          <div className="border border-line bg-subtle px-6 py-16 text-center">
            <p className="text-sm text-muted">
              No products match &ldquo;{query}&rdquo;.
            </p>
            <Link
              href="/collections/all"
              className="label mt-5 inline-block bg-accent px-6 py-3 text-[11px] text-paper hover:opacity-90"
            >
              Browse All
            </Link>
          </div>
        ) : (
          results.length > 0 && <ProductGrid products={results} />
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="flex-none text-muted"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
