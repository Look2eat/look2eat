"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import {
    fetchBrandDashboard,
    fetchOutletDashboard,
    type DashboardData,
} from "@/services/admin/dashboard";
import { useOutlet, ALL_OUTLETS } from "@/lib/auth/OutletContext";

interface DashboardContextType {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const { selectedOutlet } = useOutlet();

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchCount, setFetchCount] = useState(0);

    const refetch = useCallback(() => setFetchCount((n) => n + 1), []);

    useEffect(() => {
        if (!selectedOutlet) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        const fetcher =
            selectedOutlet === ALL_OUTLETS
                ? fetchBrandDashboard()
                : fetchOutletDashboard(selectedOutlet);

        fetcher
            .then((d) => { if (!cancelled) setData(d); })
            .catch(() => { if (!cancelled) setError("Failed to load dashboard data."); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [selectedOutlet, fetchCount]);

    return (
        <DashboardContext.Provider value={{ data, loading, error, refetch }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used inside <DashboardProvider>");
    return ctx;
}