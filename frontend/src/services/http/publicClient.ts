import axios, { AxiosError } from "axios";

/**
 * The axios instance for unauthenticated calls — talks to Express
 * DIRECTLY (no proxy, no cookie, no Authorization header), since these
 * endpoints are genuinely public by design (e.g. GET /public/loyalty/
 * {slug}, confirmed to require no auth).
 *
 * Kept as a SEPARATE instance from any authenticated client on purpose:
 * a component importing from this file structurally cannot accidentally
 * call an authenticated/mutating endpoint, because this client doesn't
 * attach a token and doesn't know the authenticated proxy exists.
 */
const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const publicClient = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

publicClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed.";
    return Promise.reject(new Error(message));
  },
);