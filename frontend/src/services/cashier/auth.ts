export interface CashierLoginInput {
  phoneNumber: string;
  password: string;
  outletId: string;
}

export interface CashierLoginResponse {
  cashier: {
    cashierId: string;
    name: string;
    phoneNumber: string;
    outletId: string;
    brandId: string;
  } | null;
}

/**
 * Calls OUR Next.js route handler (/api/cashier/login), NOT Express
 * directly — same pattern as admin loginAdmin(). The raw JWT from
 * Express is consumed into an httpOnly cookie (l2e_cashier_session)
 * server-side; this function never sees it.
 */
export const loginCashier = async (
  input: CashierLoginInput,
): Promise<CashierLoginResponse> => {
  const res = await fetch("/api/cashier/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Invalid phone number or password.");
  }

  return data as CashierLoginResponse;
};

/**
 * Clears the cashier session cookie via /api/cashier/logout, then
 * hard-redirects to the cashier login page for the same outlet.
 * outletId is passed so the redirect lands on the right login URL
 * rather than a generic /cashier/login with no context.
 */
export const logoutCashier = async (outletId: string): Promise<void> => {
  await fetch("/api/cashier/logout", { method: "POST" });
  window.location.href = `/cashier/login?next=/cashier/${outletId}`;
};