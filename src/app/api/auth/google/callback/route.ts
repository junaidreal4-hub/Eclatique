import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  buildSessionToken,
  findOrCreateGoogleUser,
} from "@/lib/auth-user";

function isHttps(req: Request): boolean {
  return req.headers.get("x-forwarded-proto")?.split(",")[0].trim() === "https";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const fail = (reason = "google") => NextResponse.redirect(`${base}/login?error=${reason}`);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = (await cookies()).get("g_state")?.value;

  // CSRF: state must match the cookie we set when starting the flow.
  if (!code || !state || !stateCookie || state !== stateCookie) return fail();

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail();

  try {
    // Exchange the code for an access token.
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${base}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return fail();

    // Fetch the verified profile.
    const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const info = await infoRes.json();
    if (!info.email || info.email_verified === false) return fail();

    const user = await findOrCreateGoogleUser(info.email, info.name ?? "");

    const res = NextResponse.redirect(`${base}/account`);
    res.cookies.set(SESSION_COOKIE, buildSessionToken(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps(req),
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    res.cookies.set("g_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("[google oauth] failed:", err);
    return fail();
  }
}
