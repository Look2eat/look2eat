import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { verifyToken, TokenVerificationError } from "@/lib/auth/verifyToken";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

if (!EXPRESS_API_URL) {
  throw new Error(
    "EXPRESS_API_URL is not set in .env.local. Add it and restart your dev server.",
  );
}

const COOKIE_NAME = "l2e_session";

interface RegisterRequestBody {
  brandName: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  slug: string;
}

/**
 * Actual shape returned by Express's POST /auth/register-owner.
 * Everything is nested one level under `data`. The full identity fields
 * (brandId, email, isActive, timestamps) live on `owner`, NOT on `user` —
 * `user` here is a stripped-down object (id, phoneNumber, role, name)
 * with no brandId/email. `brand` is a sibling of `owner`/`user`, not
 * nested inside either of them. This is the backend inconsistency noted
 * in lib/auth/register.ts — worth fixing server-side eventually, but
 * until then this route normalizes it.
 */
interface RegisterApiResponse {
  data: {
    token: string;
    brand: {
      id: string;
      name: string;
      slug: string;
      email: string;
      phoneNumber: string;
      logoUrl: string | null;
      primaryColor: string | null;
      bannerImageUrl: string | null;
      description: string | null;
      termsText: string | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    owner: {
      id: string;
      brandId: string;
      name: string;
      email: string;
      phoneNumber: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    user: {
      id: string;
      phoneNumber: string;
      role: string;
      name: string;
    };
  };
}

export async function POST(req: NextRequest) {
  let body: RegisterRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  if (!body.phone || !body.password) {
    return NextResponse.json(
      { error: "Phone number and password are required." },
      { status: 400 },
    );
  }

  let raw: RegisterApiResponse;
  try {
    const upstream = await axios.post<RegisterApiResponse>(
      `${EXPRESS_API_URL}/auth/register-owner`,
      {
        phone: body.phone,
        password: body.password,
        name: body.name,
        brandName: body.brandName,
        slug: body.slug,
        email: body.email,
      },
      { headers: { "Content-Type": "application/json" } },
    );
    raw = upstream.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; error?: string }>;

    if (!axiosErr.response) {
      return NextResponse.json(
        { error: "Could not reach the authentication service. Please try again." },
        { status: 502 },
      );
    }

    const status = axiosErr.response.status === 500 ? 502 : axiosErr.response.status;
    console.log(axiosErr)
    const message =
      axiosErr.response.data?.message ||
      axiosErr.response.data?.error ||
      "Could not create your account.";
    return NextResponse.json({ error: message }, { status });
  }

  if (!raw?.data?.token || !raw?.data?.owner || !raw?.data?.brand) {
    return NextResponse.json(
      { error: "Unexpected response from authentication service." },
      { status: 502 },
    );
  }

  const { token, owner, brand } = raw.data;

  // Verify the token Express just issued, by asking Express itself
  // (GET /auth/me) to confirm it's genuinely valid — a real signature
  // check, not a local decode. If this fails, we do NOT set the cookie
  // and the whole registration fails, per explicit decision: a token
  // that Express can't immediately verify indicates something is
  // genuinely wrong (clock skew, backend bug, etc.) and shouldn't be
  // silently accepted.
  try {
    await verifyToken(token);
  } catch (err) {
    const message =
      err instanceof TokenVerificationError
        ? err.message
        : "Could not verify the session after registration.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  store.set("l2e_has_session", "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    user: {
      id: owner.id,
      brandId: owner.brandId,
      name: owner.name,
      email: owner.email,
      phoneNumber: owner.phoneNumber,
      role: owner.role,
      brandName: brand.name,
      slug: brand.slug,
    },
  });
}