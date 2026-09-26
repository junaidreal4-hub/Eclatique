import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analytics";

const RANGES = [7, 30, 90] as const;

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const days = RANGES.includes(Number(range) as (typeof RANGES)[number])
    ? Number(range)
    : 30;

  const a = await getAnalyticsSummary(days);
  const maxDay = Math.max(1, ...a.daily.map((d) => d.views));
  const maxPage = Math.max(1, ...a.topPages.map((p) => p.views));
  const maxSource = Math.max(1, ...a.topSources.map((s) => s.views));
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-1 text-[10px] text-faint">Insights</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="mt-1.5 text-[12.5px] text-muted">Last {days} days · storefront only</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/analytics?range=${r}`}
              className={`rounded-[2px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                days === r
                  ? "border border-accent bg-accent text-[#f3ece6]"
                  : "border border-line bg-paper text-muted hover:text-ink"
              }`}
            >
              {r}d
            </Link>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-[2px] border border-accent bg-accent p-6 text-[#f3ece6]">
          <p className="label text-[10px] text-[#c6b3a7]">Page Views</p>
          <p className="mt-2.5 text-4xl font-extrabold tracking-tight tabular-nums">
            {a.totalViews.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-[2px] border border-line bg-paper p-6">
          <p className="label text-[10px] text-faint">Visitors</p>
          <p className="mt-2.5 text-4xl font-extrabold tracking-tight tabular-nums">
            {a.uniqueVisitors.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-[11px] text-muted">unique per day</p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="mb-6 border border-line bg-paper p-5">
        <p className="label mb-4 text-[10px] text-faint">Page views per day</p>
        {a.totalViews === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            No visits recorded yet. Data appears here as people browse the store.
          </p>
        ) : (
          <>
            <div className="flex h-40 items-end gap-[3px]">
              {a.daily.map((d) => (
                <div
                  key={d.date}
                  title={`${fmtDate(d.date)}: ${d.views} views`}
                  className="flex-1 rounded-t-[1px] bg-accent/85 transition-colors hover:bg-accent"
                  style={{ height: `${Math.max(2, (d.views / maxDay) * 100)}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-faint">
              <span>{fmtDate(a.daily[0].date)}</span>
              <span>{fmtDate(a.daily[a.daily.length - 1].date)}</span>
            </div>
          </>
        )}
      </div>

      {/* Top pages + sources */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Top Pages">
          {a.topPages.length === 0 ? (
            <Empty />
          ) : (
            a.topPages.map((p) => (
              <Row key={p.path} label={p.path} value={p.views} pct={(p.views / maxPage) * 100} mono />
            ))
          )}
        </Panel>
        <Panel title="Traffic Sources">
          {a.topSources.length === 0 ? (
            <Empty />
          ) : (
            a.topSources.map((s) => (
              <Row key={s.source} label={s.source} value={s.views} pct={(s.views / maxSource) * 100} />
            ))
          )}
        </Panel>
      </div>

      <p className="mt-6 text-[11px] text-faint">
        Cookieless first-party analytics — no consent banner needed. Country
        breakdown is added once geo is enabled.
      </p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line bg-paper">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-[13px] font-bold">{title}</h2>
      </div>
      <div className="space-y-3 px-5 py-5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  pct,
  mono = false,
}: {
  label: string;
  value: number;
  pct: number;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className={`truncate text-[13px] ${mono ? "font-mono text-xs" : ""}`}>{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-subtle">
        <div className="h-full bg-accent/80" style={{ width: `${Math.max(3, pct)}%` }} />
      </div>
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-sm text-muted">Nothing yet.</p>;
}
