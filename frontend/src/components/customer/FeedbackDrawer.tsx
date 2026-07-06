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
}

const EMOJIS = [
    { value: 1, emoji: "😞", label: "Terrible" },
    { value: 2, emoji: "😕", label: "Bad" },
    { value: 3, emoji: "😐", label: "Okay" },
    { value: 4, emoji: "😊", label: "Good" },
    { value: 5, emoji: "🤩", label: "Amazing" },
];

type Step = "rating" | "categories" | "review" | "done";

export default function FeedbackDrawer({
    walletId,
    feedbackAlreadyGiven,
    categories,
    googleReviewUrl,
}: FeedbackDrawerProps) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<Step>("rating");
    const [rating, setRating] = useState<number | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [feedbackId, setFeedbackId] = useState<string | null>(null);
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
        const timer = setTimeout(() => setOpen(true), 10000);
        return () => clearTimeout(timer);
    }, [feedbackAlreadyGiven]);

    const toggleCategory = (name: string) => {
        setSelectedCategories((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    };

    const handleEmojiClick = (value: number) => {
        setRating(value);
        setTimeout(() => setStep("categories"), 150);
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
            setStep("done");
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleReviewClick = async () => {
        if (feedbackId) {
            try {
                await recordGoogleReviewClick(feedbackId);
            } catch (e) {
                console.error(e);
            }
        }
        if (googleReviewUrl) {
            window.open(googleReviewUrl, "_blank");
        }
    };

    if (feedbackAlreadyGiven || !mounted) return null;

    const drawerContent = (
        <>
            {/* Backdrop — clipped inside container */}
            <div
                className={`absolute inset-0 transition-opacity duration-300 z-40 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                style={{ background: "rgba(0,0,0,0.4)" }}
                onClick={() => step !== "done" && setOpen(false)}
            />

            {/* Earn coins banner — shown when drawer is closed */}
            {!open && (
                <div className="absolute bottom-6 left-4 right-4 z-30">
                    <div
                        onClick={() => setOpen(true)}
                        className="cursor-pointer rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
                    >
                        <span className="text-3xl">🎁</span>
                        <div>
                            <p className="font-semibold text-sm leading-tight" style={{ color: "#ffffff" }}>
                                Earn 50 coins by giving feedback!
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                                Takes less than a minute ✨
                            </p>
                        </div>
                        <span className="ml-auto text-xl" style={{ color: "#ffffff" }}>›</span>
                    </div>
                </div>
            )}

            {/* Bottom sheet */}
            <div
                className={`absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out`}
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
                                    className="flex flex-col items-center gap-1 transition-transform duration-150 active:scale-90 hover:scale-110"
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

                {/* STEP: Categories */}
                {step === "categories" && (
                    <div className="px-6 pb-8 pt-2">
                        <div className="text-center mb-5">
                            <h2 className="text-lg font-semibold" style={{ color: "#111827" }}>
                                {isPositive
                                    ? "Glad to hear that! What did you like?"
                                    : "Sorry to hear. What went wrong?"}
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
                                style={{ background: "#111827", color: "#ffffff" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP: Review */}
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
                                style={{ background: "#111827", color: "#ffffff" }}
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
                            className="rounded-2xl px-5 py-4 mb-4 flex items-center gap-3"
                            style={{ background: "#f3f4f6" }}
                        >
                            <span className="text-2xl">⭐</span>
                            <p className="text-sm font-medium" style={{ color: "#111827" }}>
                                Thanks for your valuable feedback.
                            </p>
                        </div>

                        {isPositive ? (
                            <div
                                className="rounded-2xl p-5 text-center"
                                style={{ background: "linear-gradient(135deg, #60a5fa, #2dd4bf)" }}
                            >
                                <p className="text-base font-semibold leading-snug mb-4" style={{ color: "#ffffff" }}>
                                    Do us a favour and{" "}
                                    <span className="font-bold">share your rating on Google too?</span>{" "}
                                    It takes 2 sec.
                                </p>
                                <button
                                    onClick={handleGoogleReviewClick}
                                    className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
                                    style={{ background: "#000000", color: "#ffffff" }}
                                >
                                    Leave Online Review →
                                </button>
                            </div>
                        ) : (
                            <div className="text-center mt-4">
                                <p className="text-sm" style={{ color: "#6b7280" }}>
                                    We appreciate your honesty and will work on improving.
                                </p>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="mt-4 px-6 py-2 rounded-xl text-sm font-medium border"
                                    style={{ borderColor: "#d1d5db", color: "#374151", background: "#ffffff" }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );

    return containerRef.current
        ? createPortal(drawerContent, containerRef.current)
        : null;
}