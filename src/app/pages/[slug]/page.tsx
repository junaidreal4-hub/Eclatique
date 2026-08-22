import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENT_PAGES } from "@/lib/pages";

export function generateStaticParams() {
  return Object.keys(CONTENT_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = CONTENT_PAGES[slug];
  return { title: page?.title ?? "Not Found" };
}

export default async function ContentPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = CONTENT_PAGES[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
      {page.intro && (
        <p className="mt-5 text-base leading-relaxed text-muted">{page.intro}</p>
      )}
      <div className="mt-10 space-y-8">
        {page.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="label mb-3 text-xs text-ink">{section.heading}</h2>
            )}
            <div className="space-y-3">
              {section.body.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
