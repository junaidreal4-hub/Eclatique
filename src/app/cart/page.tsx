"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/shipping";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem, ready } = useCart();
  const shipping = shippingFor(subtotal);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">Your Cart</h1>

      {ready && lines.length === 0 ? (
        <div className="border border-line py-24 text-center">
          <p className="text-lg font-medium">Your cart is empty</p>
          <Link
            href="/collections/all"
            className="label mt-6 inline-block bg-accent px-8 py-3 text-[11px] text-paper"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-5 py-6">
                <Link
                  href={`/products/${line.slug}`}
                  className="relative aspect-[3/4] w-24 flex-shrink-0 overflow-hidden bg-subtle"
                >
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium">{line.name}</p>
                      <p className="mt-1 text-xs text-faint">
                        {line.colorway} · {line.size === "OS" ? "One Size" : `Size ${line.size}`}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(line.price * line.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.key, line.quantity - 1)}
                        className="px-3 py-1 hover:bg-subtle"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-10 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.key, line.quantity + 1)}
                        className="px-3 py-1 hover:bg-subtle"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.key)}
                      className="text-xs text-faint underline hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-line p-6 lg:sticky lg:top-24">
            <h2 className="label mb-6 text-xs">Order Summary</h2>
            <div className="flex justify-between border-b border-line pb-4 text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between pt-4 text-sm">
              <span className="text-muted">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="mt-1 text-xs text-faint">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery.
              </p>
            )}
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{formatPrice(subtotal + shipping)}</span>
            </div>
            <Link
              href="/checkout"
              className="label mt-6 block bg-accent py-4 text-center text-[11px] text-paper transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
