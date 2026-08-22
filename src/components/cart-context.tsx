"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product, Size } from "@/lib/types";

const STORAGE_KEY = "eclatique_cart_v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  compareSubtotal: number;
  isOpen: boolean;
  ready: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: Size, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setReady(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full / unavailable */
    }
  }, [lines, ready]);

  const addItem = useCallback(
    (product: Product, size: Size, quantity = 1) => {
      const key = `${product.id}-${size}`;
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) =>
            l.key === key ? { ...l, quantity: l.quantity + quantity } : l,
          );
        }
        const line: CartLine = {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          colorway: product.colorway,
          size,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0],
          quantity,
        };
        return [...prev, line];
      });
      setIsOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity } : l)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const compareSubtotal = lines.reduce(
      (n, l) => n + (l.compareAtPrice ?? l.price) * l.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotal,
      compareSubtotal,
      isOpen,
      ready,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clear,
    };
  }, [lines, isOpen, ready, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
