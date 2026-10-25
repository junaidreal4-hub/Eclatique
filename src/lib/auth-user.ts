import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "./db";

/*
  Customer accounts — email/password auth, kept separate from the admin login.
  Passwords are hashed with scrypt (built-in, no dependency); the session is a
  signed, expiring cookie carrying the user id (stateless, no session table).
*/

const COOKIE = "eclatique_user";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    "dev-insecure-secret-change-me"
  );
}

// ---- Password hashing (scrypt) --------------------------------------------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string | null): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    computed.length === expected.length &&
    crypto.timingSafeEqual(computed, expected)
  );
}

// ---- Email / reset tokens --------------------------------------------------

/** A random token: the raw value is emailed, only its hash is stored. */
export function makeToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  return { raw, hash: hashToken(raw) };
}
export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// ---- Session (signed cookie) ----------------------------------------------

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export async function startUserSession(userId: number): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${userId}.${exp}`;
  const token = `${payload}.${sign(payload)}`;
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

export async function endUserSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

async function sessionUserId(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [uid, expStr, sig] = token.split(".");
  if (!uid || !expStr || !sig) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  if (!safeEqual(sig, sign(`${uid}.${expStr}`))) return null;
  const id = Number(uid);
  return Number.isFinite(id) ? id : null;
}

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  emailVerified: Date | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const id = await sessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, emailVerified: true },
  });
}
