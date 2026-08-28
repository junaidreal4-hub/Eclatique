import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-subtle">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-extrabold tracking-[0.25em] text-accent">
              ECLATIQUE
            </Link>
            <nav className="hidden items-center gap-5 sm:flex">
              <Link href="/admin" className="label text-[11px] text-ink/70 hover:text-ink">
                Dashboard
              </Link>
              <Link href="/admin/products" className="label text-[11px] text-ink/70 hover:text-ink">
                Products
              </Link>
              <Link href="/admin/orders" className="label text-[11px] text-ink/70 hover:text-ink">
                Orders
              </Link>
              <Link href="/admin/reels" className="label text-[11px] text-ink/70 hover:text-ink">
                Reels
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="label text-[11px] text-ink/60 hover:text-ink"
            >
              View Store
            </Link>
            <form action={logoutAction}>
              <button className="label border border-line px-4 py-2 text-[11px] hover:bg-subtle">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
