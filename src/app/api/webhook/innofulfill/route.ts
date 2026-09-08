import { NextResponse } from "next/server";
import {
  applyWebhookStatus,
  verifyWebhookSignature,
  webhookConfigured,
} from "@/lib/shipping-innofulfill";

// Receives Innofulfill shipment status events (delivered, in-transit, RTO, ...).
// Without INNOFULFILL_WEBHOOK_SECRET it is a no-op. Register this URL + secret
// in the Innofulfill portal (Settings -> API & Webhook).
export async function POST(req: Request) {
  if (!webhookConfigured()) return NextResponse.json({ ok: true });

  const raw = await req.text();
  const signature = req.headers.get("x-webhook-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    const body = JSON.parse(raw);
    const data = body?.data ?? {};
    await applyWebhookStatus({
      awbNumber: data.awbNumber,
      referenceId: data.referenceId,
      orderStatus: data.orderStatus,
    });
  } catch {
    /* malformed body — acknowledge so it isn't retried forever */
  }

  return NextResponse.json({ ok: true });
}
