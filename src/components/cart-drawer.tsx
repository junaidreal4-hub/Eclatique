"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import { sizeLabel } from "@/lib/product-utils";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, updateQuantity, removeItem } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="label text-xs">Your Cart ({lines.length})</h2>
          <button type="button" onClick={closeCart} className="-mr-2 p-2" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-lg font-medium">Your cart is empty</p>
            <Link
              href="/collections/all"
              onClick={closeCart}
              className="label bg-accent px-8 py-3 text-[11px] text-paper"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Free-delivery note */}
            <div className="border-b border-line bg-subtle px-5 py-3">
              <p className="text-center text-xs font-medium text-ink">
                🎉 Your order ships free across India.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-5">
                {lines.map((line) => (
                  <li key={line.key} className="flex gap-4">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={closeCart}
                      className="relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-subtle"
                    >
                      <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium leading-tight">{line.name}</p>
                          <p className="mt-0.5 text-xs text-faint">
                            {line.colorway} · {sizeLabel(line.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.key)}
                          className="text-xs text-faint underline hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.key, line.quantity - 1)}
                            className="px-3 py-1 text-sm hover:bg-subtle"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.key, line.quantity + 1)}
                            className="px-3 py-1 text-sm hover:bg-subtle"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm">{formatPrice(line.price * line.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="label text-xs">Subtotal</span>
                <span className="text-base font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-faint">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="label block bg-accent py-4 text-center text-[11px] text-paper transition-opacity hover:opacity-90"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-xs text-muted underline hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
