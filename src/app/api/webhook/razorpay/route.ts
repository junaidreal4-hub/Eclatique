import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { fulfillOrder } from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";

// Backup fulfilment path. Configure the webhook + secret in the Razorpay
// dashboard to enable it; without RAZORPAY_WEBHOOK_SECRET it is a no-op.
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: true });

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const raw = await req.text();
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const data = JSON.parse(raw);
  if (data.event === "payment.captured" || data.event === "payment.authorized") {
    const entity = data.payload?.payment?.entity;
    const orderId = entity?.order_id;
    const paymentId = entity?.id;
    if (orderId) {
      const order = await fulfillOrder(orderId, paymentId);
      if (order) await sendOrderConfirmation(order);
    }
  }

  return NextResponse.json({ ok: true });
}
