"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <>
        <path d="M20 7l-8-4-8 4 8 4 8-4z" />
        <path d="M4 7v10l8 4 8-4V7" />
        <path d="M12 11v10" />
      </>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <>
        <path d="M6 2l1.5 3M18 2l-1.5 3" />
        <rect x="3" y="5" width="18" height="16" rx="1.5" />
        <path d="M3 10h18" />
      </>
    ),
  },
  {
    href: "/admin/reels",
    label: "Reels",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M10 9l5 3-5 3V9z" />
      </>
    ),
  },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
      {items.map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 whitespace-nowrap rounded-[3px] px-3 py-2.5 text-[13px] transition-colors ${
              active
                ? "bg-[#f3ece6] font-semibold text-accent"
                : "font-medium text-[#c6b3a7] hover:bg-[#57392f] hover:text-[#f3ece6]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 flex-none"
            >
              {it.icon}
            </svg>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
