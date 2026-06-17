import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "l2e_session";

/**
 * Edge runtime middleware. Checks for cookie PRESENCE AND that the JWT
 * inside it hasn't expired. Does NOT verify the signature — Express
 * remains the sole authority on whether a token is genuinely valid
 * (tampered, revoked, etc.). This is a fast UX gate: catch the common
 * "my 7-day session just went stale" case at the door, before any page
 * renders, rather than letting the dashboard load and only discovering
 * the problem when an API call 401s mid-page.
 *
 * Decoding (not verifying) a JWT in the Edge runtime is safe to do with
 * plain base64 — no crypto/signature library needed for just reading the
 * exp claim, which keeps this middleware fast and dependency-free.
 */

function isTokenExpired(token: string): boolean {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return true;

    // atob is available in the Edge runtime (unlike Buffer, which isn't
    // guaranteed) — fine for base64url with the - / _ swap below.
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const claims = JSON.parse(json) as { exp?: number };

    if (typeof claims.exp !== "number") return true;
    return claims.exp * 1000 < Date.now();
  } catch {
    // Malformed token — treat as expired/invalid rather than letting a
    // garbage cookie value slip through.
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

  const hasValidSession = Boolean(sessionCookie) && !isTokenExpired(sessionCookie!);

  const isProtected = pathname.startsWith("/dashboard");
  const isLoginPage = pathname.startsWith("/login");

  if (isProtected && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    // If there WAS a cookie but it was expired (vs. never logged in at
    // all), surface that distinction so the login page can show a
    // "your session expired, please log in again" message instead of a
    // generic login form — slightly better UX for a real expiry case.
    if (sessionCookie) {
      loginUrl.searchParams.set("reason", "expired");
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};