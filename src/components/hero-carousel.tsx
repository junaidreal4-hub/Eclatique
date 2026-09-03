"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { mobile: "/hero/hero-look-1.jpeg", desktop: "/hero/hero-look-1-desktop.jpeg" },
  { mobile: "/hero/hero-look-2.jpeg", desktop: "/hero/hero-look-2-desktop.jpeg" },
  { mobile: "/hero/hero-look-3.jpeg", desktop: "/hero/hero-look-3-desktop.jpeg" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.mobile}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Mobile / portrait crop */}
          <Image
            src={slide.mobile}
            alt="Eclatique collection"
            fill
            priority={i === 0}
            quality={90}
            sizes="(min-width: 768px) 0px, 100vw"
            className="object-cover object-[50%_38%] md:hidden"
          />
          {/* Desktop / landscape crop */}
          <Image
            src={slide.desktop}
            alt="Eclatique collection"
            fill
            priority={i === 0}
            quality={90}
            sizes="(min-width: 768px) 100vw, 0px"
            className="hidden object-cover object-center md:block"
          />
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.mobile}
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
