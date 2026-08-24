"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export default function CheckoutPage() {
  const { lines, subtotal, ready } = useCart();
  const [notice, setNotice] = useState<string | null>(null);

  const shipping = 0; // free delivery across India
  const total = subtotal + shipping;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Razorpay order creation + verification is the next build phase.
    setNotice(
      "Details captured. Razorpay payment is wired in the next phase. No charge has been made.",
    );
  }

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link href="/collections/all" className="label mt-6 inline-block bg-accent px-8 py-3 text-[11px] text-paper">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-3xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="label mb-5 border-b border-line pb-3 text-xs">Contact</h2>
            <Field label="Email" name="email" type="email" placeholder="you@example.com" />
          </section>

          <section>
            <h2 className="label mb-5 border-b border-line pb-3 text-xs">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-5">
              <Field label="First name" name="first_name" />
              <Field label="Last name" name="last_name" />
              <div className="col-span-2">
                <Field label="Phone" name="phone" type="tel" placeholder="9876543210" />
              </div>
              <div className="col-span-2">
                <Field label="Address" name="address" />
              </div>
              <Field label="City" name="city" />
              <Field label="Postal code" name="postal_code" />
            </div>
          </section>

          <section>
            <h2 className="label mb-5 border-b border-line pb-3 text-xs">Payment</h2>
            <div className="flex items-center gap-3 border border-line bg-subtle p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Razorpay Secure Payment</p>
                <p className="label text-[10px] text-faint">Cards · UPI · Netbanking</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line p-6 lg:sticky lg:top-24">
          <h2 className="label mb-6 text-xs">Order Summary</h2>
          <ul className="mb-6 max-h-72 space-y-4 overflow-y-auto">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3">
                <div className="relative aspect-[3/4] w-14 flex-shrink-0 overflow-hidden bg-subtle">
                  <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium leading-tight">{line.name}</p>
                  <p className="text-xs text-faint">{line.size} · Qty {line.quantity}</p>
                </div>
                <span className="text-sm">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-line pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {notice && (
            <p className="mt-4 border border-line bg-subtle p-3 text-xs text-muted">{notice}</p>
          )}
          <button type="submit" className="label mt-6 w-full bg-accent py-4 text-[11px] text-paper hover:opacity-90">
            Complete Payment
          </button>
          <p className="label mt-4 text-center text-[10px] text-faint">
            Secured with 256-bit SSL encryption
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[10px] text-faint">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink placeholder:text-faint"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
