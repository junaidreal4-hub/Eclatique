import { NextResponse } from "next/server";
import { getOrderByRazorpayId, setShipmentStatus } from "@/lib/orders";
import { trackShipment } from "@/lib/shipping-innofulfill";

// Customer order tracking. Requires order id + matching email, so one customer
// can't read another's order. Live status is fetched server-side (API key stays
// private); falls back to the stored status if live tracking is unavailable.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = String(body?.orderId ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!orderId || !email) {
      return NextResponse.json({ found: false }, { status: 400 });
    }

    const order = await getOrderByRazorpayId(orderId);
    // Generic "not found" for both wrong id and email mismatch — no info leak.
    if (!order || order.email.trim().toLowerCase() !== email || order.status !== "paid") {
      return NextResponse.json({ found: false });
    }

    const result = {
      found: true as const,
      orderId: order.razorpayOrderId,
      placedAt: order.createdAt,
      awb: order.awbNumber ?? null,
      shipped: Boolean(order.awbNumber),
      currentStatus: order.shipmentStatus ?? (order.awbNumber ? "Processing" : "Order confirmed"),
      events: [] as { status: string; timestamp?: string; location?: string }[],
    };

    if (order.awbNumber) {
      const track = await trackShipment(order.awbNumber);
      if (track.ok) {
        if (track.currentStatus) {
          result.currentStatus = track.currentStatus;
          // Keep the stored status (shown in admin) in sync with live tracking.
          if (track.currentStatus !== order.shipmentStatus) {
            await setShipmentStatus(order.id, track.currentStatus).catch(() => {});
          }
        }
        result.events = track.events;
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ found: false }, { status: 400 });
  }
}
