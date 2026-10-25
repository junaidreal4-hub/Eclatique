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
        <Panel
          href="/account/orders"
          title="Order History"
          note="Track orders, and start a return or exchange."
        />
        <Panel
          href="/account/addresses"
          title="Saved Addresses"
          note="Add and manage your delivery addresses."
        />
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

function Panel({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <Link
      href={href}
      className="group block border border-line bg-paper p-6 transition-colors hover:border-ink"
    >
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="mt-1 text-xs text-muted">{note}</p>
      <span className="label mt-4 inline-block border-b border-line pb-px text-[10px] text-muted group-hover:border-ink group-hover:text-ink">
        Open →
      </span>
    </Link>
  );
}
