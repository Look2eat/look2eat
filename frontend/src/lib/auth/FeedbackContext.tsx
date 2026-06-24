"use client";

/**
 * FeedbackContext
 *
 * Owns all feedback dashboard state so every child component
 * (FeedbackStats, AvgRating, ReviewsScroller, FeedbackHeader toggle)
 * reads from one source of truth and triggers a single fetch when the
 * selected outlet changes.
 *
 * Place <FeedbackProvider> at the top of the feedback page.
 */

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import {
    fetchOutletFeedbackDashboard,
    fetchBrandFeedbackDashboard,
    toggleFeedbackEnabled,
    type FeedbackDashboardData,
} from "../../services/admin/feedbackDashboard";
import { useOutlet, ALL_OUTLETS } from "../../lib/auth/OutletContext";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface FeedbackContextType {
    data: FeedbackDashboardData | null;
    loading: boolean;
    error: string | null;
    /** Current page (1-indexed) */
    page: number;
    setPage: (page: number) => void;
    /** Optimistically toggle feedback enabled and persist to API */
    handleToggleFeedback: (enabled: boolean) => Promise<void>;
    /** Re-fetch manually (e.g. after saving settings) */
    refetch: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const PAGE_LIMIT = 5;

export function FeedbackProvider({ children }: { children: ReactNode }) {
    const { selectedOutlet } = useOutlet();

    const [data, setData] = useState<FeedbackDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [fetchCount, setFetchCount] = useState(0); // bump to refetch

    const refetch = useCallback(() => setFetchCount((n) => n + 1), []);

    // Re-fetch whenever the outlet selection or page changes
    useEffect(() => {
        if (!selectedOutlet) return; // wait for OutletContext to initialise

        let cancelled = false;
        setLoading(true);
        setError(null);

        const fetcher =
            selectedOutlet === ALL_OUTLETS
                ? fetchBrandFeedbackDashboard({ page, limit: PAGE_LIMIT })
                : fetchOutletFeedbackDashboard(selectedOutlet, { page, limit: PAGE_LIMIT });

        fetcher
            .then((d) => { if (!cancelled) setData(d); })
            .catch(() => { if (!cancelled) setError("Failed to load feedback data."); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [selectedOutlet, page, fetchCount]);

    // Reset to page 1 when outlet changes
    useEffect(() => {
        setPage(1);
    }, [selectedOutlet]);

    const handleToggleFeedback = useCallback(
        async (enabled: boolean) => {
            // Optimistic update
            setData((prev) => prev ? { ...prev, feedbackEnabled: enabled } : prev);
            try {
                await toggleFeedbackEnabled(enabled);
            } catch {
                // Roll back on failure
                setData((prev) => prev ? { ...prev, feedbackEnabled: !enabled } : prev);
                throw new Error("Failed to update feedback toggle.");
            }
        },
        []
    );

    return (
        <FeedbackContext.Provider
            value={{ data, loading, error, page, setPage, handleToggleFeedback, refetch }}
        >
            {children}
        </FeedbackContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFeedback() {
    const ctx = useContext(FeedbackContext);
    if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
    return ctx;
}