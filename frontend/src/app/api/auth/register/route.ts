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

interface LoginRequestBody {
  phone: string;
  password: string;
}

interface LoginApiResponse {
  token: string;
  user: {
    id: string;
    brandId: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
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
  };
}

export async function POST(req: NextRequest) {
  let body: LoginRequestBody;
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

  let data: LoginApiResponse;
  try {
    const upstream = await axios.post<LoginApiResponse>(
      `${EXPRESS_API_URL}/auth/login`,
      { phone: body.phone, password: body.password },
      { headers: { "Content-Type": "application/json" } },
    );
    data = upstream.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; error?: string }>;

    if (!axiosErr.response) {
      return NextResponse.json(
        { error: "Could not reach the authentication service. Please try again." },
        { status: 502 },
      );
    }

    const status = axiosErr.response.status === 500 ? 502 : axiosErr.response.status;
    const message =
      axiosErr.response.data?.message ||
      axiosErr.response.data?.error ||
      "Invalid phone number or password.";
    return NextResponse.json({ error: message }, { status });
  }

  if (!data?.token || !data?.user) {
    return NextResponse.json(
      { error: "Unexpected response from authentication service." },
      { status: 502 },
    );
  }

  const { token, user } = data;

  // NEW: verify the token Express just issued, by asking Express itself
  // (GET /auth/me) to confirm it's genuinely valid — a real signature
  // check, not a local decode. If this fails, we do NOT set the cookie
  // and the whole login fails, per explicit decision: a token that
  // Express can't immediately verify indicates something is genuinely
  // wrong (clock skew, backend bug, etc.) and shouldn't be silently
  // accepted.
  try {
    await verifyToken(token);
  } catch (err) {
    const message =
      err instanceof TokenVerificationError
        ? err.message
        : "Could not verify the session after login.";
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
      id: user.id,
      brandId: user.brandId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      brandName: user.brand.name,
      slug: user.brand.slug,
    },
  });
}