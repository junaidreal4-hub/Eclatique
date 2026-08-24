import "server-only";
import { cookies } from "next/headers";

const COOKIE = "eclatique_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === secret;
}

export async function startSession(): Promise<void> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  const jar = await cookies();
  jar.set(COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
