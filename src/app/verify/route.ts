import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/auth-user";

// Email verification link target. Marks the account verified, then sends the
// customer to the login page.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const token = url.searchParams.get("token") ?? "";

  if (token) {
    const user = await prisma.user.findFirst({
      where: { verifyToken: hashToken(token), verifyExpires: { gt: new Date() } },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), verifyToken: null, verifyExpires: null },
      });
      return NextResponse.redirect(`${base}/login?verified=1`);
    }
  }
  return NextResponse.redirect(`${base}/login?verify=invalid`);
}
