import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getAllCollectionHandles } from "@/lib/collections";

export const dynamic = "force-dynamic";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://eclatiqueclothing.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/pages/about",
    "/pages/contact",
    "/pages/shipping-returns",
    "/pages/terms",
    "/pages/privacy",
  ];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.5,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = getAllCollectionHandles().map(
    (handle) => ({
      url: `${base}/collections/${handle}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // DB not reachable (e.g. at build) — ship the static + collection routes.
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
