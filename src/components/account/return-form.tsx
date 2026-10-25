"use client";

import { useState } from "react";
import { requestReturnAction } from "@/app/account/actions";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];

interface Line {
  name: string;
  size: string;
  quantity: number;
}

export function ReturnForm({ orderId, items }: { orderId: number; items: Line[] }) {
  const [type, setType] = useState<"RETURN" | "EXCHANGE">("RETURN");

  return (
    <form action={requestReturnAction} className="space-y-5">
      <input type="hidden" name="orderId" value={orderId} />

      {/* Type */}
      <div className="flex gap-2">
        {(["RETURN", "EXCHANGE"] as const).map((t) => (
          <label
            key={t}
            className={`flex-1 cursor-pointer border px-4 py-3 text-center text-sm transition-colors ${
              type === t ? "border-ink bg-subtle font-medium" : "border-line text-muted"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={t}
              checked={type === t}
              onChange={() => setType(t)}
              className="sr-only"
            />
            {t === "RETURN" ? "Return" : "Exchange"}
          </label>
        ))}
      </div>

      <p className="border border-line bg-subtle p-3 text-xs text-muted">
        {type === "EXCHANGE"
          ? "Exchanges are free — we'll arrange a pickup and send the new size."
          : "For returns, you arrange and pay the return shipping. Your refund is issued once we receive the item."}
      </p>

      {/* Items */}
      <div className="space-y-3">
        <p className="label text-[10px] text-faint">Select item(s)</p>
        {items.map((it, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 border-b border-line pb-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name={`item_${i}`} />
              <span>
                {it.name} <span className="text-faint">({it.size}) ×{it.quantity}</span>
              </span>
            </label>
            {type === "EXCHANGE" && (
              <label className="flex items-center gap-2 text-xs text-muted">
                New size:
                <select
                  name={`exchangeSize_${i}`}
                  defaultValue={it.size}
                  className="border border-line bg-transparent px-2 py-1 text-sm outline-none focus:border-ink"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        ))}
      </div>

      <label className="block">
        <span className="label mb-2 block text-[10px] text-faint">Reason</span>
        <textarea
          name="reason"
          rows={3}
          required
          placeholder="Tell us what went wrong or why you'd like to exchange."
          className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="label w-full bg-accent py-4 text-[11px] text-paper hover:opacity-90"
      >
        Submit {type === "EXCHANGE" ? "Exchange" : "Return"} Request
      </button>
    </form>
  );
}
