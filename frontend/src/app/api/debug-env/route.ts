import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * TEMPORARY DIAGNOSTIC — delete this route once the environment-variable
 * question is settled.
 *
 * Answers "is this deployment actually using the variables I think it is?"
 * without ever exposing a secret: for each name it reports only whether the
 * variable is set and an 8-character fingerprint of its value. Two
 * deployments showing the same fingerprint are using the same value; two
 * showing different fingerprints are not. The value itself never leaves the
 * server.
 *
 * Always dynamic — a cached response would defeat the entire purpose.
 *
 * (Note: this cannot live under a folder named `_debug`. App Router treats a
 * leading underscore as a private folder and opts it out of routing.)
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Names to report on. Values are never returned, only presence + fingerprint. */
const WATCHED = [
  "EXPRESS_API_URL",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SHOW_UNVERIFIED_CONTENT",
];

function fingerprint(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 8);
}

/**
 * For URL-shaped values, the host is what actually answers "which server?".
 * `URL.host` deliberately omits any user:password@ part, so a credential
 * embedded in a URL is still never returned. Non-URLs get no host.
 */
function hostOf(value: string): string | undefined {
  try {
    return new URL(value).host;
  } catch {
    return undefined;
  }
}

export async function GET() {
  // Never on the production branch: this route exists to debug Preview, and
  // it should not survive a merge to main onto www.zuplin.in.
  if (process.env.VERCEL_GIT_COMMIT_REF === "main") {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(
    {
      // Which environment Vercel actually built this as. This is the field
      // that usually explains the confusion: a branch that is not the
      // production branch deploys as "preview" and therefore reads Preview
      // variables, however the Production ones are configured.
      vercelEnv: process.env.VERCEL_ENV ?? "(not on Vercel)",
      nodeEnv: process.env.NODE_ENV,
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      deploymentUrl: process.env.VERCEL_URL ?? null,
      variables: Object.fromEntries(
        WATCHED.map((name) => {
          const raw = process.env[name];
          return [
            name,
            raw
              ? {
                  set: true,
                  host: hostOf(raw),
                  fingerprint: fingerprint(raw),
                  length: raw.length,
                }
              : { set: false },
          ];
        }),
      ),
      note: "host = which server. Fingerprints are SHA-256 prefixes: same fingerprint = same value. Delete this route when done.",
    },
    { headers: { "cache-control": "no-store, max-age=0" } },
  );
}
