"use client";

import { useFeedback } from "../../../lib/auth/FeedbackContext";
import { TravelRouteCard } from "@/components/ui/card-7";

function NumberSkeleton({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-block rounded-lg bg-white/20 animate-pulse align-middle ${className}`}
        />
    );
}

export default function AvgRating() {
    const { data, loading } = useFeedback();

    return (
        <div className="flex bg-background">
            <TravelRouteCard
                titleRating="Average Rating"
                titleReviewPushed="Reviews pushed to Google"
                rating={
                    loading
                        ? <NumberSkeleton className="h-14 w-24" />
                        : data ? String(data.averageRating.toFixed(1)) : "—"
                }
                numberOfReviews={
                    loading
                        ? <NumberSkeleton className="h-14 w-16" />
                        : data ? String(data.googleReviews) : "0"
                }
                imageUrl="https://plus.unsplash.com/premium_photo-1682310144714-cb77b1e6d64a?q=80&w=2712&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="font-poppins"
            />
        </div>
    );
}