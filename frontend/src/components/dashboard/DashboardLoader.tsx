"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { useBrand } from "@/lib/auth/BrandContext";
import { Spinner } from "@/components/ui/spinner";
import type { ReactNode } from "react";

/**
 * Gate component placed inside both AuthProvider and BrandProvider in
 * the dashboard layout. Blocks rendering of dashboard children with a
 * full-screen spinner until BOTH contexts have finished their initial
 * fetches (/api/auth/me and /public/loyalty/{slug}). This means:
 *
 *   - No flash of "Welcome back, !" (empty name before auth resolves)
 *   - No missing logo/brand colour before brand data resolves
 *   - One single loading state, not per-component skeletons scattered
 *     across the first render
 *
 * Once both are loaded, children render normally — this component
 * doesn't re-trigger the spinner on subsequent navigations between
 * dashboard sub-routes (layout doesn't remount on client-side nav).
 */
export function DashboardLoader({ children }: { children: ReactNode }) {
    const { isLoading: isAuthLoading } = useAuth();
    const { isLoading: isBrandLoading } = useBrand();

    if (isAuthLoading || isBrandLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#121214]">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
}