import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";
import { logoutAction } from "./actions";

export const metadata: Metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-1 text-[10px] text-faint">My Account</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Hi{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{user?.email}</p>
        </div>
        <form action={logoutAction}>
          <button className="label border border-line px-4 py-2.5 text-[11px] text-muted hover:bg-subtle hover:text-ink">
            Log Out
          </button>
        </form>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Saved Addresses" note="Add and manage delivery addresses.">
          <span className="text-xs text-faint">Coming soon</span>
        </Panel>
        <Panel title="Order History" note="Track and review your orders.">
          <span className="text-xs text-faint">Coming soon</span>
        </Panel>
      </div>

      <Link
        href="/collections/all"
        className="label mt-10 inline-block bg-accent px-8 py-3 text-[11px] text-paper hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-paper p-6">
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="mt-1 text-xs text-muted">{note}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
