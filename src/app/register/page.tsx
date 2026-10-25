import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/app/account/actions";
import { getCurrentUser } from "@/lib/auth-user";

export const metadata: Metadata = { title: "Create Account" };

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink placeholder:text-faint";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/account");
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-muted">
        Save your details and track your orders.
      </p>

      {error === "exists" ? (
        <p className="mt-6 border border-sale/30 bg-sale/5 p-3 text-xs font-medium text-sale">
          An account with this email already exists.{" "}
          <Link href="/login" className="underline">Log in</Link>.
        </p>
      ) : error ? (
        <p className="mt-6 border border-sale/30 bg-sale/5 p-3 text-xs font-medium text-sale">
          Enter your name, a valid email, and a password of at least 8 characters.
        </p>
      ) : null}

      <form action={registerAction} className="mt-8 space-y-5">
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Name</span>
          <input name="name" required className={inputCls} />
        </label>
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Email</span>
          <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">Password</span>
          <input name="password" type="password" required minLength={8} className={inputCls} placeholder="At least 8 characters" />
        </label>
        <button
          type="submit"
          className="label w-full bg-accent py-4 text-[11px] text-paper transition-opacity hover:opacity-90"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
