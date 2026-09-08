import "server-only";
import crypto from "node:crypto";
import { prisma } from "./db";
import type { OrderRow, OrderLine } from "./orders";

/*
  Innofulfill (delcaper) delivery integration.

  On a paid order we book an ECOMM forward shipment; the carrier assigns an AWB
  and auto-manifests. Everything is gated on INNOFULFILL_API_KEY — with no key
  the module is a no-op, so it never affects checkout until it's configured.
  Booking failures are stored on the order (shipmentError) and never thrown, so
  a delivery-API hiccup can't break payment confirmation.
*/

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}
function numEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const BASE_URL = env("INNOFULFILL_BASE_URL", "https://sandbox.apis.innofulfill.com");
const API_KEY = env("INNOFULFILL_API_KEY");
const CARRIER_NAME = env("INNOFULFILL_CARRIER_NAME", "innofulfill_ecomm");
const CARRIER_ID = env("INNOFULFILL_CARRIER_ID");
const WEBHOOK_SECRET = env("INNOFULFILL_WEBHOOK_SECRET");

export function isConfigured(): boolean {
  return Boolean(API_KEY);
}

function pickupAddress(type: "PICKUP" | "RETURN") {
  const lat = Number(process.env.PICKUP_LAT);
  const lng = Number(process.env.PICKUP_LNG);
  return {
    type,
    zip: env("PICKUP_ZIP"),
    name: env("PICKUP_NAME", "Eclatique Clothing"),
    phone: env("PICKUP_PHONE"),
    email: env("PICKUP_EMAIL"),
    street: env("PICKUP_STREET"),
    landmark: "",
    city: env("PICKUP_CITY"),
    state: env("PICKUP_STATE"),
    country: env("PICKUP_COUNTRY", "India"),
    ...(Number.isFinite(lat) ? { latitude: lat } : {}),
    ...(Number.isFinite(lng) ? { longitude: lng } : {}),
    addressName: env("PICKUP_ADDRESS_NAME") || env("PICKUP_STREET"),
    GSTNumber: env("PICKUP_GST"),
  };
}

function buildPayload(order: OrderRow) {
  const items = JSON.parse(order.items || "[]") as OrderLine[];
  const totalQty = items.reduce((n, i) => n + (i.quantity || 1), 0);

  const baseWeight = numEnv("PARCEL_WEIGHT_KG", 0.5);
  const perItem = numEnv("PARCEL_PER_ITEM_KG", 0.3);
  const weight = Math.max(baseWeight, Number((perItem * totalQty).toFixed(2)));
  const dimensions = {
    length: numEnv("PARCEL_LENGTH_CM", 30),
    width: numEnv("PARCEL_WIDTH_CM", 25),
    height: numEnv("PARCEL_HEIGHT_CM", 5),
  };
  const volumetricWeight = Number(
    ((dimensions.length * dimensions.width * dimensions.height) / 5000).toFixed(2),
  );

  const delivery = {
    type: "DELIVERY" as const,
    zip: order.postalCode,
    name: order.customerName,
    phone: order.phone,
    email: order.email,
    street: order.address,
    landmark: "",
    city: order.city,
    state: order.state,
    country: "India",
    addressName: order.address,
  };

  return {
    referenceId: order.razorpayOrderId,
    orderDate: new Date(order.createdAt).toISOString(),
    orderType: "FORWARD",
    orderStatus: "CONFIRMED",
    parcelCategory: "ECOMM",
    autoManifest: true,
    deliveryPromise: "ECOMM",
    deliveryMode: "SURFACE",
    taxes: [],
    discounts: [],
    metadata: { source: "eclatique-store" },
    documents: [],
    addresses: [
      pickupAddress("PICKUP"),
      delivery,
      { ...delivery, type: "BILLING" as const },
      pickupAddress("RETURN"),
    ],
    shipments: [
      {
        dimensions,
        shipmentStatus: "CONFIRMED",
        awbNumber: "",
        physicalWeight: weight,
        physicalWeightUnit: "KG",
        volumetricWeight,
        note: "",
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          sku: String(i.productId),
          hsnCode: "",
          description: "Clothing & Apparel",
        })),
      },
    ],
    carrierName: CARRIER_NAME,
    ...(CARRIER_ID ? { carrierId: CARRIER_ID } : {}),
    payment: { type: "PREPAID", currency: "INR", paymentMethod: "ONLINE" },
  };
}

// The exact response shape isn't fully documented; search defensively.
function deepFind(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k === key && typeof v === "string" && v.trim()) return v;
    if (v && typeof v === "object") {
      const found = deepFind(v, key);
      if (found) return found;
    }
  }
  return undefined;
}

export interface BookingResult {
  ok: boolean;
  awbNumber?: string;
  shipmentOrderId?: string;
  error?: string;
}

/** Books an Innofulfill shipment for a paid order. Never throws. Idempotent. */
export async function createShipmentForOrder(order: OrderRow): Promise<BookingResult> {
  if (!isConfigured()) return { ok: false, error: "not configured" };
  if (order.awbNumber) {
    return { ok: true, awbNumber: order.awbNumber, shipmentOrderId: order.shipmentOrderId ?? undefined };
  }

  try {
    const res = await fetch(`${BASE_URL}/gateway/booking-service/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": API_KEY },
      body: JSON.stringify(buildPayload(order)),
    });

    const text = await res.text();
    if (!res.ok) {
      const msg = `Innofulfill ${res.status}: ${text.slice(0, 300)}`;
      console.error("[innofulfill] booking failed", msg);
      await prisma.order.update({ where: { id: order.id }, data: { shipmentError: msg } });
      return { ok: false, error: msg };
    }

    let data: unknown = {};
    try {
      data = JSON.parse(text);
    } catch {
      /* non-JSON success body */
    }
    const awbNumber = deepFind(data, "awbNumber");
    const shipmentOrderId = deepFind(data, "orderId") ?? deepFind(data, "id");
    const shipmentStatus = deepFind(data, "orderStatus") ?? "PROCESSING";

    if (!awbNumber) {
      console.warn("[innofulfill] booked but no AWB in response:", text.slice(0, 500));
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shipmentOrderId: shipmentOrderId ?? null,
        awbNumber: awbNumber ?? null,
        shipmentStatus,
        shipmentError: null,
      },
    });
    return { ok: true, awbNumber, shipmentOrderId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown booking error";
    console.error("[innofulfill] booking exception", msg);
    await prisma.order
      .update({ where: { id: order.id }, data: { shipmentError: msg } })
      .catch(() => {});
    return { ok: false, error: msg };
  }
}

// ---- Tracking ------------------------------------------------------------

export interface TrackEvent {
  status: string;
  timestamp?: string;
  location?: string;
}
export interface TrackResult {
  ok: boolean;
  currentStatus?: string;
  events: TrackEvent[];
  error?: string;
}

// The tracking response nests the scan history under one of several keys.
function findStatusArray(root: unknown): Record<string, unknown>[] {
  const keys = [
    "statuses", "tracking", "trackingHistory", "history", "scans",
    "events", "checkpoints", "timeline",
  ];
  const queue: unknown[] = [root];
  while (queue.length) {
    const cur = queue.shift();
    if (!cur || typeof cur !== "object") continue;
    for (const [k, v] of Object.entries(cur as Record<string, unknown>)) {
      if (Array.isArray(v) && keys.includes(k) && v.length && typeof v[0] === "object") {
        return v as Record<string, unknown>[];
      }
      if (v && typeof v === "object") queue.push(v);
    }
  }
  return [];
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Fetches live tracking for an AWB. Never throws. */
export async function trackShipment(awb: string): Promise<TrackResult> {
  if (!isConfigured() || !awb) return { ok: false, events: [], error: "unavailable" };
  try {
    const res = await fetch(
      `${BASE_URL}/gateway/tracking-v2/api/tracking/awb/${encodeURIComponent(awb)}`,
      { headers: { "api-key": API_KEY, accept: "application/json" } },
    );
    const text = await res.text();
    if (!res.ok) return { ok: false, events: [], error: `Tracking ${res.status}` };

    let data: unknown = {};
    try {
      data = JSON.parse(text);
    } catch {
      /* non-JSON */
    }

    const rows = findStatusArray(data);
    const events: TrackEvent[] = rows
      .map((e) => ({
        status:
          str(e.status) ?? str(e.statusName) ?? str(e.state) ??
          str(e.eventCode) ?? str(e.description) ?? "",
        timestamp:
          str(e.timestamp) ?? str(e.time) ?? str(e.date) ??
          str(e.updatedAt) ?? str(e.createdAt),
        location: str(e.location) ?? str(e.city) ?? str(e.hub),
      }))
      .filter((e) => e.status);

    // Authoritative current status lives at orderInformation.currentShipmentPhase;
    // the statuses[] array is chronological, so its last entry is also current.
    const oi = (data as Record<string, unknown> | null)?.orderInformation as
      | Record<string, unknown>
      | undefined;
    const currentStatus =
      str(oi?.currentShipmentPhase) ??
      deepFind(data, "currentShipmentPhase") ??
      events[events.length - 1]?.status ??
      deepFind(data, "currentStatus") ??
      deepFind(data, "orderStatus");

    if (!events.length) {
      console.warn("[innofulfill] track: no events parsed:", text.slice(0, 500));
    }
    return { ok: true, currentStatus, events };
  } catch (err) {
    return { ok: false, events: [], error: err instanceof Error ? err.message : "track error" };
  }
}

/** Pulls live status and saves it to the order. Returns the status, or null. */
export async function syncShipmentStatus(order: OrderRow): Promise<string | null> {
  if (!order.awbNumber) return null;
  const track = await trackShipment(order.awbNumber);
  if (track.ok && track.currentStatus) {
    await prisma.order.update({
      where: { id: order.id },
      data: { shipmentStatus: track.currentStatus },
    });
    return track.currentStatus;
  }
  return null;
}

// ---- Webhook -------------------------------------------------------------

/** Verifies the X-Webhook-Signature (HMAC-SHA256 of the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function webhookConfigured(): boolean {
  return Boolean(WEBHOOK_SECRET);
}

/**
 * Updates an order's delivery status from a verified webhook payload. Webhook
 * events can arrive out of order, so rather than trust the event's own status
 * we re-pull the authoritative current status from the tracking API; only if
 * that's unavailable do we fall back to the event's status.
 */
export async function applyWebhookStatus(data: {
  awbNumber?: string;
  referenceId?: string;
  orderStatus?: string;
}): Promise<void> {
  const order = await prisma.order.findFirst({
    where: data.awbNumber
      ? { awbNumber: data.awbNumber }
      : data.referenceId
        ? { razorpayOrderId: data.referenceId }
        : { id: -1 },
  });
  if (!order) return;

  const live = await syncShipmentStatus(order);
  if (!live && data.orderStatus) {
    await prisma.order.update({
      where: { id: order.id },
      data: { shipmentStatus: data.orderStatus },
    });
  }
}
