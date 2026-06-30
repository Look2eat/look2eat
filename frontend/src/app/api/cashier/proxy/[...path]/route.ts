import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError, type Method } from "axios";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

if (!EXPRESS_API_URL) {
  throw new Error("EXPRESS_API_URL is not set in .env.local.");
}

const COOKIE_NAME = "l2e_cashier_session";

/**
 * Cashier-specific authenticated proxy: /api/cashier/proxy/cashier/customer/...
 * → ${EXPRESS_API_URL}/cashier/customer/...
 *
 * Reads l2e_cashier_session (NOT l2e_session — the admin cookie) so
 * cashier and admin sessions never bleed into each other. Identical
 * structure to /api/proxy/[...path]/route.ts for admin, just a
 * different cookie name.
 */
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }



  const targetPath = path.join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${EXPRESS_API_URL}/${targetPath}${search}`;
console.log("Proxy:", req.method, req.nextUrl.pathname);
console.log("Token exists:", !!token);
console.log("Target URL:", targetUrl);
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const text = await req.text();
    if (text) body = text;
  }

  try {
    console.log("Sending Authorization header:", `Bearer ${token?.slice(0, 20)}...`);
    const upstream = await axios.request({
      url: targetUrl,
      method: req.method as Method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: body,
      validateStatus: () => true,
    });
    console.log("Upstream status:", upstream.status);

console.log("Upstream response:", upstream.data)
    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (err) {
    const axiosErr = err as AxiosError;
    if (!axiosErr.response) {
      return NextResponse.json(
        { error: "Could not reach the API service." },
        { status: 502 },
      );
    }
    return NextResponse.json(axiosErr.response.data, {
      status: axiosErr.response.status,
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};