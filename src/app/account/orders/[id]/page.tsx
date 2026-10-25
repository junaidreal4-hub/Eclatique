import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-user";
import { getOrderForUser } from "@/lib/orders";
import { getLatestRequestForOrder } from "@/lib/returns";
import { prettyStatus } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";
import { ReturnForm } from "@/components/account/return-form";

export const metadata: Metadata = { title: "Order" };
export const dynamic = "force-dynamic";

interface Line {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ return?: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;
  const order = user ? await getOrderForUser(Number(id), user.id, user.email) : null;
  if (!order) notFound();

  const { return: returnMsg } = await searchParams;
  const items = JSON.parse(order.items || "[]") as Line[];
  const request = await getLatestRequestForOrder(order.id);
  const hasOpenRequest = request && ["requested", "approved"].includes(request.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link href="/account/orders" className="label text-[11px] text-muted hover:text-ink">
        ← Orders
      </Link>
      <h1 className="mt-3 font-mono text-lg">{order.razorpayOrderId}</h1>
      <p className="mt-1 text-sm text-muted">
        Placed {new Date(order.createdAt).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
        })}
      </p>

      {/* Items */}
      <div className="mt-8 border border-line bg-paper">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between border-b border-line px-5 py-4 text-sm last:border-b-0">
            <span>
              {it.name} <span className="text-faint">({it.size}) ×{it.quantity}</span>
            </span>
            <span className="font-mono tabular-nums">{formatPrice(it.price * it.quantity)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-4 text-sm font-semibold">
          <span>Total paid</span>
          <span className="font-mono tabular-nums">{formatPrice(order.amount / 100)}</span>
        </div>
      </div>

      {/* Shipment + address */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-line bg-paper p-5 text-sm">
          <p className="label mb-2 text-[10px] text-faint">Delivery</p>
          {order.awbNumber ? (
            <>
              <p>{prettyStatus(order.shipmentStatus)}</p>
              <p className="mt-1 font-mono text-xs text-muted">AWB {order.awbNumber}</p>
              <Link href="/track" className="mt-2 inline-block text-xs underline hover:text-ink">
                Track
              </Link>
            </>
          ) : (
            <p className="text-muted">Processing</p>
          )}
        </div>
        <div className="border border-line bg-paper p-5 text-sm">
          <p className="label mb-2 text-[10px] text-faint">Shipping to</p>
          <p>{order.customerName}</p>
          <p className="mt-1 text-muted">
            {order.address}, {order.city}, {order.state} {order.postalCode}
          </p>
        </div>
      </div>

      {/* Returns / exchanges */}
      <div className="mt-8">
        <h2 className="text-sm font-bold">Returns &amp; Exchanges</h2>

        {returnMsg === "submitted" && (
          <p className="mt-3 border border-line bg-subtle p-3 text-xs text-ink">
            Your request has been submitted — we&apos;ll be in touch by email.
          </p>
        )}
        {returnMsg === "noitems" && (
          <p className="mt-3 border border-sale/30 bg-sale/5 p-3 text-xs text-sale">
            Select at least one item.
          </p>
        )}
        {returnMsg === "exists" && (
          <p className="mt-3 border border-sale/30 bg-sale/5 p-3 text-xs text-sale">
            There&apos;s already an open request for this order.
          </p>
        )}

        {hasOpenRequest ? (
          <div className="mt-4 border border-line bg-paper p-5 text-sm">
            <p className="font-medium capitalize">
              {request!.type.toLowerCase()} request — {request!.status}
            </p>
            <p className="mt-1 text-xs text-muted">
              Submitted {new Date(request!.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}. We&apos;ll email you with updates.
            </p>
          </div>
        ) : (
          <div className="mt-4 border border-line bg-paper p-5">
            <p className="mb-5 text-xs text-muted">
              Not happy with something? Request a return or exchange within 7 days of delivery.
            </p>
            <ReturnForm orderId={order.id} items={items} />
          </div>
        )}
      </div>
    </div>
  );
}
