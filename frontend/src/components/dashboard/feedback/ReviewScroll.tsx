"use client";

import { Scroller } from "@/components/ui/scroller-1";
import { Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFeedback } from "../../../lib/auth/FeedbackContext";
import { Button } from "@/components/ui/button";
import type { FeedbackReview } from "../../../services/admin/feedbackDashboard";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getRatingColor = (rating: number) => {
    if (rating <= 2) return "bg-red-400/80";
    if (rating === 3) return "bg-yellow-400/80";
    return "bg-green-400/80";
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ---------------------------------------------------------------------------
// Review card
// ---------------------------------------------------------------------------

function ReviewCard({ review }: { review: FeedbackReview }) {
    return (
        <div className="relative flex w-80 flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
            {/* Colour bar */}
            <div className={`absolute left-0 top-0 h-full w-2 ${getRatingColor(review.rating)}`} />

            <div className="flex h-full flex-col p-5 pl-6">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-semibold text-sm">{review.phoneNumber}</h3>
                        <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                </div>

                {/* Categories */}
                {review.categories && review.categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {review.categories.map((cat) => (
                            <span
                                key={cat}
                                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {/* Feedback text */}
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {review.feedback}
                </p>

                {/* Metadata badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {review.googleReviewClicked && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Google review shared
                        </span>
                    )}
                    {review.isResolved && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Resolved
                        </span>
                    )}
                </div>

                {/* Winback CTA for negative reviews */}
                {review.rating < 3 && (
                    <button className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                        Customer Winback
                    </button>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ReviewsScroller() {
    const { data, loading, error, page, setPage } = useFeedback();

    return (
        <div className="space-y-4 bg-white dark:bg-[#121214] p-4 md:p-6 rounded-2xl font-poppins w-full overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Reviews</h2>
                    <p className="text-sm text-muted-foreground">Customer feedback and ratings</p>
                </div>

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {page} / {data.pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page + 1)}
                            disabled={page === data.pagination.totalPages || loading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            ) : error ? (
                <p className="text-sm text-destructive py-4">{error}</p>
            ) : !data || data.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No reviews yet.</p>
            ) : (
                <Scroller height="100%" overflow="x" width="100%">
                    <div className="flex gap-4 w-max pb-2">
                        {data.reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </Scroller>
            )}
        </div>
    );
}