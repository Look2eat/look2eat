import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, TokenVerificationError } from "@/lib/auth/verifyToken";

const COOKIE_NAME = "l2e_session";

/**
 * Returns the CURRENT session's user info, REAL signature-verified via
 * Express's GET /auth/me — not a local JWT decode. This replaces the
 * earlier version of this route, which only decoded the payload locally
 * and could be fooled by a tampered (but not expired) token, since it
 * never checked the signature. This version asks the one party that
 * actually can: Express.
 *
 * Trade-off, stated plainly: this now makes a real network round-trip to
 * Express on every call, instead of being instant. Used by
 * getTokenPayload() in lib/auth.ts for display purposes (e.g. navbar) —
 * if that gets called very frequently, consider caching this response
 * for a short window rather than re-verifying on every render. Not done
 * here since it wasn't asked for and adds complexity (cache invalidation
 * on logout) — flagging it as a known future optimization, not a
 * silently-applied one.
 */
export async function GET() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const claims = await verifyToken(token);

    return NextResponse.json({
      user: {
        id: claims.sub,
        brandId: claims.brandId,
        name: claims.name,
        brandName: claims.name,
        slug: claims.slug,
        role: claims.role,
        email: claims.email,
        phoneNumber: claims.phoneNumber,
      },
    });
  } catch (err) {
    // Token exists but Express rejects it (expired, tampered, revoked
    // once that exists) — treat as logged out, same response shape as
    // "no cookie at all" so callers don't need to distinguish.
    const status = err instanceof TokenVerificationError ? err.status : 401;
    return NextResponse.json({ user: null }, { status: status === 502 ? 502 : 401 });
  }
}