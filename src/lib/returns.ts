import "server-only";
import { prisma } from "./db";

export interface ReturnItemInput {
  name: string;
  size: string;
  quantity: number;
  exchangeSize?: string; // for EXCHANGE
}

export async function createReturnRequest(data: {
  orderId: number;
  razorpayOrderId: string;
  userId?: number | null;
  email: string;
  type: "RETURN" | "EXCHANGE";
  reason: string;
  items: ReturnItemInput[];
}) {
  return prisma.returnRequest.create({
    data: {
      orderId: data.orderId,
      razorpayOrderId: data.razorpayOrderId,
      userId: data.userId ?? null,
      email: data.email,
      type: data.type,
      reason: data.reason.slice(0, 1000),
      items: JSON.stringify(data.items),
    },
  });
}

/** Open (non-final) request for an order, if any — blocks duplicate requests. */
export async function getOpenRequestForOrder(orderId: number) {
  return prisma.returnRequest.findFirst({
    where: { orderId, status: { in: ["requested", "approved"] } },
  });
}

/** Most recent request for an order, for display on the order page. */
export async function getLatestRequestForOrder(orderId: number) {
  return prisma.returnRequest.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReturnRequestsForUser(userId: number, email: string) {
  return prisma.returnRequest.findMany({
    where: { OR: [{ userId }, { email }] },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReturnRequests() {
  return prisma.returnRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateReturnStatus(
  id: number,
  status: string,
  adminNote?: string,
) {
  return prisma.returnRequest.update({
    where: { id },
    data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
  });
}
