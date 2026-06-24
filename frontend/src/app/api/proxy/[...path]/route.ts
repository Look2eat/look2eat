import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError, type Method } from "axios";

const EXPRESS_API_URL =
  process.env.EXPRESS_API_URL || "http://localhost:5001/api/v1";

const COOKIE_NAME = "l2e_session";

/**
 * Generic authenticated proxy: /api/proxy/admin/brands/123/dashboard
 * forwards to ${EXPRESS_API_URL}/admin/brands/123/dashboard with
 * Authorization: Bearer <token from httpOnly cookie> attached.
 *
 * Why a proxy instead of a route handler per endpoint: services/admin/*,
 * services/cashier/* etc. all funnel through services/http/
 * authenticatedClient.ts -> this single proxy. That keeps the token-
 * attachment logic in exactly one place instead of duplicated per domain
 * file.
 *
 * Tradeoff, stated plainly: a per-endpoint route handler gives you
 * tighter control (per-route validation, response shaping). The proxy
 * gives you speed now. Revisit this if you need server-side caching or
 * per-route logic later — nothing here blocks migrating one route at a
 * time.
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
  const search = req.nextUrl.search; // preserves ?brandId=...&limit=50 etc.
  const targetUrl = `${EXPRESS_API_URL}/${targetPath}${search}`;

  // ------------------------------------------------------------------
  // Body + Content-Type handling
  //
  // For multipart/form-data (file uploads) we must:
  //   1. Forward the original Content-Type header unchanged — it carries
  //      the boundary token that Express uses to split fields/files.
  //      Overwriting it with "application/json" corrupts the upload.
  //   2. Read the body as an ArrayBuffer and pass the raw bytes through
  //      rather than text(), which would corrupt binary file data.
  //
  // For every other method we keep the previous behaviour (raw JSON
  // string forwarded as-is so we remain a transparent relay).
  // ------------------------------------------------------------------
  const incomingContentType = req.headers.get("content-type") ?? "";
  const isMultipart = incomingContentType.startsWith("multipart/form-data");

  let body: string | Buffer | undefined;
  let contentTypeHeader: string;

  if (req.method === "GET" || req.method === "HEAD") {
    body = undefined;
    contentTypeHeader = "application/json";
  } else if (isMultipart) {
    // Preserve the full multipart header including the boundary parameter,
    // e.g. "multipart/form-data; boundary=----WebKitFormBoundaryXYZ".
    // Reading as ArrayBuffer keeps binary file bytes intact.
    const buf = await req.arrayBuffer();
    body = buf.byteLength > 0 ? Buffer.from(buf) : undefined;
    contentTypeHeader = incomingContentType;
  } else {
    const text = await req.text();
    body = text || undefined;
    contentTypeHeader = "application/json";
  }

  try {
    const upstream = await axios.request({
      url: targetUrl,
      method: req.method as Method,
      headers: {
        "Content-Type": contentTypeHeader,
        Authorization: `Bearer ${token}`,
      },
      // Pass the raw body through as-is — we're a transparent relay,
      // not a transform step.
      data: body,
      // Don't let axios throw on 4xx/5xx — we want to relay the upstream
      // status/body to the client as-is, same as the fetch version did.
      validateStatus: () => true,
    });

    return NextResponse.json(upstream.data, { status: upstream.status });
  } catch (err) {
    const axiosErr = err as AxiosError;
    if (!axiosErr.response) {
      // Express unreachable entirely (down, DNS, network) — distinct from
      // a normal 4xx/5xx, which is handled above via validateStatus.
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