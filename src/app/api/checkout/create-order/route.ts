import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { CheckoutError, createPendingOrder, validateCart } from "@/lib/orders";
import { getCurrentUser } from "@/lib/auth-user";
import { createAddress } from "@/lib/addresses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, firstName, lastName, phone, address, city, state, postalCode, saveAddress } = body ?? {};

    if (!email || !firstName || !phone || !address || !city || !state || !postalCode) {
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

    // Link the order to the logged-in customer (if any).
    const user = await getCurrentUser();
    const customerName = `${firstName} ${lastName ?? ""}`.trim();

    await createPendingOrder(
      rzpOrder.id,
      amountPaise,
      lines,
      {
        email: String(email),
        customerName,
        phone: String(phone),
        address: String(address),
        city: String(city),
        state: String(state),
        postalCode: String(postalCode),
      },
      user?.id ?? null,
    );

    // Optionally save the address to the account.
    if (user && saveAddress) {
      await createAddress(user.id, {
        name: customerName,
        phone: String(phone),
        line: String(address),
        city: String(city),
        state: String(state),
        postalCode: String(postalCode),
      }).catch(() => {});
    }

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
