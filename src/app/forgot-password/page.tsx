import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/account/actions";

export const metadata: Metadata = { title: "Forgot Password" };

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink placeholder:text-faint";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>

      {sent ? (
        <>
          <p className="mt-6 border border-line bg-subtle p-4 text-sm text-ink">
            If an account exists for that email, we&apos;ve sent a password-reset
            link. Check your inbox (and spam).
          </p>
          <Link href="/login" className="label mt-8 inline-block text-[11px] text-muted hover:text-ink">
            ← Back to log in
          </Link>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <form action={requestPasswordResetAction} className="mt-8 space-y-5">
            <label className="block">
              <span className="label mb-2 block text-[10px] text-faint">Email</span>
              <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
            </label>
            <button
              type="submit"
              className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
            >
              Send Reset Link
            </button>
          </form>
          <Link href="/login" className="label mt-6 inline-block text-[11px] text-muted hover:text-ink">
            ← Back to log in
          </Link>
        </>
      )}
    </div>
  );
}
