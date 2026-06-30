import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

if (!EXPRESS_API_URL) {
  throw new Error(
    "EXPRESS_API_URL is not set in .env.local.",
  );
}

// Deliberately different cookie name from admin's l2e_session — cashier
// and admin sessions are completely independent and can coexist in the
// same browser without conflicting (e.g. an owner with the dashboard
// open in one tab and a cashier panel in another).
const COOKIE_NAME = "l2e_cashier_session";

interface CashierLoginRequestBody {
  phoneNumber: string;
  password: string;
  outletId: string;
}

interface CashierLoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresIn: string;
  };
}

export async function POST(req: NextRequest) {
  let body: CashierLoginRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  if (!body.phoneNumber || !body.password || !body.outletId) {
    return NextResponse.json(
      { error: "Phone number, password, and outlet ID are required." },
      { status: 400 },
    );
  }

  let data: CashierLoginApiResponse;
  try {
    const upstream = await axios.post<CashierLoginApiResponse>(
      `${EXPRESS_API_URL}/cashier/login`,
      {
        phoneNumber: body.phoneNumber,
        password: body.password,
        outletId: body.outletId,
      },
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

  if (!data?.data?.token) {
    return NextResponse.json(
      { error: "Unexpected response from authentication service." },
      { status: 502 },
    );
  }

  const { token } = data.data;

  // NOTE: unlike admin auth, there is no /cashier/me verification
  // endpoint available in the API — so we can't do the same post-issue
  // signature check we do for admin login. The token is set as-is after
  // a successful 200 response from Express. If a /cashier/me endpoint
  // is added later, wire it in here following the same pattern as
  // lib/auth/verifyToken.ts.
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // scoped to /cashier/* only — not sent on admin routes
    maxAge: 60 * 60 * 8, // 8 hours — matches the JWT's own exp (confirmed: shift-scoped)
  });

  store.set("l2e_cashier_has_session", "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  // Decode claims to return safe user info — no verification possible
  // without a /cashier/me endpoint, but this is display-only data.
  // JWT claims confirmed: cashierId, phoneNumber, outletId, brandId, name
  let cashierInfo: {
    cashierId: string;
    phoneNumber: string;
    outletId: string;
    brandId: string;
    name: string;
  } | null = null;

  try {
    const payloadSegment = token.split(".")[1];
    const json = Buffer.from(payloadSegment, "base64url").toString("utf8");
    cashierInfo = JSON.parse(json);
  } catch {
    // Decode failed — still return success since the cookie is set.
    // CashierAuthContext will handle null gracefully.
  }

  return NextResponse.json({
    cashier: cashierInfo
      ? {
          cashierId: cashierInfo.cashierId,
          name: cashierInfo.name,
          phoneNumber: cashierInfo.phoneNumber,
          outletId: cashierInfo.outletId,
          brandId: cashierInfo.brandId,
        }
      : null,
  });
}