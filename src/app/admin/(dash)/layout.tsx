import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="grid min-h-screen bg-[#f7f4f1] md:grid-cols-[236px_1fr]">
      <aside className="flex flex-col gap-4 bg-accent px-4 py-5 text-[#f3ece6] md:sticky md:top-0 md:h-screen md:gap-0 md:py-6">
        <div className="flex items-center justify-between md:block md:px-2.5 md:pb-6">
          <div>
            <p className="text-[15px] font-extrabold tracking-[0.28em]">ECLATIQUE</p>
            <p className="mt-1.5 hidden text-[9px] font-semibold uppercase tracking-[0.24em] text-[#c6b3a7] md:block">
              Admin
            </p>
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto flex shrink-0 gap-1 md:flex-col md:gap-0.5 md:border-t md:border-[#f3ece6]/15 md:pt-4">
          <Link
            href="/"
            target="_blank"
            className="whitespace-nowrap rounded-[3px] px-3 py-2.5 text-xs text-[#c6b3a7] transition-colors hover:bg-[#57392f] hover:text-[#f3ece6]"
          >
            ↗ View Store
          </Link>
          <form action={logoutAction}>
            <button className="w-full whitespace-nowrap rounded-[3px] px-3 py-2.5 text-left text-xs text-[#c6b3a7] transition-colors hover:bg-[#57392f] hover:text-[#f3ece6]">
              ⟲ Log Out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <main className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
