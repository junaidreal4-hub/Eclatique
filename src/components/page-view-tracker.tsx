"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fires a lightweight page-view beacon on each storefront navigation. */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname, referrer: document.referrer });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/pv", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/pv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, [pathname]);

  return null;
}
