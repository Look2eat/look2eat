import axios, { AxiosError } from "axios";

/**
 * Axios instance for all authenticated cashier API calls. Points at
 * /api/cashier/proxy (NOT /api/proxy — the admin proxy). The cashier
 * proxy reads l2e_cashier_session; the admin proxy reads l2e_session.
 * Keeping them separate ensures a cashier can never accidentally hit
 * an admin endpoint and vice versa.
 */
export const cashierClient = axios.create({
  baseURL: "/api/cashier/proxy",
  headers: { "Content-Type": "application/json" },
});

cashierClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401) {
      // Cashier session expired — redirect to the cashier login page
      // for the same outlet so they can re-authenticate without losing
      // context of which outlet they were on.
      if (typeof window !== "undefined") {
        const outletId = window.location.pathname.split("/")[2];
        window.location.href = `/cashier/login?next=/cashier/${outletId}&reason=expired`;
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed.";

    return Promise.reject(new Error(message));
  },
);