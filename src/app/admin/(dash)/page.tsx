import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";
import { isSoldOut } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";
import { OrderPill, ShipmentPill } from "@/components/admin/status-pill";

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([getAllProducts(), getAllOrders()]);

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((n, o) => n + o.amount, 0) / 100;
  const toShip = paid.filter((o) => !o.awbNumber).length;
  const lowStock = products.filter((p) => {
    const total = p.sizes.reduce((n, s) => n + (p.stock[s] ?? 0), 0);
    return !isSoldOut(p) && total <= 5;
  }).length;
  const recent = paid.slice(0, 5);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-1 text-[10px] text-faint">Overview</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="label bg-accent px-5 py-3 text-[11px] text-[#f3ece6] hover:bg-[#57392f]"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="label border border-ink px-5 py-3 text-[11px] hover:bg-ink hover:text-paper"
          >
            View Orders
          </Link>
        </div>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile feature k="Revenue" v={formatPrice(revenue)} sub={`${paid.length} paid orders`} />
        <Tile k="Paid Orders" v={String(paid.length)} sub={`${toShip} awaiting dispatch`} />
        <Tile k="Products" v={String(products.length)} sub={lowStock ? `${lowStock} low on stock` : "All well stocked"} />
        <Tile k="To Ship" v={String(toShip)} sub={toShip ? "Book pickups" : "All caught up"} />
      </div>

      <div className="border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[13px] font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="border-b border-line pb-px text-[11px] text-muted hover:border-ink hover:text-ink">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-subtle">
              <tr className="label text-[9.5px] text-faint">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Shipment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((o) => (
                <tr key={o.id} className="hover:bg-subtle">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs">{o.razorpayOrderId}</p>
                    <p className="mt-1 text-[11px] text-faint">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-[11.5px] text-muted">{o.city}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums">
                    {formatPrice(o.amount / 100)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderPill status={o.status} />
                  </td>
                  <td className="px-5 py-4">
                    {o.awbNumber ? <ShipmentPill status={o.shipmentStatus} /> : <span className="text-xs text-faint">—</span>}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    No paid orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Tile({
  k,
  v,
  sub,
  feature = false,
}: {
  k: string;
  v: string;
  sub: string;
  feature?: boolean;
}) {
  return (
    <div
      className={`rounded-[2px] border p-6 ${
        feature ? "border-accent bg-accent text-[#f3ece6]" : "border-line bg-paper"
      }`}
    >
      <p className={`label text-[10px] ${feature ? "text-[#c6b3a7]" : "text-faint"}`}>{k}</p>
      <p className="mt-2.5 text-4xl font-extrabold tracking-tight tabular-nums">{v}</p>
      <p className={`mt-2 text-[11px] ${feature ? "text-[#c6b3a7]" : "text-muted"}`}>{sub}</p>
    </div>
  );
}
