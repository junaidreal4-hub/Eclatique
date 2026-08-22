import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>
      <p className="mt-3 text-sm text-muted">
        Customer accounts and order tracking arrive in the next phase. For any
        order queries, reach us at{" "}
        <a href="mailto:eclatiqueclothing@gmail.com" className="underline hover:text-ink">
          eclatiqueclothing@gmail.com
        </a>
        .
      </p>
      <Link
        href="/collections/all"
        className="label mt-8 inline-block bg-accent px-8 py-3 text-[11px] text-paper"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
