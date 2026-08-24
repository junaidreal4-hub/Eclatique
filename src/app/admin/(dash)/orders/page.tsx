import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

interface OrderLine {
  name: string;
  size: string;
  quantity: number;
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted">{orders.length} total</p>
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
            {orders.map((o) => {
              const items = JSON.parse(o.items || "[]") as OrderLine[];
              return (
                <tr key={o.id}>
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
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
