"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

/**
 * In-memory cashier session context — mirrors AuthContext's pattern but
 * for cashier sessions (l2e_cashier_session cookie, 8h expiry).
 *
 * Key difference from admin AuthContext: there is no /cashier/me
 * endpoint for server-side signature verification, so claims are decoded
 * client-side from /api/cashier/me (a decode-only local route, not a
 * real Express verification). This means a tampered cashier token can't
 * be caught here — it will only be rejected by Express on the first real
 * cashier data request. Flagging this gap clearly rather than hiding it.
 *
 * If a /cashier/me endpoint is added to Express later, update
 * app/api/cashier/me/route.ts to call it (same pattern as
 * lib/auth/verifyToken.ts for admin).
 */

export interface CashierUser {
    cashierId: string;
    name: string;
    phoneNumber: string;
    outletId: string;
    brandId: string;
}

interface CashierAuthContextValue {
    cashier: CashierUser | null;
    isLoading: boolean;
}

const CashierAuthContext = createContext<CashierAuthContextValue | undefined>(
    undefined,
);

async function fetchCashierSession(): Promise<CashierUser | null> {
    try {
        const res = await fetch("/api/cashier/me", { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        return data.cashier ?? null;
    } catch {
        return null;
    }
}

export function CashierAuthProvider({ children }: { children: ReactNode }) {
    const [cashier, setCashier] = useState<CashierUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetchCashierSession().then((result) => {
            if (!cancelled) {
                setCashier(result);
                setIsLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <CashierAuthContext.Provider value={{ cashier, isLoading }}>
            {children}
        </CashierAuthContext.Provider>
    );
}

export function useCashierAuth(): CashierAuthContextValue {
    const ctx = useContext(CashierAuthContext);
    if (!ctx) {
        throw new Error(
            "useCashierAuth() must be used within <CashierAuthProvider>.",
        );
    }
    return ctx;
}