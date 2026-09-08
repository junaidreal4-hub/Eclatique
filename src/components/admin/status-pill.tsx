import { prettyStatus } from "@/lib/product-utils";

type Tone = "paid" | "pending" | "expired" | "ok" | "warn" | "info" | "danger";

const TONE: Record<Tone, string> = {
  paid: "bg-accent text-[#f3ece6]",
  pending: "border border-line text-muted",
  expired: "border border-line text-faint",
  ok: "bg-[#e7f0ea] text-[#2f6b4f]",
  warn: "bg-[#f6eede] text-[#8a5a12]",
  info: "bg-[#efe7e2] text-accent",
  danger: "bg-[#f7e6e5] text-sale",
};

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const withDot = tone !== "paid" && tone !== "pending" && tone !== "expired";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.09em] ${TONE[tone]}`}
    >
      {withDot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Colour-codes a shipment status by keyword. */
export function shipmentTone(status?: string | null): Tone {
  const s = (status ?? "").toLowerCase();
  if (
    s.includes("cancel") || s.includes("rto") || s.includes("return") ||
    s.includes("fail") || s.includes("not_pick") || s.includes("not pick")
  )
    return "danger";
  if (s.includes("deliver") && !s.includes("out")) return "ok";
  if (
    s.includes("transit") || s.includes("out_for") || s.includes("out for") ||
    s.includes("pick") || s.includes("shipp")
  )
    return "warn";
  return "info";
}

export function ShipmentPill({ status }: { status?: string | null }) {
  return <Pill tone={shipmentTone(status)}>{prettyStatus(status)}</Pill>;
}

export function OrderPill({ status }: { status: string }) {
  const tone: Tone = status === "paid" ? "paid" : status === "expired" ? "expired" : "pending";
  return <Pill tone={tone}>{status}</Pill>;
}
