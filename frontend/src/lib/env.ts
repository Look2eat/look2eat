import "server-only";

/**
 * Server-side environment accessors.
 *
 * These are deliberately *functions*, not module-scope constants.
 *
 * `next build` imports every route module to collect page data, so a check
 * that throws at module scope turns a missing environment variable into a
 * failed build — with a stack trace pointing at a compiled chunk rather than
 * at the variable that is actually missing. Resolving inside the request
 * instead means a missing variable surfaces as a clear 500 on the route that
 * needs it, and never blocks a deploy of the pages that do not.
 */

/** Local Express default, so a fresh clone runs without any setup. */
const LOCAL_FALLBACK = "http://localhost:5001/api/v1";

/** Base URL of the Express API, e.g. https://api.example.com/api/v1 */
export function expressApiUrl(): string {
  const url = process.env.EXPRESS_API_URL;
  if (url) return url.replace(/\/$/, "");

  // Outside development, falling back to localhost would mean every API call
  // silently fails against a machine that isn't there. Better to say exactly
  // what is missing.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "EXPRESS_API_URL is not set. Add it to the deployment environment " +
        "(Vercel → Settings → Environment Variables) or to .env.local for " +
        "local development.",
    );
  }
  return LOCAL_FALLBACK;
}
