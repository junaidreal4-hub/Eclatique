"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  "/hero/first_hero.webp",
  "/hero/second_hero.webp",
  "/hero/third_hero.webp",
  "/hero/fourth_hero.webp",
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
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Desktop: blurred fill so the full photo can sit uncropped on top */}
          <Image
            src={src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="hidden scale-110 object-cover blur-2xl brightness-75 md:block"
          />
          {/* Main photo — fills on mobile, shows the full frame on desktop */}
          <Image
            src={src}
            alt="Eclatique collection"
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className="object-cover object-[50%_35%] md:object-contain"
          />
        </div>
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
