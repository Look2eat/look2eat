import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();
  store.delete("l2e_session");
  store.delete("l2e_has_session");
  return NextResponse.json({ success: true });

  // NOTE: this clears the cookie for THIS browser only. The JWT itself
  // remains technically valid (stateless token, no server-side
  // revocation store) until its natural 7-day expiry — see earlier
  // conversation about Redis-based revocation being a separate,
  // not-yet-built piece of work.
}