import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";

const COOKIE = "eclatique_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Constant-time string comparison that never throws on length mismatch.
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

// The session cookie is a signed, expiring token ("<expiry>.<hmac>") rather than
// the raw secret, so it can expire and never exposes the secret itself.
function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;

  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;

  return safeEqual(sig, sign(expStr));
}

export async function startSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = `${exp}.${sign(String(exp))}`;

  // Mark the cookie Secure only when the request is actually HTTPS (Nginx sets
  // x-forwarded-proto). Over plain HTTP (e.g. previewing via the server IP), a
  // Secure cookie would be dropped by the browser, breaking the admin session.
  const proto = (await headers()).get("x-forwarded-proto")?.split(",")[0].trim();
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
