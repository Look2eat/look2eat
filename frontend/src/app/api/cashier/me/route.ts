import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "l2e_cashier_session";

interface CashierJwtClaims {
  cashierId: string;
  phoneNumber: string;
  outletId: string;
  brandId: string;
  name: string;
  iat: number;
  exp: number;
}

function decodeCashierToken(token: string): CashierJwtClaims | null {
  try {
    const payloadSegment = token.split(".")[1];
    const json = Buffer.from(payloadSegment, "base64url").toString("utf8");
    return JSON.parse(json) as CashierJwtClaims;
  } catch {
    return null;
  }
}

/**
 * Decode-only — unlike /api/auth/me for admin, this does NOT call an
 * Express verification endpoint (none exists for cashier yet). Returns
 * claims from the cookie payload if the token is present and not
 * expired. Security boundary remains Express: every real cashier data
 * request goes through the proxy with the token attached, and Express
 * verifies the signature there.
 */
export async function GET() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    console.log("No cashier token found in cookies.");
    return NextResponse.json({ cashier: null }, { status: 401 });
  }

  const claims = decodeCashierToken(token);

  if (!claims || claims.exp * 1000 < Date.now()) {
    return NextResponse.json({ cashier: null }, { status: 401 });
  }

  return NextResponse.json({
    cashier: {
      cashierId: claims.cashierId,
      name: claims.name,
      phoneNumber: claims.phoneNumber,
      outletId: claims.outletId,
      brandId: claims.brandId,
    },
  });
}