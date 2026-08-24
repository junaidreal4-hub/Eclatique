import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductGrid } from "@/components/product-grid";
import { discountPercent, formatPrice } from "@/lib/format";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // No DB reachable at build time — pages render on demand instead.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.name} · ${product.colorway}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Eclatique" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.sizes.some((s) => (product.stock[s] ?? 0) > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${product.category}`} className="capitalize hover:text-ink">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={`${product.name} in ${product.colorway}`} />

        <div className="lg:py-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.colorway}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-base text-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount && (
              <span className="label bg-sale px-2 py-1 text-[10px] text-paper">
                {discount}% Off
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-faint">MRP inclusive of all taxes.</p>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductDetailActions product={product} />
          </div>

          <div className="mt-8 divide-y divide-line border-y border-line">
            <details className="group">
              <summary className="label flex cursor-pointer list-none items-center justify-between py-4 text-[11px]">
                Details &amp; Care
                <span className="text-lg font-light group-open:hidden">+</span>
                <span className="hidden text-lg font-light group-open:inline">−</span>
              </summary>
              <p className="whitespace-pre-line pb-5 text-sm leading-relaxed text-muted">
                {product.details}
              </p>
            </details>
            <details className="group">
              <summary className="label flex cursor-pointer list-none items-center justify-between py-4 text-[11px]">
                Shipping &amp; Returns
                <span className="text-lg font-light group-open:hidden">+</span>
                <span className="hidden text-lg font-light group-open:inline">−</span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-muted">
                Free shipping on orders over Rs. 1999. Ships within 1 to 2 business
                days. 7-day hassle-free returns on unworn items with tags.
              </p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 text-center text-xl font-bold tracking-tight">
            You May Also Like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
