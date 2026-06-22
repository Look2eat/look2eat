"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * In-memory cache for brand details fetched from the authenticated
 * GET /api/v1/brands endpoint (via BFF proxy at /api/proxy/brands).
 *
 * Deliberately separate from AuthContext, which answers "who is logged in"
 * (id, role, brandId, slug). This answers "what does their brand look like"
 * — logo, banner, primary color, coin ratio, terms, etc.
 *
 * Previously this used the public /public/loyalty/{slug} endpoint. Switched
 * to the authenticated endpoint because:
 *   1. It returns the full brand record (primaryColor, termsText, settings…)
 *      needed to seed the LoyaltySettingsDialog on open.
 *   2. refresh() is called after the dialog saves — the public endpoint has
 *      cache lag; the authenticated one reflects writes immediately.
 *
 * Provider nesting: BrandProvider must be INSIDE AuthProvider so that
 * useAuth() resolves before we attempt the fetch.
 */

export interface BrandDetails {
    id: string;
    name: string;
    slug: string;
    email: string | null;
    phoneNumber: string | null;
    logoUrl: string | null;
    bannerImageUrl: string | null;
    description: string | null;
    primaryColor: string;
    termsText: string | null;
    gst: string | null;
    address: string | null;
    isActive: boolean;
    coinRatioValue: number;
}

interface BrandContextValue {
    brand: BrandDetails | null;
    isLoading: boolean;
    refresh: () => Promise<void>;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

async function fetchBrandFromApi(): Promise<BrandDetails> {
    const res = await fetch("/api/proxy/brands", { method: "GET" });

    // Read body once — avoids "body stream already read" if the response
    // is non-JSON (same pattern as the loyalty service layer).
    const text = await res.text();
    let parsed: Record<string, unknown> | null = null;
    if (text) {
        try {
            parsed = JSON.parse(text);
        } catch {
            // Non-JSON body — treated as an opaque error below.
        }
    }

    if (!res.ok) {
        const body = parsed as Record<string, string> | null;
        throw new Error(body?.message ?? body?.error ?? "Couldn't load brand details.");
    }

    // Response shape: { data: { ...brand, settings: { coinRatioValue } } }
    const data = (parsed as { data: Record<string, unknown> }).data;

    const settings = data.settings as { coinRatioValue: number } | null;

    return {
        id: data.id as string,
        name: data.name as string,
        slug: data.slug as string,
        email: (data.email as string) ?? null,
        phoneNumber: (data.phoneNumber as string) ?? null,
        logoUrl: (data.logoUrl as string) ?? null,
        bannerImageUrl: (data.bannerImageUrl as string) ?? null,
        description: (data.description as string) ?? null,
        primaryColor: (data.primaryColor as string) ?? "#F43F5E",
        termsText: (data.termsText as string) ?? null,
        gst: (data.gst as string) ?? null,
        address: (data.address as string) ?? null,
        isActive: (data.isActive as boolean) ?? true,
        coinRatioValue: settings?.coinRatioValue ?? 1,
    };
}

export function BrandProvider({ children }: { children: ReactNode }) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [brand, setBrand] = useState<BrandDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadBrand = async () => {
        try {
            const details = await fetchBrandFromApi();
            setBrand(details);
        } catch {
            // Brand details are DISPLAY data, not auth-critical — fail soft.
            // Components reading useBrand() should handle brand === null
            // (e.g. fall back to a wordmark).
            setBrand(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Wait for AuthContext to resolve before attempting the authenticated
        // fetch — there's no token until it does.
        if (isAuthLoading) return;

        if (!user) {
            setIsLoading(false);
            setBrand(null);
            return;
        }

        loadBrand();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoading, user?.id]);

    const refresh = async () => {
        if (!user) return;
        setIsLoading(true);
        await loadBrand();
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