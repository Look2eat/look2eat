export interface RegisterOwnerInput {
  brandName: string;
  slug: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * This is what registerOwner() returns to the CALLER (the signup page).
 * It is NOT the raw Express response shape — that response contains a
 * token, and a `user` object missing brandId/email plus an `owner`
 * object that has them (an inconsistency in the backend, worth fixing
 * server-side eventually). The actual extraction/normalization of that
 * messy shape happens in app/api/auth/register/route.ts, server-side,
 * where the token is also consumed into an httpOnly cookie and never
 * forwarded here.
 */
export interface RegisterOwnerResponse {
  user: {
    id: string;
    brandId: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    brandName: string;
    slug: string;
  };
}

/**
 * Calls OUR Next.js route handler (/api/auth/register), NOT Express
 * directly. This is the load-bearing decision here: the real Express
 * response from POST /auth/register-owner includes a raw JWT. If this
 * function called Express directly (e.g. via publicClient), that token
 * would land in browser-accessible memory/JSON — exactly the localStorage-
 * style XSS exposure already fixed for login. Routing through our own
 * server lets /api/auth/register/route.ts consume the token into an
 * httpOnly cookie and strip it before anything reaches this function.
 *
 * Uses plain fetch, not axios, on purpose: this call is to OUR OWN
 * Next.js server (same-origin), same pattern as login's fetch() call in
 * app/login/page.tsx. axios (via publicClient/authenticatedClient) is
 * reserved for calls that cross to Express — directly for public routes,
 * or via the proxy for authenticated ones. Registration crosses to
 * Express too, but it does so SERVER-SIDE inside the route handler
 * (using axios there — see app/api/auth/register/route.ts), not from
 * this browser-side function.
 */
export const registerOwner = async (
  input: RegisterOwnerInput,
): Promise<RegisterOwnerResponse> => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Could not create your account.");
  }

  return data as RegisterOwnerResponse;
};

/**
 * Turns "Pizza Palace" into "pizza-palace". The signup UI (components/ui/
 * signup.tsx) only collects brandName, not a separate slug field, but the
 * backend requires both as distinct fields — so we derive one client-side.
 *
 * NOTE: this does not guarantee uniqueness. If the backend rejects a slug
 * collision, surface that error to the user (registerOwner throws with
 * the backend's message in that case) rather than silently appending a
 * random suffix — a predictable slug matters for the public loyalty URL
 * (/loyalty/[restaurantSlug]) the owner will actually share with customers.
 */
export function slugify(brandName: string): string {
  return brandName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}