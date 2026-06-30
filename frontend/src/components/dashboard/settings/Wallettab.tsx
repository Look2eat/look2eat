"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCredits, getCreditPurchaseHistory, createCreditOrder, verifyPayment } from "@/services/admin/wallet";
import type { CreditPurchase } from "@/services/admin/wallet";
import { useOutlet, ALL_OUTLETS } from "@/lib/auth/OutletContext";
import Script from "next/script";

// ── Razorpay window types ─────────────────────────────────────────────────────
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => void;
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}
interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: unknown) => void) => void;
}

// ── Cost per customer ─────────────────────────────────────────────────────────
const CUSTOMER_RATE = 2;

type PaymentStatus = "idle" | "creating" | "paying" | "verifying" | "success" | "error";

// ── Blur backdrop rendered behind Razorpay's iframe ──────────────────────────
function RazorpayBackdrop({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483646, // one below Razorpay's iframe
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                pointerEvents: "none",
            }}
        />
    );
}

// ─── Wallet SVG Card ──────────────────────────────────────────────────────────
function WalletCard({
    balance,
    customerRate,
}: {
    balance: number;
    customerRate: number;
}) {
    const customers = Math.max(0, Math.floor(balance / customerRate));

    return (
        <svg
            viewBox="0 0 900 200"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="200"
            role="img"
            aria-label="Wallet balance card"
        >
            <defs>
                <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
                </linearGradient>
                <clipPath id="cardClip">
                    <rect x="0" y="0" width="900" height="200" rx="20" ry="20" />
                </clipPath>
            </defs>

            <rect x="0" y="0" width="900" height="200" rx="20" ry="20" fill="url(#walletGrad)" />
            <circle cx="800" cy="-30" r="160" fill="url(#circleGrad)" clipPath="url(#cardClip)" />
            <circle cx="860" cy="190" r="110" fill="url(#circleGrad)" clipPath="url(#cardClip)" />
            <circle cx="30" cy="170" r="70" fill="url(#circleGrad)" clipPath="url(#cardClip)" />

            <rect x="28" y="24" width="34" height="26" rx="5" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
            <rect x="36" y="20" width="18" height="6" rx="3" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
            <rect x="44" y="31" width="10" height="8" rx="2" fill="white" fillOpacity="0.6" />

            <text x="28" y="88" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.7" fontWeight="500" letterSpacing="1.5">
                WHATSAPP CREDITS
            </text>
            <text x="28" y="132" fontFamily="Poppins, sans-serif" fontSize="38" fill="white" fontWeight="700" letterSpacing="-0.5">
                {balance < 0 ? `- ₹${Math.abs(balance).toLocaleString("en-IN")}` : `₹${balance.toLocaleString("en-IN")}`}
            </text>
            <line x1="28" y1="148" x2="872" y2="148" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
            {balance < 0 ? (
                <>
                    <text x="28" y="168" fontFamily="Poppins, sans-serif" fontSize="13" fill="#fca5a5" fontWeight="600">
                        ⚠ Please recharge - service stops at - ₹100 balance
                    </text>
                    <text x="872" y="168" fontFamily="Poppins, sans-serif" fontSize="13" fill="white" textAnchor="end">
                        ₹{customerRate} / customer
                    </text>
                </>
            ) : (
                <>
                    <text x="28" y="172" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.65">
                        ≈ {customers.toLocaleString("en-IN")} customers reachable
                    </text>
                    <text x="872" y="172" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.65" textAnchor="end">
                        ₹{customerRate} / customer
                    </text>
                </>
            )}
        </svg>
    );
}

// ─── Recharge History Table ───────────────────────────────────────────────────
interface RechargeRow {
    id: string;
    date: string;
    amount: number;
    customers: number;
    status: "PAID" | "Failed" | "Success" | "PENDING";
}

function mapPurchaseToRow(p: CreditPurchase, customerRate: number): RechargeRow {
    return {
        id: p.id.slice(0, 8).toUpperCase(),
        date: new Date(p.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        amount: p.amount / 100,
        customers: Math.floor((p.amount / 100) / customerRate),
        status: p.status,
    };
}

function RechargeTable({ rows }: { rows: RechargeRow[] }) {
    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 dark:border-neutral-700 px-4 py-10 text-center text-sm dark:text-gray-200 text-neutral-800">
                No recharge history yet.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-700">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-neutral-900 bg-gray-50/60 dark:bg-neutral-800">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Customers</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 dark:hover:bg-neutral-900">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-neutral-200">{row.id}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-neutral-200">{row.date}</td>
                            <td className="px-4 py-3 font-semibold text-black dark:text-white">₹{row.amount.toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-neutral-200">
                                <span className="inline-flex items-center gap-1">
                                    <span className="text-indigo-500">≈</span>
                                    {row.customers.toLocaleString("en-IN")} customers
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "PAID"
                                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : row.status === "PENDING"
                                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300"
                                        : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                                    }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === "PAID" ? "bg-emerald-500"
                                        : row.status === "PENDING" ? "bg-amber-400"
                                            : "bg-red-400"
                                        }`} />
                                    {row.status === "PAID" ? "Success" : row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Recharge Dialog ──────────────────────────────────────────────────────────
function RechargeDialog({
    customerRate,
    onSuccess,
}: {
    customerRate: number;
    onSuccess?: () => void;
}) {
    const { selectedOutlet } = useOutlet();
    const outletId = selectedOutlet === ALL_OUTLETS || !selectedOutlet ? null : selectedOutlet;

    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<PaymentStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const credits = amount ? Number(amount) : 0;
    const customers = credits ? Math.floor(credits / customerRate) : 0;
    const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

    // Only "creating" blocks the dialog from closing —
    // "paying" and "verifying" happen after we've already closed it
    const isProcessing = status === "creating";
    const showBackdrop = status === "paying" || status === "verifying";

    const statusLabel: Record<PaymentStatus, string> = {
        idle: `Pay ₹${amount || "0"}`,
        creating: "Creating order...",
        paying: "Waiting for payment...",
        verifying: "Verifying...",
        success: "✓ Payment successful!",
        error: "Try again",
    };

    const handlePay = async () => {
        if (!credits || credits <= 0 || !outletId) return;

        try {
            // Step 1 — create order via backend
            setStatus("creating");
            const orderRes = await createCreditOrder(outletId, credits);
            const { orderId, amount: paise, currency, keyId } = orderRes.data;

            // Step 2 — close our dialog FIRST so page is visible behind Razorpay
            setOpen(false);
            setStatus("paying");

            await new Promise<void>((resolve, reject) => {
                const rzp = new window.Razorpay({
                    key: keyId,
                    amount: paise,
                    currency,
                    name: "Zuplin",
                    description: "WhatsApp Credits Recharge",
                    order_id: orderId,
                    theme: { color: "#4f46e5" },
                    handler: async (response) => {
                        // Step 3 — verify signature via backend
                        try {
                            setStatus("verifying");
                            await verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            setStatus("success");
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            // User dismissed without paying — reset cleanly
                            setStatus("idle");
                            resolve();
                        },
                    },
                });
                rzp.on("payment.failed", (res) => {
                    reject(new Error(
                        (res as { error?: { description?: string } }).error?.description || "Payment failed"
                    ));
                });
                rzp.open();
            });

        } catch (err) {
            setErrorMsg((err as Error).message);
            setStatus("error");
            // Reopen dialog so user can see the error
            setOpen(true);
        }
    };

    // When success — refresh data then reset state
    useEffect(() => {
        if (status === "success") {
            onSuccess?.();
            const t = setTimeout(() => {
                setAmount("");
                setStatus("idle");
            }, 1800);
            return () => clearTimeout(t);
        }
    }, [status, onSuccess]);

    const handleOpenChange = (v: boolean) => {
        // Block manual close only while creating order
        if (isProcessing) return;
        setOpen(v);
        if (!v) {
            setAmount("");
            setStatus("idle");
            setErrorMsg("");
        }
    };

    return (
        <>
            {/* Sits behind Razorpay's iframe (z-index max-int), blurs the page */}
            <RazorpayBackdrop visible={showBackdrop} />
            <Script
                id="razorpay-checkout"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger render={<Button className="text-xs gap-1.5" />}>
                    + Add Credits
                </DialogTrigger>
                <DialogPopup className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Recharge WhatsApp Credits</DialogTitle>
                        <DialogDescription>
                            Credits are used to send WhatsApp messages. ₹{customerRate} per customer reached.
                        </DialogDescription>
                    </DialogHeader>
                    <Form className="contents">
                        <DialogPanel className="grid gap-4">
                            {/* Quick amounts */}
                            <div>
                                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-neutral-200">Quick Select</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {QUICK_AMOUNTS.map((a) => (
                                        <button
                                            key={a}
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => { setAmount(String(a)); setStatus("idle"); setErrorMsg(""); }}
                                            className={`rounded-lg border py-2 text-xs font-semibold ${amount === String(a)
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                                : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                                                }`}
                                        >
                                            ₹{a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Field>
                                <FieldLabel>Custom Amount (₹)</FieldLabel>
                                <Input
                                    type="number"
                                    placeholder="e.g. 1500"
                                    value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                                    min={1}
                                    disabled={isProcessing}
                                />
                            </Field>

                            {/* Preview — only when idle */}
                            {customers > 0 && status === "idle" && (
                                <div className="rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
                                    <span className="font-semibold">₹{Number(amount).toLocaleString("en-IN")}</span> will cover{" "}
                                    <span className="font-semibold">≈ {customers.toLocaleString("en-IN")} customers</span>
                                </div>
                            )}

                            {/* Creating order spinner — shown while dialog is still open */}
                            {status === "creating" && (
                                <div className="rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-600 flex items-center gap-2">
                                    <span className="inline-block h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                                    {statusLabel["creating"]}
                                </div>
                            )}

                            {/* Success — shown if dialog reopens after payment */}
                            {status === "success" && (
                                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700 font-medium">
                                    ✓ ₹{credits.toLocaleString("en-IN")} credits added successfully!
                                </div>
                            )}

                            {/* Error */}
                            {status === "error" && errorMsg && (
                                <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
                                    {errorMsg}
                                </div>
                            )}

                            {/* No outlet warning */}
                            {!outletId && (
                                <p className="text-xs text-amber-600">Select a specific outlet to recharge.</p>
                            )}
                        </DialogPanel>
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost" disabled={isProcessing} />}>Cancel</DialogClose>
                            <Button
                                type="button"
                                onClick={handlePay}
                                disabled={!amount || credits <= 0 || isProcessing || !outletId || status === "success"}
                                className={status === "success" ? "bg-emerald-600 hover:bg-emerald-600" : ""}
                            >
                                {statusLabel[status]}
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogPopup>
            </Dialog>
        </>
    );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function WalletSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-[200px] rounded-2xl bg-gray-200 dark:bg-neutral-800" />
            <div className="space-y-3">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-neutral-800" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-neutral-800" />
                ))}
            </div>
        </div>
    );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export function WalletTab() {
    const { selectedOutlet } = useOutlet();
    const outletId = selectedOutlet === ALL_OUTLETS || !selectedOutlet ? null : selectedOutlet;

    const [balance, setBalance] = useState<number>(0);
    const [rows, setRows] = useState<RechargeRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        if (!outletId) return;
        setLoading(true);
        setError(null);
        try {
            const [creditsRes, historyRes] = await Promise.all([
                getCredits(outletId),
                getCreditPurchaseHistory(outletId),
            ]);
            setBalance(creditsRes.data.balance);
            setRows(historyRes.data.map((p) => mapPurchaseToRow(p, CUSTOMER_RATE)));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [outletId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    if (!outletId) {
        return (
            <div className="rounded-2xl border border-gray-100 dark:border-neutral-700 px-4 py-10 text-center text-sm text-gray-400">
                Select a specific outlet to view wallet details.
            </div>
        );
    }

    if (loading) return <WalletSkeleton />;

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <WalletCard balance={balance} customerRate={CUSTOMER_RATE} />
            </div>

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-semibold text-black dark:text-white">Recharge History</p>
                    <RechargeDialog customerRate={CUSTOMER_RATE} onSuccess={fetchAll} />
                </div>
                <RechargeTable rows={rows} />
            </div>
        </div>
    );
}