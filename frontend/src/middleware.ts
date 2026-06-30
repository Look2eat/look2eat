import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "l2e_session";
const CASHIER_COOKIE = "l2e_cashier_session";

function isTokenExpired(token: string): boolean {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return true;
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const claims = JSON.parse(json) as { exp?: number };
    if (typeof claims.exp !== "number") return true;
    return claims.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin dashboard gating ──────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const hasValidAdmin = Boolean(adminCookie) && !isTokenExpired(adminCookie!);

    if (!hasValidAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      if (adminCookie) loginUrl.searchParams.set("reason", "expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated admin away from login page
  if (pathname.startsWith("/login")) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const hasValidAdmin = Boolean(adminCookie) && !isTokenExpired(adminCookie!);
    if (hasValidAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── Cashier panel gating ────────────────────────────────────────
  // Gates /cashier/[outletId] but NOT /cashier/login (public entry point).
  // The outletId segment distinguishes them: /cashier/login has a literal
  // "login" segment, a real outletId is a UUID.
  const isCashierPanel =
    pathname.startsWith("/cashier/") && !pathname.startsWith("/cashier/login") ;

  if (isCashierPanel) {
    const cashierCookie = request.cookies.get(CASHIER_COOKIE)?.value;
    const hasValidCashier =
      Boolean(cashierCookie) && !isTokenExpired(cashierCookie!);

    if (!hasValidCashier) {
      const loginUrl = new URL("/cashier/login", request.url);
      // Pass the full pathname so login can redirect back to the exact
      // outlet panel URL — outletId is embedded in this path.
      loginUrl.searchParams.set("next", pathname);
      if (cashierCookie) loginUrl.searchParams.set("reason", "expired");
      return NextResponse.redirect(loginUrl);
    }

    // Confirm the outletId in the URL matches the one in the JWT.
    // Prevents cashier A from accessing cashier B's outlet panel just
    // by changing the URL segment — they'd have a valid cookie but for
    // a different outlet.
    const urlOutletId = pathname.split("/")[2]; // /cashier/[outletId]
    if (urlOutletId && cashierCookie) {
      try {
        const base64 = cashierCookie.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const claims = JSON.parse(atob(base64)) as { outletId?: string };
        if (claims.outletId && claims.outletId !== urlOutletId) {
          // Cookie is valid but for a different outlet — redirect to the
          // outlet they actually have access to, rather than showing an
          // error or a blank panel.
          return NextResponse.redirect(
            new URL(`/cashier/${claims.outletId}`, request.url),
          );
        }
      } catch {
        // Malformed token — the isTokenExpired check above already handles
        // this; reaching here means something very unusual happened.
      }
    }
  }

  // Redirect already-authenticated cashier away from the login page
  // (but only if their outletId in the token matches the `next` param —
  // otherwise let them log in fresh for a different outlet).
  if (pathname.startsWith("/cashier/login")) {
    const cashierCookie = request.cookies.get(CASHIER_COOKIE)?.value;
    const hasValidCashier =
      Boolean(cashierCookie) && !isTokenExpired(cashierCookie!);

    if (hasValidCashier) {
      try {
        const base64 = cashierCookie!.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const claims = JSON.parse(atob(base64)) as { outletId?: string };
        const nextParam = request.nextUrl.searchParams.get("next");
        const nextOutletId = nextParam?.split("/")[2];

        // Only skip login if the cookie is for the same outlet being accessed.
        if (claims.outletId && claims.outletId === nextOutletId) {
          return NextResponse.redirect(
            new URL(nextParam ?? `/cashier/${claims.outletId}`, request.url),
          );
        }
      } catch {
        // Can't decode — let them log in again.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};