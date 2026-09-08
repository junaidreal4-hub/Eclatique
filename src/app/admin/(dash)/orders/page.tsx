import Link from "next/link";
import { refreshShipmentStatusAction, retryShipmentAction } from "@/app/admin/actions";
import { expireStalePendingOrders, getAllOrders } from "@/lib/orders";
import { isConfigured as shipmentConfigured } from "@/lib/shipping-innofulfill";
import { OrderPill, ShipmentPill } from "@/components/admin/status-pill";
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
  const active: Filter = FILTERS.includes(status as Filter) ? (status as Filter) : "all";

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    expired: orders.filter((o) => o.status === "expired").length,
  };

  const visible = active === "all" ? orders : orders.filter((o) => o.status === active);
  const shippingOn = shipmentConfigured();

  return (
    <div>
      <div className="mb-5">
        <p className="label mb-1 text-[10px] text-faint">Fulfilment</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
        <p className="mt-1.5 text-[12.5px] text-muted">
          {counts.paid} paid · {counts.pending} pending · {counts.expired} expired
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/orders" : `/admin/orders?status=${f}`}
            className={`rounded-[2px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] capitalize transition-colors ${
              active === f
                ? "border border-accent bg-accent text-[#f3ece6]"
                : "border border-line bg-paper text-muted hover:text-ink"
            }`}
          >
            {f} ({counts[f]})
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-subtle">
            <tr className="label text-[9.5px] text-faint">
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 text-right font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Shipment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line align-top">
            {visible.map((o) => {
              const items = JSON.parse(o.items || "[]") as OrderLine[];
              return (
                <tr key={o.id} className={`hover:bg-subtle ${o.status !== "paid" ? "opacity-70" : ""}`}>
                  <td className="px-5 py-4">
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
                  <td className="px-5 py-4">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-[11.5px] text-faint">{o.email}</p>
                    <p className="text-[11.5px] text-faint">{o.phone}</p>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {o.address}, {o.city} {o.postalCode}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    {items.map((it, i) => (
                      <p key={i} className="leading-relaxed">
                        {it.name} <span className="text-faint">({it.size}) ×{it.quantity}</span>
                      </p>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums">
                    {formatPrice(o.amount / 100)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderPill status={o.status} />
                  </td>
                  <td className="px-5 py-4">
                    {shippingOn && o.status === "paid" ? (
                      o.awbNumber ? (
                        <div className="space-y-1.5">
                          <ShipmentPill status={o.shipmentStatus} />
                          <p className="font-mono text-[11px] text-ink">{o.awbNumber}</p>
                          <form action={refreshShipmentStatusAction}>
                            <input type="hidden" name="id" value={o.id} />
                            <button className="border-b border-line pb-px text-[10px] text-muted hover:border-ink hover:text-ink">
                              Refresh status
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {o.shipmentError && (
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-sale">
                              Booking failed
                            </p>
                          )}
                          <form action={retryShipmentAction}>
                            <input type="hidden" name="id" value={o.id} />
                            <button className="rounded-[2px] border border-line px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.09em] hover:bg-subtle">
                              {o.shipmentError ? "Retry booking" : "Book shipment"}
                            </button>
                          </form>
                        </div>
                      )
                    ) : (
                      <span className="text-xs text-faint">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">
                  {orders.length === 0 ? "No orders yet." : `No ${active} orders.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
