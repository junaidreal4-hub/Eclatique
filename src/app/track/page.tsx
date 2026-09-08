"use client";

import { useState } from "react";

interface TrackEvent {
  status: string;
  timestamp?: string;
  location?: string;
}
interface TrackResult {
  found: boolean;
  orderId?: string;
  placedAt?: string;
  awb?: string | null;
  shipped?: boolean;
  currentStatus?: string;
  events?: TrackEvent[];
}

function fmt(ts?: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrackPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const orderId = String(fd.get("orderId") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!orderId || !email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      const data = (await res.json()) as TrackResult;
      setResult(data);
      if (!data.found) {
        setError(
          "We couldn't find an order with those details. Double-check your Order ID and the email you used at checkout.",
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your Order ID and the email you used at checkout. Your Order ID is
        in your confirmation email.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Order ID</span>
          <input
            name="orderId"
            required
            placeholder="order_XXXXXXXXXXXX"
            className="w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink placeholder:text-faint"
          />
        </label>
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink placeholder:text-faint"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="label w-full bg-accent py-4 text-[11px] text-paper hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Track Order"}
        </button>
      </form>

      {error && (
        <p className="mt-6 border border-sale/30 bg-sale/5 p-4 text-sm text-sale">{error}</p>
      )}

      {result?.found && (
        <div className="mt-10 border border-line">
          <div className="flex items-center justify-between border-b border-line bg-subtle px-5 py-4">
            <div>
              <p className="label text-[10px] text-faint">Order</p>
              <p className="font-mono text-sm">{result.orderId}</p>
            </div>
            <span className="label bg-accent px-3 py-1 text-[10px] text-paper">
              {result.currentStatus}
            </span>
          </div>

          <div className="space-y-5 px-5 py-5">
            {result.placedAt && (
              <p className="text-xs text-faint">Placed {fmt(result.placedAt)}</p>
            )}
            {result.awb && (
              <p className="text-sm">
                <span className="text-muted">Tracking (AWB): </span>
                <span className="font-mono">{result.awb}</span>
              </p>
            )}

            {!result.shipped && (
              <p className="text-sm text-muted">
                Your order is confirmed and being prepared. You&apos;ll see live
                tracking here once it ships.
              </p>
            )}

            {result.events && result.events.length > 0 && (
              <ol className="relative space-y-5 border-l border-line pl-6">
                {result.events.map((ev, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-paper ${
                        i === result.events!.length - 1 ? "bg-accent" : "bg-line"
                      }`}
                    />
                    <p className="text-sm font-medium capitalize">
                      {ev.status.toLowerCase().replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-faint">
                      {[fmt(ev.timestamp), ev.location].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
