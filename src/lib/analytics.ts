import "server-only";
import crypto from "node:crypto";
import { prisma } from "./db";

/*
  Lightweight, cookieless first-party analytics. A page-view beacon hits
  /api/pv on each navigation; we bucket the referrer into a source, hash the
  IP+UA per-day (no raw IP stored) for rough unique counting, and the admin
  Analytics page aggregates it. Country is added later (Step 2, via Cloudflare).
*/

const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|preview|monitor|curl|wget|python-requests|headless|lighthouse|pingdom|uptime/i;

export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
}

const SOURCE_MAP: Record<string, string> = {
  "instagram.com": "Instagram",
  "l.instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "m.facebook.com": "Facebook",
  "l.facebook.com": "Facebook",
  "google.com": "Google",
  "google.co.in": "Google",
  "bing.com": "Bing",
  "duckduckgo.com": "DuckDuckGo",
  "t.co": "Twitter/X",
  "twitter.com": "Twitter/X",
  "x.com": "Twitter/X",
  "youtube.com": "YouTube",
  "pinterest.com": "Pinterest",
  "wa.me": "WhatsApp",
  "whatsapp.com": "WhatsApp",
  "linktr.ee": "Linktree",
};

/** Buckets a referrer into a friendly traffic source. */
export function deriveSource(referrer: string, host: string | null): string {
  if (!referrer) return "Direct";
  try {
    const r = new URL(referrer);
    if (host && r.host === host) return "Direct"; // internal navigation
    const h = r.hostname.replace(/^www\./, "");
    return SOURCE_MAP[h] ?? h;
  } catch {
    return "Direct";
  }
}

/** Per-day, non-reversible visitor hash (no cookie, no stored IP). */
export function visitorHashFor(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.ADMIN_SESSION_SECRET ?? "eclatique";
  return crypto
    .createHash("sha256")
    .update(`${ip}|${ua}|${day}|${secret}`)
    .digest("hex")
    .slice(0, 32);
}

// IP -> state lookup via a free, no-key geo service, cached for the process
// lifetime so repeat visitors don't re-query. Fails soft (null) on any error.
const regionCache = new Map<string, { region: string | null; country: string | null }>();

function isPrivateIp(ip: string): boolean {
  return (
    !ip ||
    ip === "0.0.0.0" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("::1") ||
    ip.startsWith("172.16.")
  );
}

export async function lookupRegion(
  ip: string,
): Promise<{ region: string | null; country: string | null }> {
  if (isPrivateIp(ip)) return { region: null, country: null };
  const cached = regionCache.get(ip);
  if (cached) return cached;

  let result = { region: null as string | null, country: null as string | null };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const d = await res.json();
    if (d?.success) {
      result = {
        region: d.region ? String(d.region) : null,
        country: d.country_code ? String(d.country_code) : null,
      };
    }
  } catch {
    /* geo service unavailable — leave null */
  }
  if (regionCache.size < 10000) regionCache.set(ip, result);
  return result;
}

export async function recordPageView(data: {
  path: string;
  source: string;
  visitorHash: string;
  region?: string | null;
  country?: string | null;
}): Promise<void> {
  await prisma.pageView.create({
    data: {
      path: data.path.slice(0, 512),
      source: data.source.slice(0, 120),
      visitorHash: data.visitorHash,
      region: data.region ?? null,
      country: data.country ?? null,
    },
  });
}

export interface AnalyticsSummary {
  days: number;
  totalViews: number;
  uniqueVisitors: number;
  daily: { date: string; views: number }[];
  topPages: { path: string; views: number }[];
  topSources: { source: string; views: number }[];
  topStates: { state: string; views: number }[];
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const gte = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalViews, uniqRows, dailyRows, pages, sources, states] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte } } }),
    prisma.$queryRaw<{ count: number }[]>`
      SELECT count(DISTINCT "visitorHash")::int AS count
      FROM "PageView" WHERE "createdAt" >= ${gte}`,
    prisma.$queryRaw<{ date: Date; views: number }[]>`
      SELECT date_trunc('day', "createdAt") AS date, count(*)::int AS views
      FROM "PageView" WHERE "createdAt" >= ${gte}
      GROUP BY 1 ORDER BY 1`,
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["source"],
      where: { createdAt: { gte } },
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
      take: 8,
    }),
    prisma.pageView.groupBy({
      by: ["region"],
      where: { createdAt: { gte }, region: { not: null } },
      _count: { region: true },
      orderBy: { _count: { region: "desc" } },
      take: 10,
    }),
  ]);

  // Fill missing days with 0 so the chart is continuous.
  const byDay = new Map(
    dailyRows.map((r) => [new Date(r.date).toISOString().slice(0, 10), r.views]),
  );
  const daily: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    daily.push({ date: d, views: byDay.get(d) ?? 0 });
  }

  return {
    days,
    totalViews,
    uniqueVisitors: uniqRows[0]?.count ?? 0,
    daily,
    topPages: pages.map((p) => ({ path: p.path, views: p._count.path })),
    topSources: sources.map((s) => ({ source: s.source, views: s._count.source })),
    topStates: states.map((s) => ({ state: s.region ?? "Unknown", views: s._count.region })),
  };
}
