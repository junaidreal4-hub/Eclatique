"use client";

import { useEffect, useRef, useState } from "react";

export function ReelsGrid({ urls }: { urls: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {urls.map((src) => (
        <Reel key={src} src={src} />
      ))}
    </div>
  );
}

function Reel({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const showFrame = () => {
      try {
        v.currentTime = 0.05;
      } catch {
        /* ignore */
      }
    };
    v.addEventListener("loadeddata", showFrame, { once: true });

    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setCanHover(hoverCapable);
    if (hoverCapable) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function handleEnter() {
    if (canHover) void ref.current?.play().catch(() => {});
  }
  function handleLeave() {
    if (!canHover) return;
    const v = ref.current;
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0.05;
    } catch {
      /* ignore */
    }
  }

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) void v.play().catch(() => {});
    setMuted(v.muted);
  }

  return (
    <div
      className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-ink"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={ref}
        src={src}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {canHover && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/40 text-paper backdrop-blur">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/50 text-paper backdrop-blur transition-opacity hover:bg-ink/70"
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </div>
  );
}

function MutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="m17 9 4 6M21 9l-4 6" strokeLinecap="round" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" strokeLinecap="round" />
    </svg>
  );
}
