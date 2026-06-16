// ─────────────────────────────────────────────────────────────────
// CHANGED: the JWT no longer lives in localStorage — it's in an httpOnly
// cookie set by app/api/auth/login/route.ts and app/api/auth/register/
// route.ts. Client-side JS (this file included) cannot read that cookie's
// VALUE. What it CAN read is a separate, non-httpOnly marker cookie
// (`l2e_has_session=1`) that those same route handlers set alongside the
// real one — carries no token, no claims, just a boolean flag.
//
// getTokenPayload() used to decode the JWT directly out of localStorage.
// Since the token isn't client-readable anymore, this becomes an async
// call to /api/auth/me, which decodes the cookie's JWT server-side and
// returns the safe fields. Any call site doing
// `const payload = getTokenPayload()` synchronously needs to change to
// `const payload = await getTokenPayload()`.
// ─────────────────────────────────────────────────────────────────

export interface TokenPayload {
  brandId: string;
  brandName: string;
  slug: string;
  role: string;
}

/**
 * Client-side "looks logged in" check. Reads the lightweight marker
 * cookie set by login/register route handlers. This is NOT a security
 * boundary — Express still verifies the real JWT's signature on every
 * actual data request (via the authenticated proxy/client). This
 * function exists purely so client components can do a cheap synchronous
 * check (e.g. AuthGuard) without an HTTP round-trip.
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((c) => c.startsWith('l2e_has_session=1'));
}

/**
 * Fetches decoded token claims from our server (which reads the httpOnly
 * cookie server-side). Replaces the old synchronous, localStorage-based
 * version. Use this anywhere you need brandId/role/etc. for display
 * purposes — e.g. showing the brand name in a navbar.
 */
export async function getTokenPayload(): Promise<TokenPayload | null> {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user
      ? {
          brandId: data.user.brandId || '',
          brandName: data.user.brandName || data.user.name || '',
          slug: data.user.slug || '',
          role: data.user.role || '',
        }
      : null;
  } catch {
    return null;
  }
}

// keep backward compat
export async function getBrandIdFromToken(): Promise<string> {
  const payload = await getTokenPayload();
  return payload?.brandId || '';
}