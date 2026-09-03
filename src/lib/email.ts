import "server-only";
import type { OrderRow, OrderLine } from "./orders";

function money(paise: number): string {
  return `Rs. ${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

// Escape any customer-supplied text before it goes into the email HTML.
function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmail(order: OrderRow): string {
  const lines = JSON.parse(order.items) as OrderLine[];
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(l.name)} <span style="color:#888">(${esc(l.size)}) x${Number(l.quantity)}</span></td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">Rs. ${(l.price * l.quantity).toLocaleString("en-IN")}.00</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;background:#f5f5f4;margin:0;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee">
      <div style="background:#3e2723;color:#fff;padding:28px;text-align:center;letter-spacing:3px;font-weight:800">ECLATIQUE</div>
      <div style="padding:28px">
        <h1 style="font-size:20px;margin:0 0 8px">Your order is confirmed</h1>
        <p style="color:#555">Thank you for shopping with Eclatique. We're preparing your order now.</p>
        <p style="color:#555;font-size:13px">Order ID: <strong>${esc(order.razorpayOrderId)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">${rows}
          <tr><td style="padding:12px 0;font-weight:700">Total</td><td style="padding:12px 0;text-align:right;font-weight:700">${money(order.amount)}</td></tr>
        </table>
        <p style="color:#555;font-size:13px">Shipping to: ${esc(order.customerName)}, ${esc(order.address)}, ${esc(order.city)} ${esc(order.postalCode)}</p>
      </div>
      <div style="background:#f8f8f8;text-align:center;padding:18px;font-size:12px;color:#999">&copy; ${new Date().getFullYear()} Eclatique Clothing</div>
    </div></body></html>`;
}

// Internal "new order" alert for the store owner, so they know to fulfill it.
function renderAdminEmail(order: OrderRow): string {
  const lines = JSON.parse(order.items) as OrderLine[];
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${esc(l.name)} <span style="color:#888">(${esc(l.size)}) x${Number(l.quantity)}</span></td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">Rs. ${(l.price * l.quantity).toLocaleString("en-IN")}.00</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;padding:24px">
    <h2 style="margin:0 0 12px">New paid order</h2>
    <p style="font-size:13px;color:#555">Order ID: <strong>${esc(order.razorpayOrderId)}</strong> · Payment: <strong>${esc(order.razorpayPaymentId ?? "-")}</strong></p>
    <table style="width:100%;max-width:520px;border-collapse:collapse;margin:12px 0;font-size:14px">${rows}
      <tr><td style="padding:10px 0;font-weight:700">Total</td><td style="padding:10px 0;text-align:right;font-weight:700">${money(order.amount)}</td></tr>
    </table>
    <p style="font-size:14px"><strong>Ship to</strong><br>
      ${esc(order.customerName)}<br>
      ${esc(order.address)}, ${esc(order.city)} ${esc(order.postalCode)}<br>
      Phone: ${esc(order.phone)}<br>
      Email: ${esc(order.email)}
    </p>
  </body></html>`;
}

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("[email] Resend responded", res.status, await res.text());
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export async function sendOrderConfirmation(order: OrderRow): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set — skipping order emails");
    return;
  }
  const from = process.env.ORDER_FROM_EMAIL || "Eclatique <onboarding@resend.dev>";

  // Confirmation to the customer.
  await sendEmail(
    apiKey,
    from,
    order.email,
    "Your Eclatique order is confirmed",
    renderEmail(order),
  );

  // Alert to the store owner (if configured).
  const notify = process.env.ORDER_NOTIFY_EMAIL;
  if (notify) {
    await sendEmail(
      apiKey,
      from,
      notify,
      `New order — ${order.customerName} (${money(order.amount)})`,
      renderAdminEmail(order),
    );
  }
}
