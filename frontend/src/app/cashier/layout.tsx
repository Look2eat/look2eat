import type { ReactNode } from "react";
import { CashierAuthProvider } from "@/lib/cashier/CashierAuthContext";

/**
 * Root layout for all /cashier/* pages. Provides the cashier session
 * context to both the login page and the cashier panel page. Note:
 * middleware gates /cashier/[outletId] (protected) but NOT
 * /cashier/login (public) — so CashierAuthProvider is safe to mount
 * here across both, since it fails gracefully when no cookie exists
 * (cashier === null, isLoading: false).
 */
export default function CashierLayout({ children }: { children: ReactNode }) {
    return <CashierAuthProvider>{children}</CashierAuthProvider>;
}