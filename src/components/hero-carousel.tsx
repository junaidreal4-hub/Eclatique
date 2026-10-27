"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DESKTOP_HERO = "/hero/desktop_hero.webp";
const MOBILE_SLIDES = [
  "/hero/mobile_1.webp",
  "/hero/mobile_2.webp",
  "/hero/mobile_3.webp",
  "/hero/mobile_4.webp",
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % MOBILE_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Desktop: a single dedicated landscape hero */}
      <Image
        src={DESKTOP_HERO}
        alt="Eclatique — Drop 03, the Bottoms Collection"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />

      {/* Mobile: a 4-image carousel */}
      {MOBILE_SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Eclatique collection"
          fill
          priority={i === 0}
          quality={90}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ease-in-out md:hidden ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Slide indicators (mobile only) */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:hidden">
        {MOBILE_SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full bg-paper transition-all duration-300 ${
              i === index ? "w-6 opacity-100" : "w-1.5 opacity-60"
            }`}
          />
        ))}
      </div>
    </>
  );
}
