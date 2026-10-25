import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction, resendVerificationAction } from "@/app/account/actions";
import { getCurrentUser } from "@/lib/auth-user";
import { GoogleButton } from "@/components/account/google-button";

export const metadata: Metadata = { title: "Log In" };

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink placeholder:text-faint";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; verify?: string; verified?: string; reset?: string; email?: string }>;
}) {
  if (await getCurrentUser()) redirect("/account");
  const { error, verify, verified, reset, email } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-muted">Welcome back to Eclatique.</p>

      {/* Notices */}
      {verified && <Notice ok>Email verified — you can log in now.</Notice>}
      {reset && <Notice ok>Password updated — log in with your new password.</Notice>}
      {verify === "sent" && (
        <Notice ok>Check your inbox for a verification link to activate your account.</Notice>
      )}
      {verify === "invalid" && (
        <Notice>That verification link is invalid or has expired. Log in to resend one.</Notice>
      )}
      {error === "google" && <Notice>Google sign-in failed. Please try again.</Notice>}
      {error === "unverified" ? (
        <div className="mt-6 border border-line bg-subtle p-4 text-xs">
          <p className="font-medium text-ink">Please verify your email first.</p>
          <form action={resendVerificationAction} className="mt-3 flex items-center gap-2">
            <input type="hidden" name="email" value={email ?? ""} />
            <button className="label border border-ink px-3 py-1.5 text-[10px] hover:bg-ink hover:text-paper">
              Resend verification email
            </button>
          </form>
        </div>
      ) : error && error !== "google" ? (
        <Notice>Incorrect email or password.</Notice>
      ) : null}

      <GoogleButton />

      <form action={loginAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Email</span>
          <input name="email" type="email" required defaultValue={email ?? ""} className={inputCls} placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Password</span>
          <input name="password" type="password" required className={inputCls} />
        </label>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-muted underline underline-offset-2 hover:text-ink">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Notice({ children, ok = false }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <p
      className={`mt-6 border p-3 text-xs font-medium ${
        ok ? "border-line bg-subtle text-ink" : "border-sale/30 bg-sale/5 text-sale"
      }`}
    >
      {children}
    </p>
  );
}
