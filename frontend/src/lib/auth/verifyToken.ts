import "server-only";
import axios, { AxiosError } from "axios";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

if (!EXPRESS_API_URL) {
  throw new Error(
    "EXPRESS_API_URL is not set in .env.local. Add it and restart your dev server.",
  );
}

/**
 * Matches the REAL confirmed response of GET /auth/me — note this is
 * the decoded JWT claims, wrapped in `data`, NOT the richer user/brand
 * shape that login/register return. brandId, slug, role etc. come
 * straight from here, not from a separate brand lookup.
 */
export interface AuthMeResponse {
  data: {
    sub: string;
    email: string;
    role: string;
    brandId: string;
    phoneNumber: string;
    name: string;
    slug: string;
    iat: number;
    exp: number;
  };
}

export class TokenVerificationError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

/**
 * Calls Express's GET /auth/me with the given token attached as
 * Authorization: Bearer <token>. Unlike a local JWT decode, this is a
 * REAL signature verification — Express is the only party that holds
 * the secret to confirm a token wasn't tampered with, and this is the
 * one place in the frontend that actually asks it.
 *
 * Used in three places:
 *   1. app/api/auth/login/route.ts — verify the token Express just
 *      issued, BEFORE committing to setting the session cookie.
 *   2. app/api/auth/register/route.ts — same, after registration.
 *   3. app/api/auth/me/route.ts — re-verify an existing session's
 *      cookie on demand (e.g. for navbar display), replacing what used
 *      to be a local, unverified decode.
 *
 * Throws TokenVerificationError on any failure (network, 401, malformed
 * response) — callers decide what to do (fail the request, vs. treat as
 * "not logged in").
 */
export async function verifyToken(token: string): Promise<AuthMeResponse["data"]> {
  try {
    const res = await axios.get<AuthMeResponse>(`${EXPRESS_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.data?.data?.sub) {
      throw new TokenVerificationError(
        "Unexpected response from /auth/me.",
        502,
      );
    }

    return res.data.data;
  } catch (err) {
    if (err instanceof TokenVerificationError) throw err;

    const axiosErr = err as AxiosError;
    if (!axiosErr.response) {
      throw new TokenVerificationError(
        "Could not reach the authentication service to verify the session.",
        502,
      );
    }

    throw new TokenVerificationError(
      "Session could not be verified.",
      axiosErr.response.status,
    );
  }
}