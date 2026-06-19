"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mockData, type Cashier } from "../../../lib/mock-settings";
import { AddCashierDialog } from "./Addcashierdialog";

const ACCOUNT_PASSWORD = "Owner@999";

function CashierEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6 text-gray-500 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">No cashiers yet</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-200">Add your first cashier to get started.</p>
            <div className="mt-4">
                <AddCashierDialog />
            </div>
        </div>
    );
}

function CashierRow({
    cashier,
    revealed,
    onReveal,
    onDelete,
}: {
    cashier: Cashier;
    revealed: boolean;
    onReveal: () => void;
    onDelete: () => void;
}) {
    return (
        <tr className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 dark:hover:bg-neutral-900 ">
            <td className="px-4 py-3 font-medium text-gray-700 dark:text-neutral-200">{cashier.name}</td>
            <td className="px-4 py-3 text-gray-500 dark:text-neutral-400">@{cashier.username}</td>
            <td className="px-4 py-3">
                {revealed ? (
                    <span className="font-mono text-xs text-gray-700 dark:text-neutral-200">{cashier.password}</span>
                ) : (
                    <button
                        onClick={onReveal}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200  dark:text-neutral-200 dark:hover:bg-neutral-500 dark:bg-neutral-700 "
                    >
                        Reveal
                    </button>
                )}
            </td>
            <td className="px-4 py-3 text-right">
                <button
                    onClick={onDelete}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 dark:hover:bg-red-500/80 dark:hover:text-red-50 hover:bg-red-50 "
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export function TeamTab({ footer = false }: { footer?: boolean }) {
    const [cashiers, setCashiers] = useState<Cashier[]>(mockData.team.cashiers);
    const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
    const [authPassword, setAuthPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [pendingAction, setPendingAction] = useState<{ type: "reveal" | "delete"; id: string } | null>(null);
    const [authOpen, setAuthOpen] = useState(false);

    function triggerAction(type: "reveal" | "delete", id: string) {
        setPendingAction({ type, id });
        setAuthOpen(true);

    }

    function handleAuthConfirm() {
        if (authPassword !== ACCOUNT_PASSWORD) {
            setAuthError("Incorrect password. Please try again.");
            return;
        }
        if (pendingAction?.type === "reveal") {
            setRevealedIds((prev) => ({ ...prev, [pendingAction.id]: true }));
        } else if (pendingAction?.type === "delete") {
            setCashiers((prev) => prev.filter((c) => c.id !== pendingAction.id));
        }
        setAuthPassword("");
        setAuthError("");
        setPendingAction(null);
        setAuthOpen(false);
    }

    function handleAuthClose(open: boolean) {
        setAuthOpen(open);
        if (!open) {
            setAuthPassword("");
            setAuthError("");
        }
    }

    return (
        <div>
            {/* Header */}
            {!footer &&
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Cashier Accounts</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-200">Manage POS operator logins.</p>
                    </div>
                    <AddCashierDialog />
                </div>
            }

            {/* Table or Empty State */}
            {cashiers.length === 0 ? (
                <CashierEmptyState />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-700 ">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-neutral-900 bg-gray-50/60 dark:bg-neutral-800">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Username</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Password</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-neutral-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers.map((c) => (
                                <CashierRow
                                    key={c.id}
                                    cashier={c}
                                    revealed={!!revealedIds[c.id]}
                                    onReveal={() => triggerAction("reveal", c.id)}
                                    onDelete={() => triggerAction("delete", c.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Auth Confirm Dialog */}
            <Dialog open={authOpen} onOpenChange={handleAuthClose}>
                <DialogPopup className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirm Identity</DialogTitle>
                        <DialogDescription>
                            Enter your account password to{" "}
                            {pendingAction?.type === "reveal" ? "reveal the password" : "delete this cashier"}.
                        </DialogDescription>
                    </DialogHeader>
                    <Form className="contents">
                        <DialogPanel className="grid gap-4">
                            <Field>
                                <FieldLabel>Account Password</FieldLabel>
                                <Input
                                    type="password"
                                    placeholder="Your password"
                                    value={authPassword}
                                    onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }}
                                />
                                {authError && <p className="mt-1 text-xs text-red-500">{authError}</p>}
                            </Field>
                        </DialogPanel>
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                            <Button
                                type="button"
                                onClick={handleAuthConfirm}
                                className={pendingAction?.type === "delete" ? "bg-red-600 hover:bg-red-700" : ""}
                            >
                                {pendingAction?.type === "delete" ? "Delete" : "Reveal"}
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogPopup>
            </Dialog>
            {footer && <div className="flex justify-end pt-4"><AddCashierDialog /></div>}
        </div>
    );
}