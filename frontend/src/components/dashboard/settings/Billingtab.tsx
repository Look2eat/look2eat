"use client";

import { useEffect, useState } from "react";
import { useOutlet } from "@/lib/auth/OutletContext";
import {
    getOutletSubscription,
    getSubscriptionHistory,
    type Subscription,
    type PurchaseHistoryRow,
} from "@/services/admin/billing";

const ALL_OUTLETS = "all";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatAmount(amount: number) {
    return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

function BillingHistoryTable({ rows }: { rows: PurchaseHistoryRow[] }) {
    if (rows.length === 0) {
        return (
            <p className="text-sm text-gray-500 dark:text-neutral-400 py-4">
                No billing history found.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-700">
            <table className="w-full text-base">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-neutral-700 dark:bg-neutral-900">
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Order ID</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Date</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Amount</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 dark:hover:bg-neutral-900"
                        >
                            <td className="px-4 py-3 font-mono text-sm text-gray-500 dark:text-neutral-300">
                                {row.razorpayOrderId}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-neutral-300">
                                {formatDate(row.createdAt)}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-neutral-300">
                                {formatAmount(row.amount)}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "PAID"
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                                    }`}>
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function BillingTab() {
    const { selectedOutlet, outlets } = useOutlet();
    const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [history, setHistory] = useState<PurchaseHistoryRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentOutlet?.id || selectedOutlet === ALL_OUTLETS || selectedOutlet === "") {
            setSubscription(null);
            setHistory([]);
            return;
        }

        async function fetchBilling() {
            setIsLoading(true);
            setError(null);
            try {
                const [subRes, histRes] = await Promise.all([
                    getOutletSubscription(currentOutlet!.id),
                    getSubscriptionHistory(currentOutlet!.id),
                ]);
                setSubscription(subRes.data);
                setHistory(histRes.data ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load billing.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchBilling();
    }, [selectedOutlet]);

    if (selectedOutlet === ALL_OUTLETS || selectedOutlet === "") {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-neutral-400">
                Please select an outlet to view billing details.
            </div>
        );
    }

    if (isLoading) {
        return <div className="h-44 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {/* Current Plan Card */}
            {subscription ? (
                <div className="mb-2 flex items-center justify-between rounded-2xl border border-indigo-100 dark:border-neutral-600 dark:bg-neutral-900 px-5 py-4 ">
                    <div >
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#48494C] dark:text-neutral-300 pb-3">
                            Current Plan
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#1D2033] dark:text-neutral-200 pb-1">
                            {subscription.plan.name}
                        </p>
                        <p className="text-xs text-[#48494C] dark:text-neutral-400">
                            ₹{subscription.plan.price.toLocaleString("en-IN")} / {subscription.plan.durationMonths} months
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-neutral-300">Expires</p>
                        <p className="mt-0.5 text-base font-semibold text-gray-700 dark:text-neutral-200">
                            {formatDate(subscription.endDate)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-neutral-400 mt-1">
                            {subscription.daysRemaining} days remaining
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-2 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-700 px-5 py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
                    No active subscription for this outlet.
                </div>
            )}

            {/* Billing History */}
            <div className="border-b border-gray-100 dark:border-neutral-900 py-5">
                <p className="mb-3 text-base font-semibold text-gray-800 dark:text-neutral-200">
                    Billing History
                </p>
                <BillingHistoryTable rows={history} />
            </div>
        </div>
    );
}