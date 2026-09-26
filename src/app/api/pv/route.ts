import { NextResponse } from "next/server";
import {
  deriveSource,
  isBot,
  recordPageView,
  visitorHashFor,
} from "@/lib/analytics";

// Page-view beacon. Records real storefront navigations (bots, admin, and API
// paths are ignored). Always returns ok so a tracking hiccup never surfaces.
export async function POST(req: Request) {
  try {
    const { path, referrer } = await req.json();
    if (!path || typeof path !== "string") return NextResponse.json({ ok: true });
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const ua = req.headers.get("user-agent") ?? "";
    if (isBot(ua)) return NextResponse.json({ ok: true });

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    await recordPageView({
      path,
      source: deriveSource(String(referrer ?? ""), req.headers.get("host")),
      visitorHash: visitorHashFor(ip, ua),
    });
  } catch {
    /* ignore malformed beacons */
  }
  return NextResponse.json({ ok: true });
}
