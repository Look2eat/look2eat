"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPublicLoyaltyBySlug } from "@/services/public/loyalty";

/**
 * In-memory cache (same pattern as AuthContext — no localStorage, no
 * persistence) for brand DISPLAY details: logo, banner, description,
 * loyalty settings, milestones. This is deliberately separate from
 * AuthContext, which answers "who is logged in" (id, role, brandId,
 * slug). This answers "what does their brand look like" — different
 * concerns, fetched from a different (genuinely public, no-auth)
 * endpoint.
 *
 * Has a real dependency on AuthContext: it needs `user.slug` before it
 * can call GET /public/loyalty/{slug}, so it does nothing until
 * AuthContext has resolved. See app/dashboard/layout.tsx for provider
 * nesting order — BrandProvider must be INSIDE AuthProvider.
 */

export interface BrandDetails {
    id: string;
    name: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
    description: string | null;
    coinRatioValue: number;
}

interface BrandContextValue {
    brand: BrandDetails | null;
    isLoading: boolean;
    refresh: () => Promise<void>;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [brand, setBrand] = useState<BrandDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBrand = async (slug: string) => {
        try {
            const res = await getPublicLoyaltyBySlug(slug);
            setBrand({
                id: res.data.brand.id,
                name: res.data.brand.name,
                logoUrl: res.data.brand.logoUrl,
                bannerImageUrl: res.data.brand.bannerImageUrl,
                description: res.data.brand.description,
                coinRatioValue: res.data.settings.coinRatioValue,
            });
        } catch {
            // Brand details are DISPLAY data, not auth-critical — fail soft.
            // A failed fetch here should never block the dashboard from being
            // usable; components reading useBrand() should already handle
            // brand === null (e.g. fall back to a wordmark, same pattern as
            // WelcomeCard's logoUrl fallback).
            setBrand(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Wait for AuthContext to resolve first — slug doesn't exist until
        // it does. Once it has, fetch exactly once; this effect re-runs only
        // if slug itself changes (e.g. a different user logs in without a
        // full page reload, which shouldn't normally happen given logout
        // does a hard redirect, but guards against it regardless).
        if (isAuthLoading) return;

        if (!user?.slug) {
            setIsLoading(false);
            setBrand(null);
            return;
        }

        fetchBrand(user.slug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoading, user?.slug]);

    const refresh = async () => {
        if (!user?.slug) return;
        setIsLoading(true);
        await fetchBrand(user.slug);
    };

    return (
        <BrandContext.Provider value={{ brand, isLoading, refresh }}>
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand(): BrandContextValue {
    const ctx = useContext(BrandContext);
    if (!ctx) {
        throw new Error("useBrand() must be used within <BrandProvider>.");
    }
    return ctx;
}