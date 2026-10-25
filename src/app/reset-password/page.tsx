import type { Metadata } from "next";
import Link from "next/link";
import { resetPasswordAction } from "@/app/account/actions";

export const metadata: Metadata = { title: "Reset Password" };

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink placeholder:text-faint";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (error === "expired" || !token) {
    return (
      <div className="mx-auto max-w-sm px-6 py-16 sm:py-20">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-6 border border-sale/30 bg-sale/5 p-4 text-sm text-sale">
          This reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="label mt-8 inline-block bg-accent px-6 py-3 text-[11px] text-paper">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>

      {error === "short" && (
        <p className="mt-6 border border-sale/30 bg-sale/5 p-3 text-xs font-medium text-sale">
          Password must be at least 8 characters.
        </p>
      )}

      <form action={resetPasswordAction} className="mt-8 space-y-5">
        <input type="hidden" name="token" value={token} />
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">New password</span>
          <input name="password" type="password" required minLength={8} className={inputCls} placeholder="At least 8 characters" />
        </label>
        <button
          type="submit"
          className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
