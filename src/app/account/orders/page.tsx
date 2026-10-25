import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";
import { getOrdersForUser } from "@/lib/orders";
import { prettyStatus } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

interface Line {
  name: string;
  size: string;
  quantity: number;
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await getOrdersForUser(user.id, user.email) : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link href="/account" className="label text-[11px] text-muted hover:text-ink">
        ← Account
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Order History</h1>

      {orders.length === 0 ? (
        <div className="mt-8 border border-line bg-subtle px-6 py-16 text-center">
          <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/collections/all" className="label mt-5 inline-block bg-accent px-6 py-3 text-[11px] text-paper">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => {
            const items = JSON.parse(o.items || "[]") as Line[];
            return (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="block border border-line bg-paper p-5 transition-colors hover:border-ink"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs">{o.razorpayOrderId}</p>
                    <p className="mt-1 text-[11px] text-faint">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums">{formatPrice(o.amount / 100)}</p>
                    {o.awbNumber && (
                      <p className="mt-1 text-[11px] text-muted">{prettyStatus(o.shipmentStatus)}</p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted">
                  {items.map((it) => `${it.name} (${it.size}) ×${it.quantity}`).join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
