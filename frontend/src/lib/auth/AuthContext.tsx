"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

/**
 * In-memory cache for the current user's identity (brandId, slug, name,
 * role, etc.), fetched ONCE per page load from /api/auth/me — which
 * itself round-trips to Express for real signature verification (see
 * lib/auth/verifyToken.ts). Every component below this provider reads
 * from React state via useAuth(), not from a fresh network call.
 *
 * Deliberately NOT persisted to localStorage or sessionStorage. The
 * tradeoff, stated plainly: this cache is lost on a hard page refresh
 * (new React tree = new fetch), unlike localStorage, which would survive
 * a refresh "for free." That's an intentional cost, not an oversight —
 * see the conversation history for why brandId/slug/etc., similar to the
 * JWT itself, shouldn't sit in storage any script on the page can read.
 * One extra fetch per hard refresh is a fair trade for that.
 */

export interface AuthUser {
    id: string;
    brandId: string;
    name: string;
    brandName: string;
    slug: string;
    role: string;
    email: string;
    phoneNumber: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    /** Re-fetch /api/auth/me on demand — e.g. after a profile update. */
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchMe(): Promise<AuthUser | null> {
    try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user ?? null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetchMe().then((result) => {
            if (!cancelled) {
                setUser(result);
                setIsLoading(false);
            }
        });

        // Avoids a state update on an unmounted component if the user
        // navigates away before the fetch resolves (e.g. fast nav off
        // /dashboard right after landing on it).
        return () => {
            cancelled = true;
        };
    }, []);

    const refresh = async () => {
        setIsLoading(true);
        const result = await fetchMe();
        setUser(result);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Read the current user's identity anywhere below <AuthProvider>.
 * Throws if used outside the provider — a deliberate fail-loud choice so
 * a missing provider shows up immediately in development instead of
 * silently returning undefined deep in some component tree.
 */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth() must be used within <AuthProvider>.");
    }
    return ctx;
}