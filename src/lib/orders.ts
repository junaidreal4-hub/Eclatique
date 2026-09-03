import "server-only";
import crypto from "node:crypto";
import { prisma } from "./db";
import { getProductById } from "./products";
import type { Size } from "./types";

export interface CartItemInput {
  productId: number;
  size: string;
  quantity: number;
}

export interface OrderLine {
  productId: number;
  name: string;
  size: string;
  price: number; // rupees
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  email: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

/** A validation error whose message is safe to show the customer. */
export class CheckoutError extends Error {}

/**
 * Re-prices the cart from the database. The client's prices are ignored — the
 * amount charged is computed here from authoritative product data, and stock is
 * validated. This is what prevents price/quantity tampering.
 */
export async function validateCart(
  items: CartItemInput[],
): Promise<{ lines: OrderLine[]; amountPaise: number }> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutError("Your cart is empty.");
  }

  const lines: OrderLine[] = [];
  let rupees = 0;

  for (const item of items) {
    const product = await getProductById(Number(item.productId));
    if (!product) throw new CheckoutError("A product in your cart is no longer available.");

    const size = String(item.size) as Size;
    if (!product.sizes.includes(size)) {
      throw new CheckoutError(`Invalid size selected for ${product.name}.`);
    }

    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const available = product.stock[size] ?? 0;
    if (available < quantity) {
      throw new CheckoutError(
        available === 0
          ? `${product.name} (${size}) is sold out.`
          : `${product.name} (${size}) has only ${available} left.`,
      );
    }

    lines.push({
      productId: product.id,
      name: product.name,
      size,
      price: product.price,
      quantity,
      image: product.images[0] ?? "",
    });
    rupees += product.price * quantity;
  }

  return { lines, amountPaise: rupees * 100 };
}

export async function createPendingOrder(
  razorpayOrderId: string,
  amountPaise: number,
  lines: OrderLine[],
  customer: CustomerDetails,
) {
  return prisma.order.create({
    data: {
      razorpayOrderId,
      amount: amountPaise,
      email: customer.email,
      customerName: customer.customerName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      items: JSON.stringify(lines),
    },
  });
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export type OrderRow = Awaited<ReturnType<typeof createPendingOrder>>;

/**
 * Flips an order pending -> paid exactly once (idempotent across the verify call
 * and the webhook), then decrements stock. Returns the order only if THIS call
 * did the transition, so email/stock run a single time.
 */
export async function fulfillOrder(
  razorpayOrderId: string,
  paymentId: string,
): Promise<OrderRow | null> {
  const res = await prisma.order.updateMany({
    where: { razorpayOrderId, status: "pending" },
    data: { status: "paid", razorpayPaymentId: paymentId },
  });
  if (res.count === 0) return null; // already processed, or unknown order

  const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
  if (!order) return null;

  const lines = JSON.parse(order.items) as OrderLine[];
  for (const line of lines) {
    const product = await prisma.product.findUnique({ where: { id: line.productId } });
    if (!product) continue;
    const stock = JSON.parse(product.stock || "{}") as Record<string, number>;
    stock[line.size] = Math.max(0, (stock[line.size] ?? 0) - line.quantity);
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: JSON.stringify(stock) },
    });
  }

  return order;
}

export async function getAllOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function countOrders() {
  return prisma.order.count({ where: { status: "paid" } });
}
