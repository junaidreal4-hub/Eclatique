import { updateReturnStatusAction } from "@/app/admin/actions";
import { getAllReturnRequests } from "@/lib/returns";

interface Item {
  name: string;
  size: string;
  quantity: number;
  exchangeSize?: string;
}

const STATUS_CLS: Record<string, string> = {
  requested: "border border-line text-muted",
  approved: "bg-[#f6eede] text-[#8a5a12]",
  completed: "bg-[#e7f0ea] text-[#2f6b4f]",
  rejected: "bg-[#f7e6e5] text-sale",
};

export default async function AdminReturnsPage() {
  const requests = await getAllReturnRequests();
  const open = requests.filter((r) => ["requested", "approved"].includes(r.status)).length;

  return (
    <div>
      <div className="mb-5">
        <p className="label mb-1 text-[10px] text-faint">Support</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Returns &amp; Exchanges</h1>
        <p className="mt-1.5 text-[12.5px] text-muted">{open} open · {requests.length} total</p>
      </div>

      {requests.length === 0 ? (
        <div className="border border-line bg-paper px-6 py-16 text-center text-sm text-muted">
          No requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const items = JSON.parse(r.items || "[]") as Item[];
            return (
              <div key={r.id} className="border border-line bg-paper p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span
                      className={`label inline-block rounded-[2px] px-2 py-1 text-[9.5px] ${
                        r.type === "EXCHANGE" ? "bg-accent text-[#f3ece6]" : "border border-ink text-ink"
                      }`}
                    >
                      {r.type}
                    </span>
                    <span className={`label ml-2 inline-block rounded-[2px] px-2 py-1 text-[9.5px] capitalize ${STATUS_CLS[r.status] ?? "border border-line text-muted"}`}>
                      {r.status}
                    </span>
                    <p className="mt-2 font-mono text-xs">{r.razorpayOrderId}</p>
                    <p className="text-[11px] text-faint">{r.email}</p>
                  </div>
                  <p className="text-[11px] text-faint">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>

                <ul className="mt-3 text-xs text-muted">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.name} ({it.size}) ×{it.quantity}
                      {it.exchangeSize ? ` → exchange to ${it.exchangeSize}` : ""}
                    </li>
                  ))}
                </ul>
                {r.reason && <p className="mt-2 text-xs"><span className="text-faint">Reason:</span> {r.reason}</p>}

                <form action={updateReturnStatusAction} className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    name="adminNote"
                    defaultValue={r.adminNote}
                    placeholder="Internal note (optional)"
                    className="min-w-[180px] flex-1 border border-line bg-transparent px-3 py-2 text-xs outline-none focus:border-ink"
                  />
                  <button name="status" value="approved" className="label border border-line px-3 py-2 text-[10px] hover:bg-subtle">Approve</button>
                  <button name="status" value="completed" className="label bg-accent px-3 py-2 text-[10px] text-paper hover:opacity-90">Complete</button>
                  <button name="status" value="rejected" className="label border border-sale px-3 py-2 text-[10px] text-sale hover:bg-sale/5">Reject</button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
