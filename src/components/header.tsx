"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_GROUPS, NAV_LEADING, NAV_TRAILING } from "@/lib/nav";
import { useCart } from "./cart-context";

export function Header() {
  const { count, openCart, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setExpanded(null);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          {/* Left: desktop nav / mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 p-2 md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_LEADING.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="label text-[11px] text-ink/70 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}

              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="group relative">
                  <Link
                    href={group.href}
                    className="label flex items-center gap-1 text-[11px] text-ink/70 transition-colors hover:text-ink"
                  >
                    {group.label}
                    <ChevronIcon />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[190px] border border-line bg-paper py-2 shadow-xl">
                      {group.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-ink/75 transition-colors hover:bg-subtle hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {NAV_TRAILING.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="label text-[11px] text-ink/70 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: wordmark */}
          <Link href="/" className="justify-self-center" aria-label="Eclatique home">
            <Image
              src="/brand/eclatique-logo.webp"
              alt="Eclatique"
              width={749}
              height={160}
              priority
              className="h-6 w-auto sm:h-8"
            />
          </Link>

          {/* Right: account + cart */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link
              href="/account"
              className="hidden p-2 text-ink/70 transition-colors hover:text-ink sm:block"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-ink/80 transition-colors hover:text-ink"
              aria-label="Open cart"
            >
              <BagIcon />
              {ready && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu — outside <header> so its backdrop-blur doesn't
          trap this fixed overlay inside the header box. */}
      <div
        className={`fixed inset-0 z-[70] md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col bg-paper shadow-xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-line px-5">
            <span className="label text-xs">Menu</span>
            <button type="button" onClick={closeMenu} className="-mr-2 p-2" aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-col overflow-y-auto px-5 py-2">
            {NAV_LEADING.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-line py-4 text-lg font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}

            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === group.label ? null : group.label)}
                  className="flex w-full items-center justify-between py-4 text-lg font-medium text-ink"
                  aria-expanded={expanded === group.label}
                >
                  {group.label}
                  <ChevronIcon className={expanded === group.label ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {expanded === group.label && (
                  <div className="flex flex-col pb-3 pl-3">
                    {group.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        className="py-2 text-base text-ink/70"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {NAV_TRAILING.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-line py-4 text-lg font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/account"
              onClick={closeMenu}
              className="py-4 text-lg font-medium text-ink/70"
            >
              Account
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-.8 12.5a1 1 0 0 1-1 .9H7.8a1 1 0 0 1-1-.9L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}
