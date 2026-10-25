"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  endUserSession,
  hashPassword,
  hashToken,
  makeToken,
  startUserSession,
  verifyPasswordHash,
} from "@/lib/auth-user";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

const VERIFY_TTL = 1000 * 60 * 60 * 24; // 24h
const RESET_TTL = 1000 * 60 * 60; // 1h

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://eclatiqueclothing.in";
}
function validEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !validEmail(email) || password.length < 8) {
    redirect("/register?error=invalid");
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    redirect("/register?error=exists");
  }

  const { raw, hash } = makeToken();
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      verifyToken: hash,
      verifyExpires: new Date(Date.now() + VERIFY_TTL),
    },
  });
  await sendVerificationEmail(email, name, `${siteUrl()}/verify?token=${raw}`);
  redirect("/login?verify=sent");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPasswordHash(password, user.passwordHash)) {
    redirect("/login?error=1");
  }
  if (!user.emailVerified) {
    redirect(`/login?error=unverified&email=${encodeURIComponent(email)}`);
  }
  await startUserSession(user.id);
  redirect("/account");
}

export async function logoutAction() {
  await endUserSession();
  redirect("/");
}

export async function resendVerificationAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerified) {
    const { raw, hash } = makeToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken: hash, verifyExpires: new Date(Date.now() + VERIFY_TTL) },
    });
    await sendVerificationEmail(email, user.name, `${siteUrl()}/verify?token=${raw}`);
  }
  redirect("/login?verify=sent");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const { raw, hash } = makeToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hash, resetExpires: new Date(Date.now() + RESET_TTL) },
    });
    await sendPasswordResetEmail(email, user.name, `${siteUrl()}/reset-password?token=${raw}`);
  }
  // Always the same response, so emails can't be enumerated.
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!token) redirect("/forgot-password");
  if (password.length < 8) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=short`);
  }

  const user = await prisma.user.findFirst({
    where: { resetToken: hashToken(token), resetExpires: { gt: new Date() } },
  });
  if (!user) redirect("/reset-password?error=expired");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashPassword(password),
      resetToken: null,
      resetExpires: null,
      // Resetting via emailed link also proves the email, so verify it.
      emailVerified: user.emailVerified ?? new Date(),
    },
  });
  redirect("/login?reset=1");
}
