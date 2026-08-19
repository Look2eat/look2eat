"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { submitFeedback, recordGoogleReviewClick } from "@/services/public/feedback";

interface FeedbackCategory {
    name: string;
    enabled: boolean;
    displayOrder: number;
}

interface FeedbackDrawerProps {
    walletId: string;
    feedbackAlreadyGiven: boolean;
    categories: FeedbackCategory[];
    googleReviewUrl?: string | null;
    cardColor?: string;
    feedbackPoints: number; // optional prop for customizing the card color
}

const EMOJIS = [
    { value: 1, emoji: "😞", label: "Terrible" },
    { value: 2, emoji: "😕", label: "Bad" },
    { value: 3, emoji: "😐", label: "Okay" },
    { value: 4, emoji: "😊", label: "Good" },
    { value: 5, emoji: "🤩", label: "Amazing" },
];

// "google" — shown immediately for 4-5★ ratings, redirects straight to Google
// "categories"/"review" — only reached for <4★ ratings (private feedback)
type Step = "rating" | "google" | "categories" | "review" | "done";

export default function FeedbackDrawer({
    walletId,
    feedbackAlreadyGiven,
    categories,
    googleReviewUrl,
    cardColor,
    feedbackPoints,
}: FeedbackDrawerProps) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    // promoOpen — the "Earn 35 Coins" dialog shown 10s after mount
    // minimized — set when the user taps the cross on that dialog; docks
    //             a small reminder pill at the top instead of disappearing
    const [promoOpen, setPromoOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [step, setStep] = useState<Step>("rating");
    const [rating, setRating] = useState<number | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [feedbackId, setFeedbackId] = useState<string | null>(null);
    const [redirecting, setRedirecting] = useState(false);
    const containerRef = useRef<Element | null>(null);

    const isPositive = (rating ?? 0) >= 4;

    const enabledCategories = categories
        .filter((c) => c.enabled)
        .sort((a, b) => a.displayOrder - b.displayOrder);

    useEffect(() => {
        containerRef.current = document.getElementById("mobile-container");
        setMounted(true);
    }, []);

    useEffect(() => {
        if (feedbackAlreadyGiven) return;
        const timer = setTimeout(() => setPromoOpen(true), 3500);
        return () => clearTimeout(timer);
    }, [feedbackAlreadyGiven]);

    const toggleCategory = (name: string) => {
        setSelectedCategories((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    };

    // 4-5★ — record the rating immediately (no categories/review step),
    // then go straight to the Google screen.
    const handlePositiveRating = async (value: number) => {
        setRating(value);
        setSubmitting(true);
        try {
            const res = await submitFeedback({
                walletId,
                rating: value,
                categories: [],
            });
            setFeedbackId(res.data?.id ?? null);
            console.log("Feedback submitted successfully:", res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
            setStep("google");
        }
    };

    // <4★ — unchanged private-feedback flow.
    const handleNegativeRating = (value: number) => {
        setRating(value);
        setTimeout(() => setStep("categories"), 150);
    };

    const handleEmojiClick = (value: number) => {
        if (value >= 4) {
            handlePositiveRating(value);
        } else {
            handleNegativeRating(value);
        }
    };

    const handleSubmit = async () => {
        if (!rating) return;
        setSubmitting(true);
        try {
            const res = await submitFeedback({
                walletId,
                rating,
                categories: selectedCategories,
                feedback: reviewText.trim() || undefined,
            });
            setFeedbackId(res.data?.id ?? null);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
            setStep("done");
        }
    };

    // Coins are credited server-side off this click event — we can't verify
    // an actual Google submission, only that the user was sent there, so the
    // reward is tied to (and only ever promised for) the redirect itself.
    const handleGoogleReviewClick = async () => {
        setRedirecting(true);
        try {
            if (feedbackId) {
                await recordGoogleReviewClick(feedbackId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setRedirecting(false);
        }
        if (googleReviewUrl) {
            window.open(googleReviewUrl, "_blank");
        }
        setStep("done");
    };

    const handleSkipGoogle = () => {
        setStep("done");
    };

    // Tapping the promo dialog's CTA — dismiss it and open the actual flow.
    const handleStartFromPromo = () => {
        setPromoOpen(false);
        setMinimized(false);
        setOpen(true);
    };

    // Tapping the cross on the promo dialog — don't fully dismiss, dock a
    // small reminder pill at the top instead so the offer stays reachable.
    const handleDismissPromo = () => {
        setPromoOpen(false);
        setMinimized(true);
    };

    // Tapping the docked top pill — bring back the full flow.
    const handleReopenFromPill = () => {
        setMinimized(false);
        setOpen(true);
    };

    if (feedbackAlreadyGiven || !mounted) return null;

    const drawerContent = (
        // Positioned relative to the actual viewport (`fixed`), not the
        // scrollable #mobile-container (`absolute` would center against the
        // full page height). The inner column re-creates MobileContainer's
        // own `max-w-105` centering so content still only overlays the
        // mobile-width column, not the full browser width.
        <div className="fixed inset-0 z-40 flex justify-center pointer-events-none ">
            <div className="relative w-full max-w-105 h-full">
                {/* Backdrop — dulls the screen behind whichever surface is open */}
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${(open || promoOpen) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    style={{ background: "rgba(17,24,39,0.45)", backdropFilter: "blur(1px)" }}
                    onClick={() => {
                        if (promoOpen) handleDismissPromo();
                        else if (open && step !== "done") setOpen(false);
                    }}
                />

                {/* Earn coins — dialog popup, shown 10s after mount */}
                {promoOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-auto">
                        <div
                            className="relative w-full max-w-[260px] aspect-square rounded-[32px] flex flex-col items-center justify-center text-center px-6 shadow-2xl"
                            style={{
                                background: `linear-gradient(155deg, color-mix(in srgb, ${cardColor} 75%, white) 0%, ${cardColor} 50%, color-mix(in srgb, ${cardColor} 75%, black) 100%)`,
                                boxShadow: `0 24px 48px -12px color-mix(in srgb, ${cardColor} 55%, transparent)`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Cross — dismiss into the top pill instead of closing outright */}
                            <button
                                onClick={handleDismissPromo}
                                aria-label="Dismiss"
                                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-base leading-none"
                                style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}
                            >
                                ×
                            </button>

                            <span
                                className="text-6xl leading-none mb-3"
                                style={{filter: "drop-shadow(0 2px 4px rgba(255, 255, 255, 0.4))",}}
                            >
                            🎁
                            </span>
                            <p className="font-bold text-xl leading-tight mb-1" style={{ color: "#ffffff" }}>
                                Earn {feedbackPoints} Coins
                            </p>
                            <p className="text-sm leading-snug mb-4" style={{ color: "rgba(255,255,255,0.95)" }}>
                                Share your feedback — takes less than a minute ✨
                            </p>
                            <button
                                onClick={handleStartFromPromo}
                                className="inline-flex items-center gap-1 rounded-lg px-4 py-1.5 text-sm font-semibold "
                                style={{ background: "#ffffff", color: cardColor }}
                            >
                                Tap to start
                            </button>
                        </div>
                    </div>
                )}

                {/* Minimized reminder pill — docked at top after the promo popup
                    is dismissed via the cross, so the offer stays reachable */}
                {minimized && (
                    <div className="absolute top-3 left-3 right-3 z-30 pointer-events-auto">
                        <div
                            onClick={handleReopenFromPill}
                            className="cursor-pointer rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
                            style={{
                                background: `linear-gradient(155deg, ${cardColor} 0%, ${cardColor} 50%, ${cardColor} 100%)`,
                                boxShadow: `0 12px 24px -12px ${cardColor}8C`,
                            }}
                        >
                            <span
                                className="text-2xl"
                                style={{
                                    filter: "drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3))",
                                }}
                            >
                                🎁
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-tight" style={{ color: "#ffffff" }}>
                                    Still want your {feedbackPoints} coins?
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                                    Leave a quick review ✨
                                </p>
                            </div>
                            <span className="text-lg" style={{ color: "#ffffff" }}>›</span>
                        </div>
                    </div>
                )}

                {/* Bottom sheet */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out pointer-events-auto"
                    style={{
                        background: "#ffffff",
                        transform: open ? "translateY(0)" : "translateY(100%)",
                    }}
                >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full" style={{ background: "#e5e7eb" }} />
                    </div>

                    {/* STEP: Rating */}
                    {step === "rating" && (
                        <div className="px-6 pb-8 pt-2">
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-semibold" style={{ color: "#111827" }}>
                                    How was your experience?
                                </h2>
                                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                                    Tap an emoji to rate us
                                </p>
                            </div>

                            <div className="flex justify-center gap-4 mb-2">
                                {EMOJIS.map(({ value, emoji, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => handleEmojiClick(value)}
                                        disabled={submitting}
                                        className="flex flex-col items-center gap-1 transition-transform duration-150 active:scale-90 hover:scale-110 disabled:opacity-50"
                                        aria-label={label}
                                    >
                                        <span className="text-4xl leading-none">{emoji}</span>
                                        <span className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP: Google — shown directly for 4-5★, no categories/review in between */}
                    {step === "google" && (
                        <div className="px-6 pb-8 pt-2">
                            <div className="text-center mb-6">
                                <span className="text-4xl leading-none">🌟</span>
                                <h2 className="text-lg font-semibold mt-3" style={{ color: "#111827" }}>
                                    Thanks for the love!
                                </h2>
                                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#6b7280" }}>
                                    Share it on Google and we&apos;ll credit{" "}
                                    <span className="font-semibold" style={{ color: "#111827" }}>{feedbackPoints} coins</span>{" "}
                                    right away.
                                </p>
                            </div>

                            <button
                                onClick={handleGoogleReviewClick}
                                disabled={redirecting}
                                className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                                style={{ background: cardColor, color: "#ffffff" }}
                            >
                                {redirecting ? "Opening Google..." : "Rate us on Google →"}
                            </button>

                            <button
                                onClick={handleSkipGoogle}
                                className="w-full text-center text-sm font-medium mt-3 py-2"
                                style={{ color: "#9ca3af" }}
                            >
                                Skip for now
                            </button>
                        </div>
                    )}

                    {/* STEP: Categories (<4★ only) */}
                    {step === "categories" && (
                        <div className="px-6 pb-8 pt-2">
                            <div className="text-center mb-5">
                                <h2 className="text-lg font-semibold" style={{ color: "#111827" }}>
                                    Sorry to hear. What went wrong?
                                </h2>
                                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                                    Select all that apply
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {enabledCategories.map((cat) => {
                                    const selected = selectedCategories.includes(cat.name);
                                    return (
                                        <button
                                            key={cat.name}
                                            onClick={() => toggleCategory(cat.name)}
                                            className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150"
                                            style={{
                                                background: selected ? "#111827" : "#ffffff",
                                                color: selected ? "#ffffff" : "#374151",
                                                borderColor: selected ? "#111827" : "#d1d5db",
                                            }}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("rating")}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium border"
                                    style={{ borderColor: "#d1d5db", color: "#374151", background: "#ffffff" }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep("review")}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold"
                                    style={{ background: cardColor, color: "#ffffff" }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP: Review (<4★ only) */}
                    {step === "review" && (
                        <div className="px-6 pb-8 pt-2">
                            <div className="text-center mb-5">
                                <h2 className="text-lg font-semibold" style={{ color: "#111827" }}>
                                    Anything to add?
                                </h2>
                                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                                    Optional — share more details
                                </p>
                            </div>

                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here..."
                                rows={4}
                                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none mb-4"
                                style={{
                                    border: "1px solid #e5e7eb",
                                    background: "#f9fafb",
                                    color: "#111827",
                                }}
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("categories")}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium border"
                                    style={{ borderColor: "#d1d5db", color: "#374151", background: "#ffffff" }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
                                    style={{ background: cardColor, color: "#ffffff" }}
                                >
                                    {submitting ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP: Done */}
                    {step === "done" && (
                        <div className="px-6 pb-8 pt-2">
                            <div
                                className="rounded-2xl px-5 py-4 flex items-center gap-3"
                                style={{ background: "#f3f4f6" }}
                            >
                                <span className="text-2xl">⭐</span>
                                <p className="text-sm font-medium" style={{ color: "#111827" }}>
                                    Thanks for your valuable feedback.
                                </p>
                            </div>

                            {!isPositive && (
                                <div className="text-center mt-4">
                                    <p className="text-sm" style={{ color: "#6b7280" }}>
                                        We appreciate your honesty and will work on improving.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setOpen(false)}
                                className="w-full mt-4 px-6 py-2 rounded-xl text-sm font-medium border"
                                style={{ borderColor: "#d1d5db", color: "#374151", background: "#ffffff" }}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return containerRef.current
        ? createPortal(drawerContent, containerRef.current)
        : null;
}