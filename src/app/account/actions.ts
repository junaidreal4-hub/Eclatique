"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  endUserSession,
  getCurrentUser,
  hashPassword,
  hashToken,
  makeToken,
  startUserSession,
  verifyPasswordHash,
} from "@/lib/auth-user";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  type AddressInput,
} from "@/lib/addresses";
import { getOrderForUser } from "@/lib/orders";
import {
  createReturnRequest,
  getOpenRequestForOrder,
  type ReturnItemInput,
} from "@/lib/returns";
import {
  sendPasswordResetEmail,
  sendReturnRequestAlert,
  sendVerificationEmail,
} from "@/lib/email";

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

// ---- Addresses -------------------------------------------------------------

function addressFromForm(formData: FormData): AddressInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    line: String(formData.get("line") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
  };
}

export async function addAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const input = addressFromForm(formData);
  if (input.name && input.phone && input.line && input.city && input.state && input.postalCode) {
    await createAddress(user.id, input, formData.get("makeDefault") === "on");
    revalidatePath("/account/addresses");
  }
  redirect("/account/addresses");
}

export async function updateAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = Number(formData.get("id"));
  if (id) {
    await updateAddress(user.id, id, addressFromForm(formData));
    revalidatePath("/account/addresses");
  }
  redirect("/account/addresses");
}

export async function deleteAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = Number(formData.get("id"));
  if (id) {
    await deleteAddress(user.id, id);
    revalidatePath("/account/addresses");
  }
  redirect("/account/addresses");
}

export async function setDefaultAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = Number(formData.get("id"));
  if (id) {
    await setDefaultAddress(user.id, id);
    revalidatePath("/account/addresses");
  }
  redirect("/account/addresses");
}

// ---- Returns & Exchanges ---------------------------------------------------

interface OrderLineLite {
  name: string;
  size: string;
  quantity: number;
}

export async function requestReturnAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orderId = Number(formData.get("orderId"));
  const order = orderId ? await getOrderForUser(orderId, user.id, user.email) : null;
  if (!order) redirect("/account/orders");

  // One open request per order.
  if (await getOpenRequestForOrder(order.id)) {
    redirect(`/account/orders/${order.id}?return=exists`);
  }

  const type = formData.get("type") === "EXCHANGE" ? "EXCHANGE" : "RETURN";
  const reason = String(formData.get("reason") ?? "").trim();

  const lines = JSON.parse(order.items || "[]") as OrderLineLite[];
  const items: ReturnItemInput[] = [];
  lines.forEach((l, i) => {
    if (formData.get(`item_${i}`) === "on") {
      items.push({
        name: l.name,
        size: l.size,
        quantity: l.quantity,
        exchangeSize:
          type === "EXCHANGE"
            ? String(formData.get(`exchangeSize_${i}`) ?? "").trim() || undefined
            : undefined,
      });
    }
  });

  if (items.length === 0) {
    redirect(`/account/orders/${order.id}?return=noitems`);
  }

  await createReturnRequest({
    orderId: order.id,
    razorpayOrderId: order.razorpayOrderId,
    userId: user.id,
    email: order.email,
    type,
    reason,
    items,
  });
  await sendReturnRequestAlert({
    type,
    razorpayOrderId: order.razorpayOrderId,
    customerName: order.customerName,
    email: order.email,
    reason,
    items,
  });

  revalidatePath("/account/orders");
  redirect(`/account/orders/${order.id}?return=submitted`);
}
