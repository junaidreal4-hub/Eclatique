import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fulfillOrder, verifySignature } from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      (await req.json()) ?? {};
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !secret) {
      return NextResponse.json({ status: "failure" }, { status: 400 });
    }

    const valid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret,
    );
    if (!valid) {
      return NextResponse.json({ status: "failure" }, { status: 400 });
    }

    const order = await fulfillOrder(razorpay_order_id, razorpay_payment_id);
    if (order) {
      revalidatePath("/", "layout");
      await sendOrderConfirmation(order);
    }

    return NextResponse.json({ status: "success", orderId: razorpay_order_id });
  } catch {
    return NextResponse.json({ status: "failure" }, { status: 400 });
  }
}
