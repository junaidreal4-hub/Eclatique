import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Eclatique | Premium Minimalist Silhouettes & Style Guide",
  description:
    "Learn the story behind Eclatique Clothing. Explore our guide on premium minimalist silhouettes, oversized styling, and modern Indian luxury fashion.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-subtle to-paper" />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
          <Rule label="Our Story" centered />
          <h1
            className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-7xl"
            style={{ textShadow: "0 4px 22px rgba(122, 74, 50, 0.30)" }}
          >
            Choose the unordinary.
            <br />
            Choose Eclatique.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-xl font-light tracking-wide text-muted md:text-2xl">
            Avant-garde fashion for those who refuse to blend in.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="mx-auto max-w-[1400px] space-y-28 px-4 py-24 sm:px-6 lg:px-8">
        <FounderBlock
          image="/lifestyle/editorial-2.webp"
          alt="Varun, Founder of Eclatique Clothing"
          name="Varun"
          role="Founder"
          eyebrow="The Spark"
          heading="Breaking the Loop"
          paragraphs={[
            "“Why does everything look the same?” That simple question started it all. Fashion felt recycled, safe, and repetitive. I didn’t want to fit in; I wanted to stand out.",
            "Eclatique was born from a desire to create something raw and expressive. A label that doesn’t chase trends but sets them. We wanted to build a brand that whispers individuality in every stitch.",
          ]}
          quote="“Silence is the loudest sound.”"
          reverse={false}
        />
        <FounderBlock
          image="/lifestyle/editorial-1.webp"
          alt="Twinkle, Co-Founder of Eclatique Clothing"
          name="Twinkle"
          role="Co-Founder"
          eyebrow="The Synergy"
          heading="More Than Clothes"
          paragraphs={[
            "For me, Eclatique isn’t just a brand; it’s a feeling. Fashion is my language, but I felt trapped in a cycle of sameness. When Varun shared his vision, I knew we could be the change.",
            "We balance each other perfectly: his vision, my detailing. Every design has a purpose, to bring back the courage to be different. We are not here to follow the fashion world, but to rewrite it.",
          ]}
          quote="“Wear your truth.”"
          reverse={true}
        />
      </section>

      {/* Values */}
      <section className="border-y border-line bg-subtle py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <Rule label="What We Stand For" centered />
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Built on principle, not trend.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Value title="Transparency" text="No hidden costs, no hidden factories. We build openly.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </Value>
            <Value title="Sourcing" text="Sustainability through pieces meant to last.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </Value>
            <Value title="Designs" text="Made to be felt, not approved.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </Value>
          </div>
        </div>
      </section>

      {/* Aesthetic strip */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="group relative aspect-[9/16] w-full overflow-hidden bg-subtle">
            <Image
              src={`/about/gallery-${n}.webp`}
              alt={`Eclatique aesthetic view ${n}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </section>

      {/* Long-form guide */}
      <section className="py-24">
        <article className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Rule label="The Journal" centered />
            <h2 className="mt-6 text-3xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
              The Art of the Silhouette
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-faint">
              A Guide to Premium Minimalist Fashion in India
            </p>
          </div>

          <p className="mb-10 text-lg leading-relaxed text-muted first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.75] first-letter:text-accent">
            In a rapidly evolving fashion landscape, the noise of loud logos and
            fast-fashion trends is being replaced by a more profound movement:
            Minimalism. But in the context of Indian luxury, minimalism isn&apos;t
            about lack. It is about the perfect silhouette.
          </p>

          <Heading>What are Premium Minimalist Silhouettes?</Heading>
          <Para>
            When we discuss <strong>premium minimalist silhouettes in Indian
            fashion</strong>, we are referring to the structural architecture of a
            garment. Unlike traditional fast fashion that relies on busy prints to
            hide poor tailoring, minimalist fashion relies entirely on the
            &ldquo;cut.&rdquo; A silhouette is the outline or shape that a garment
            creates when worn on the body.
          </Para>
          <Para>
            At <strong>Eclatique Clothing</strong>, our rebellion against the
            ordinary starts here. We believe that a well-crafted linen shirt or an
            oversized jacket should hold its own shape, providing a sense of
            fearless confidence to the wearer. By focusing on modern silhouettes,
            we ensure that the clothing doesn&apos;t just hang on the body; it
            defines it.
          </Para>

          <Heading>Why Minimalist Fashion is the New Rebellion in India</Heading>
          <Para>
            India has long been known for its maximalism: vibrant colors and heavy
            embroidery. However, a new demographic of fashion enthusiasts in
            Mumbai, Delhi, and Bangalore is shifting toward &ldquo;Quiet
            Luxury.&rdquo; Choosing to be minimalist in a world that is constantly
            screaming for attention is a bold choice.
          </Para>
          <Para>
            This shift is driven by a desire for quality over quantity. Modern
            Indian men and women are looking for{" "}
            <Link href="/collections/all" className="font-semibold text-ink underline underline-offset-2">
              elevated essentials
            </Link>{" "}
            that can transition from a morning business meeting to an evening
            gallery opening. This versatility is the hallmark of a premium
            minimalist wardrobe.
          </Para>

          <Heading>How to Style Oversized Jackets in India</Heading>
          <Para>
            One of the most common questions in modern Indian styling is how to
            handle &ldquo;oversized&rdquo; structures without looking bulky. The
            secret lies in the balance of the silhouette.
          </Para>
          <ul className="mb-8 list-disc space-y-3 pl-6 text-muted marker:text-accent">
            <li>
              <strong>The Rule of Proportions:</strong> If you are wearing a wide,
              oversized jacket from our{" "}
              <Link href="/collections/men" className="font-semibold text-ink underline underline-offset-2">
                Men&apos;s Collection
              </Link>
              , pair it with structured, slim-fit trousers to create a visual
              anchor.
            </li>
            <li>
              <strong>Fabric Choice:</strong> In the Indian climate, the weight of
              the fabric matters. We use premium cotton and linen blends that let
              our oversized pieces breathe, preventing that heavy, suffocating
              feeling of traditional winter wear.
            </li>
            <li>
              <strong>Layering:</strong> Minimalist layering involves playing with
              different lengths. A cropped jacket over a long-line linen shirt
              creates multiple levels to your silhouette, adding depth without
              adding noise.
            </li>
          </ul>

          <Heading>The Role of Sustainability in Premium Fashion</Heading>
          <Para>
            You cannot have true minimalism without sustainability. Fast fashion is
            designed to be replaced; minimalist fashion is designed to be
            inherited. By using high-grade materials that survive hundreds of
            washes, Eclatique reduces the &ldquo;cost per wear.&rdquo; When you
            invest in a piece with a timeless silhouette, you are exiting the cycle
            of disposability.
          </Para>

          <h3 className="mb-4 mt-10 text-xl font-bold uppercase tracking-tight">
            Breathable Luxury: Linen and Cotton Essentials
          </h3>
          <Para>
            For the Indian climate, linen is the ultimate luxury. It is a fabric
            that gains character with time. Our collection focuses on
            high-thread-count linens that offer a crisp silhouette while remaining
            soft against the skin. Whether it is a formal shirt or a casual
            throw-over, the material choice is as important as the design itself.
          </Para>

          <Heading>Final Thoughts: Wearing Who You Are</Heading>
          <Para>
            Eclatique began with a shared feeling between two siblings: that
            fashion had lost its soul. Our journey into{" "}
            <strong>premium minimalist silhouettes</strong> is our way of bringing
            that soul back. True style isn&apos;t about following a trend; it is
            about finding pieces that feel personal, fearless, and real.
          </Para>

          <div className="mt-14 text-center">
            <Link
              href="/collections/all"
              className="label inline-block bg-accent px-10 py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
            >
              Explore the Collection
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

function FounderBlock({
  image,
  alt,
  name,
  role,
  eyebrow,
  heading,
  paragraphs,
  quote,
  reverse,
}: {
  image: string;
  alt: string;
  name: string;
  role: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  quote: string;
  reverse: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-subtle shadow-xl shadow-ink/5 md:aspect-[4/5] ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover"
        />
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <Rule label={eyebrow} />
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="mt-6 space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
        <figure className="mt-8 border-l-2 border-accent pl-5">
          <blockquote className="font-serif text-2xl italic text-ink">
            {quote}
          </blockquote>
          <figcaption className="label mt-3 text-[11px] text-faint">
            {name}, {role}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function Value({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group border border-line bg-paper p-10 text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/5">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-paper transition-transform duration-300 group-hover:scale-110">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {children}
        </svg>
      </div>
      <h3 className="label text-sm text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
        {text}
      </p>
    </div>
  );
}

function Rule({ label, centered = false }: { label: string; centered?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <span className="h-px w-8 bg-accent" />
      <span className="label text-[11px] text-faint">{label}</span>
      {centered && <span className="h-px w-8 bg-accent" />}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-12 text-2xl font-bold uppercase tracking-tight">
      {children}
    </h2>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 leading-relaxed text-muted">{children}</p>;
}
