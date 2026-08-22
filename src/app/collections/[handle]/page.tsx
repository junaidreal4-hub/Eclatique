import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import {
  getAllCollectionHandles,
  getCollection,
} from "@/lib/collections";

export function generateStaticParams() {
  return getAllCollectionHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) return { title: "Not Found" };
  return {
    title: collection.title,
    description: collection.subtitle,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const products = await collection.resolve();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {collection.title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          {collection.subtitle}
        </p>
      </header>
      <CollectionView products={products} />
    </div>
  );
}
