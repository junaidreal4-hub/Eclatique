import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";

// Lightweight auth-state check for client UI (e.g. the sign-up prompt).
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    loggedIn: !!user,
    googleEnabled: !!process.env.GOOGLE_CLIENT_ID,
  });
}
