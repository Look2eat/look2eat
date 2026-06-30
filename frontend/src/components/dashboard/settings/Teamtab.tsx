"use client";

import { useState, useEffect, useCallback } from "react";
import { AddCashierDialog } from "./Addcashierdialog";
import { useOutlet } from "@/lib/auth/OutletContext";
import { listCashiersByOutlet, deactivateCashier, reactivateCashier } from "../../../services/admin/cashier";

const ALL_OUTLETS = "all";

type Cashier = {
    id: string;
    name: string;
    phoneNumber: string;
    outletId: string;
    isActive: boolean;

};

function CashierEmptyState({ onCreated }: { onCreated: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-700 py-16 text-center font-poppins">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6 text-gray-500 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </div>
            <p className="text-base font-semibold text-gray-600 dark:text-neutral-400">No cashiers yet</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-200">Add your first cashier to get started.</p>
            <div className="mt-4">
                <AddCashierDialog onCreated={onCreated} />
            </div>
        </div>
    );
}

function CashierRow({
    cashier,
    onToggleStatus,
}: {
    cashier: Cashier;
    onToggleStatus: () => void;
}) {
    return (
        <tr className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 dark:hover:bg-neutral-900">
            <td className="px-4 py-3 font-medium text-gray-700 dark:text-neutral-200">{cashier.name}</td>
            <td className="px-4 py-3 text-gray-500 dark:text-neutral-400">{cashier.phoneNumber}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cashier.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400"
                    }`}>
                    {cashier.isActive ? "Active" : "Inactive"}
                </span>
            </td>
            <td className="px-4 py-3 text-right">
                <button
                    onClick={onToggleStatus}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${cashier.isActive
                        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20"
                        : "text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20"
                        }`}
                >
                    {cashier.isActive ? "Deactivate" : "Activate"}
                </button>
            </td>
        </tr>
    );
}

export function TeamTab({ footer = false }: { footer?: boolean }) {
    const { selectedOutlet, outlets } = useOutlet();
    const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

    const [cashiers, setCashiers] = useState<Cashier[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCashiers = useCallback(async () => {
        if (!currentOutlet?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await listCashiersByOutlet(currentOutlet.id);
            setCashiers(res.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load cashiers.");
        } finally {
            setIsLoading(false);
        }
    }, [currentOutlet?.id]);

    // Refetch whenever outlet changes
    useEffect(() => {
        fetchCashiers();
    }, [fetchCashiers]);

    async function handleToggleStatus(cashier: Cashier) {
        try {
            if (cashier.isActive) {
                await deactivateCashier(cashier.id);
            } else {
                await reactivateCashier(cashier.id);
            }
            // Optimistic update
            setCashiers((prev) =>
                prev.map((c) => c.id === cashier.id ? { ...c, isActive: !c.isActive } : c)
            );
        } catch {
            // Revert on failure by refetching
            fetchCashiers();
        }
    }

    // Don't show table when All Outlets is selected
    if (selectedOutlet === ALL_OUTLETS || selectedOutlet === "") {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-neutral-400">
                Please select an outlet to manage cashiers.
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
        <div>
            {!footer && cashiers.length >= 1 && (
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Cashier Accounts</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-200">Manage POS operator logins.</p>
                    </div>
                    <AddCashierDialog onCreated={fetchCashiers} />
                </div>
            )}

            {cashiers.length === 0 ? (
                <CashierEmptyState onCreated={fetchCashiers} />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-neutral-900 bg-gray-50/60 dark:bg-neutral-800">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Phone Number</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-neutral-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers.map((c) => (
                                <CashierRow
                                    key={c.id}
                                    cashier={c}
                                    onToggleStatus={() => handleToggleStatus(c)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {footer && cashiers.length >= 1 && (
                <div className="flex justify-end pt-4">
                    <AddCashierDialog onCreated={fetchCashiers} />
                </div>
            )}
        </div>
    );
}