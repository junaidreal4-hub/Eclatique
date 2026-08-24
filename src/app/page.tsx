import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductGrid } from "@/components/product-grid";
import { ReelsSection } from "@/components/reels-section";
import { getNewArrivals } from "@/lib/products";

// Rendered on demand (reads the DB at request time, not at build).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const newArrivals = await getNewArrivals(8);

  return (
    <>
      {/* Hero — full-screen carousel with CTAs overlaid directly on the image */}
      <section className="relative h-[calc(100svh-100px)] min-h-[560px] w-full overflow-hidden bg-subtle">
        <h1 className="sr-only">
          Eclatique. Choose the unordinary. Premium essentials for the modern silhouette.
        </h1>
        <HeroCarousel />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent pt-28 pb-8 sm:pb-14">
          <div className="pointer-events-auto mx-auto flex w-full max-w-sm items-stretch gap-3 px-6 sm:w-auto sm:max-w-none sm:justify-center">
            <Link
              href="/collections/new"
              className="label flex-1 whitespace-nowrap bg-accent px-4 py-3 text-center text-[10px] text-paper transition-opacity hover:opacity-90 sm:flex-none sm:px-8 sm:py-4 sm:text-[11px]"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/collections/all"
              className="label flex-1 whitespace-nowrap border border-paper px-4 py-3 text-center text-[10px] text-paper transition-colors hover:bg-paper hover:text-ink sm:flex-none sm:px-8 sm:py-4 sm:text-[11px]"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">New Arrivals</h2>
            <p className="mt-2 text-sm text-muted">Shop the newest drop of the season.</p>
          </div>
          <Link
            href="/collections/new"
            className="label hidden text-[11px] text-ink/70 underline-offset-4 hover:text-ink hover:underline sm:block"
          >
            View All
          </Link>
        </div>
        <ProductGrid products={newArrivals} priorityCount={4} />
      </section>

      {/* Category split */}
      <section className="mx-auto mt-16 grid max-w-[1400px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6">
        <CategoryTile
          href="/collections/men"
          image="/products/blue-zip-shirt-1.webp"
          eyebrow="Menswear"
          title="Shop Men"
        />
        <CategoryTile
          href="/collections/women"
          image="/products/blue-laceup-top-1.webp"
          eyebrow="Womenswear"
          title="Shop Women"
        />
      </section>

      {/* Reels — creator content */}
      <ReelsSection />
    </>
  );
}

function CategoryTile({
  href,
  image,
  eyebrow,
  title,
}: {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-subtle sm:aspect-[4/3]">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/30" />
      <div className="absolute bottom-0 left-0 p-8 text-paper">
        <p className="label text-[11px] text-paper/80">{eyebrow}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight">{title}</h3>
        <span className="label mt-3 inline-block border-b border-paper pb-1 text-[11px]">
          Shop Now
        </span>
      </div>
    </Link>
  );
}
