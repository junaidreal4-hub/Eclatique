"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  "/hero/hero-look-1.jpeg",
  "/hero/hero-look-2.jpeg",
  "/hero/hero-look-3.jpeg",
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
      {SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Eclatique collection"
          fill
          priority={i === 0}
          quality={90}
          sizes="100vw"
          className={`object-cover object-[50%_38%] transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((src, i) => (
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
