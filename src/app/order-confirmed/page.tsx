import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-28 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-paper">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Order confirmed</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Thank you for shopping with Eclatique. Your payment was successful and we&apos;re
        preparing your order. A confirmation has been sent to your email.
      </p>
      {order && (
        <p className="label mt-4 text-[11px] text-faint">Order ID: {order}</p>
      )}
      <Link
        href="/collections/all"
        className="label mt-8 inline-block bg-accent px-8 py-4 text-[11px] text-paper hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
