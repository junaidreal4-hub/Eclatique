import Link from "next/link";
import { expireStalePendingOrders, getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

interface OrderLine {
  name: string;
  size: string;
  quantity: number;
}

type Filter = "all" | "paid" | "pending" | "expired";
const FILTERS: Filter[] = ["all", "paid", "pending", "expired"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Clean up abandoned checkouts before listing.
  await expireStalePendingOrders();

  const orders = await getAllOrders();
  const { status } = await searchParams;
  const active: Filter = FILTERS.includes(status as Filter)
    ? (status as Filter)
    : "all";

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    expired: orders.filter((o) => o.status === "expired").length,
  };

  const visible =
    active === "all" ? orders : orders.filter((o) => o.status === active);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          {counts.paid} paid · {counts.pending} pending · {counts.expired} expired
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/orders" : `/admin/orders?status=${f}`}
            className={`label px-3 py-1.5 text-[10px] capitalize transition-colors ${
              active === f
                ? "bg-accent text-paper"
                : "border border-line text-muted hover:text-ink"
            }`}
          >
            {f} ({counts[f]})
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line bg-subtle">
            <tr className="label text-[10px] text-faint">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line align-top">
            {visible.map((o) => {
              const items = JSON.parse(o.items || "[]") as OrderLine[];
              return (
                <tr key={o.id} className={o.status !== "paid" ? "opacity-70" : ""}>
                  <td className="p-4">
                    <p className="font-mono text-xs">{o.razorpayOrderId}</p>
                    <p className="mt-1 text-[11px] text-faint">
                      {new Date(o.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-faint">{o.email}</p>
                    <p className="text-xs text-faint">{o.phone}</p>
                    <p className="mt-1 text-xs text-muted">
                      {o.address}, {o.city} {o.postalCode}
                    </p>
                  </td>
                  <td className="p-4 text-xs">
                    {items.map((it, i) => (
                      <p key={i} className="leading-relaxed">
                        {it.name}{" "}
                        <span className="text-faint">
                          ({it.size}) ×{it.quantity}
                        </span>
                      </p>
                    ))}
                  </td>
                  <td className="p-4 font-medium">{formatPrice(o.amount / 100)}</td>
                  <td className="p-4">
                    <span
                      className={`label inline-block px-2 py-1 text-[10px] ${
                        o.status === "paid"
                          ? "bg-accent text-paper"
                          : "border border-line text-muted"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted">
                  {orders.length === 0
                    ? "No orders yet."
                    : `No ${active} orders.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
