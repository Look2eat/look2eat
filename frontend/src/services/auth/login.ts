export interface LoginInput {
  phone: string;
  password: string;
}

/**
 * What loginAdmin() returns to the CALLER (the login page). NOT the raw
 * Express response shape — that response contains the token. The token
 * is consumed into an httpOnly cookie inside app/api/auth/login/route.ts,
 * server-side, and never forwarded here. Same pattern as
 * services/auth/register.ts.
 */
export interface LoginResponse {
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
 * Calls OUR Next.js route handler (/api/auth/login), NOT Express
 * directly — identical reasoning to registerOwner() in
 * services/auth/register.ts. The real Express response includes a raw
 * JWT; routing through our own server lets the route handler consume it
 * into an httpOnly cookie and strip it before anything reaches this
 * browser-side function.
 *
 * Uses fetch, not axios — same-origin call to our own server, same as
 * registerOwner(). axios is reserved for the server-to-server call to
 * Express, which happens inside app/api/auth/login/route.ts.
 */
export const loginAdmin = async (input: LoginInput): Promise<LoginResponse> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Invalid phone number or password.");
  }

  return data as LoginResponse;
};

/**
 * Clears the session (both the httpOnly cookie and the marker cookie)
 * via our own route handler, then hard-redirects to /login. Hard
 * redirect (not router.push) on purpose — ensures every in-memory React
 * state from the authenticated session is discarded, not just the route.
 */
export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
};