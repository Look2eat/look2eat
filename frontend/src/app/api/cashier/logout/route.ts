import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();
  store.delete("l2e_cashier_session");
  store.delete("l2e_cashier_has_session");
  // NOTE: deliberately does NOT touch l2e_session (admin cookie) —
  // an admin can have the dashboard open simultaneously in another tab.
  return NextResponse.json({ success: true });
}