import { NextResponse } from "next/server";
import crypto from "node:crypto";

function isHttps(req: Request): boolean {
  return req.headers.get("x-forwarded-proto")?.split(",")[0].trim() === "https";
}

// Starts the Google OAuth flow: sets a CSRF state cookie and redirects to Google.
export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  if (!clientId) {
    return NextResponse.redirect(`${base}/login?error=google`);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${base}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
  res.cookies.set("g_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(req),
    path: "/",
    maxAge: 600,
  });
  return res;
}
