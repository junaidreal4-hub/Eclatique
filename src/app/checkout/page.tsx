"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { shippingFor } from "@/lib/shipping";
import { useCart } from "@/components/cart-context";

type RazorpayInstance = { open: () => void; on: (event: string, cb: () => void) => void };
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { lines, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    const fd = new FormData(form);
    const details = {
      email: fd.get("email"),
      firstName: fd.get("first_name"),
      lastName: fd.get("last_name"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      city: fd.get("city"),
      postalCode: fd.get("postal_code"),
    };
    const items = lines.map((l) => ({
      productId: l.productId,
      size: l.size,
      quantity: l.quantity,
    }));

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...details }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start checkout.");
        setSubmitting(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        setError("Could not load the payment gateway. Check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "Eclatique",
        description: "Order Payment",
        prefill: {
          name: `${details.firstName ?? ""} ${details.lastName ?? ""}`.trim(),
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#3e2723" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const vr = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const vd = await vr.json();
            if (vd.status === "success") {
              clear();
              router.push(`/order-confirmed?order=${encodeURIComponent(vd.orderId)}`);
            } else {
              setError("Payment could not be verified. If you were charged, please contact us.");
              setSubmitting(false);
            }
          } catch {
            setError("Verification failed. If you were charged, please contact us.");
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      } as Record<string, unknown>);

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setSubmitting(false);
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
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
              <Field label="Last name" name="last_name" required={false} />
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
                  <p className="text-xs text-faint">{line.size === "OS" ? "One Size" : line.size} · Qty {line.quantity}</p>
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
          {error && (
            <p className="mt-4 border border-sale/30 bg-sale/5 p-3 text-xs font-medium text-sale">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="label mt-6 w-full bg-accent py-4 text-[11px] text-paper hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
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
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[10px] text-faint">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
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
