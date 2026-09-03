import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <div className="text-lg font-extrabold tracking-[0.3em] text-accent">ECLATIQUE</div>
        <p className="label mt-2 text-[11px] text-faint">Admin Panel</p>
      </div>
      <form action={loginAction} className="space-y-4">
        <div>
          <label className="label mb-2 block text-[10px] text-faint">Password</label>
          <input
            name="password"
            type="password"
            required
            autoFocus
            className="w-full border border-line bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </div>
        {error === "locked" ? (
          <p className="text-xs font-medium text-sale">
            Too many attempts. Please wait 15 minutes and try again.
          </p>
        ) : error ? (
          <p className="text-xs font-medium text-sale">Incorrect password. Try again.</p>
        ) : null}
        <button
          type="submit"
          className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
