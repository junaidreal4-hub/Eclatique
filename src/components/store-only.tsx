"use client";

import { usePathname } from "next/navigation";

/** Renders storefront chrome only outside the /admin area. */
export function StoreOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
