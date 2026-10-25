"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Don't prompt on auth/checkout/account/admin routes.
const HIDE_PREFIXES = [
  "/login", "/register", "/account", "/checkout",
  "/forgot-password", "/reset-password", "/verify", "/admin",
];
const KEY = "eclatique_auth_prompt";
const SUPPRESS_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
const DELAY_MS = 2500;

export function AuthPrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    if (HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (last && Date.now() - last < SUPPRESS_MS) return;
    } catch {
      /* storage unavailable — carry on */
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    fetch("/api/account/me")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || d.loggedIn) return;
        setGoogleEnabled(!!d.googleEnabled);
        timer = setTimeout(() => {
          if (!cancelled) setOpen(true);
        }, DELAY_MS);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm border border-line bg-paper p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 text-2xl leading-none text-ink/50 transition-colors hover:text-ink"
        >
          &times;
        </button>

        <div className="label text-[11px] tracking-[0.3em] text-accent">ECLATIQUE</div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Join the club</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
          Create an account for faster checkout, saved addresses, order tracking,
          and easy returns.
        </p>

        <div className="mt-6 space-y-3">
          {googleEnabled && (
            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center gap-3 border border-line py-3 text-sm font-medium transition-colors hover:bg-subtle"
            >
              <GoogleG />
              Continue with Google
            </a>
          )}
          <Link
            href="/register"
            onClick={dismiss}
            className="label block w-full bg-accent py-3.5 text-[11px] text-paper transition-opacity hover:opacity-90"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            onClick={dismiss}
            className="label block w-full border border-ink py-3.5 text-[11px] transition-colors hover:bg-ink hover:text-paper"
          >
            Log In
          </Link>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-5 text-xs text-muted underline underline-offset-2 hover:text-ink"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
