import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { CheckoutError, createPendingOrder, validateCart } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, firstName, lastName, phone, address, city, postalCode } = body ?? {};

    if (!email || !firstName || !phone || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: "Please fill in all contact and shipping details." },
        { status: 400 },
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
    }

    // Authoritative pricing + stock check (client prices are ignored).
    const { lines, amountPaise } = await validateCart(items);

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const rzpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await createPendingOrder(rzpOrder.id, amountPaise, lines, {
      email: String(email),
      customerName: `${firstName} ${lastName ?? ""}`.trim(),
      phone: String(phone),
      address: String(address),
      city: String(city),
      postalCode: String(postalCode),
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
      keyId,
    });
  } catch (err) {
    // Only surface our own validation messages; hide any internal error detail.
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[checkout] create-order failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
