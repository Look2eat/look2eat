"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mockData, type RechargeRow } from "../../../lib/mock-settings";

// ─── Wallet SVG Card ──────────────────────────────────────────────────────────
function WalletCard({ balance, customerRate }: { balance: number; customerRate: number }) {
    const customers = Math.floor(balance / customerRate);

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

            {/* Card background */}
            <rect x="0" y="0" width="900" height="200" rx="20" ry="20" fill="url(#walletGrad)" />

            {/* Decorative circles */}
            <circle cx="800" cy="-30" r="160" fill="url(#circleGrad)" clipPath="url(#cardClip)" />
            <circle cx="860" cy="190" r="110" fill="url(#circleGrad)" clipPath="url(#cardClip)" />
            <circle cx="30" cy="170" r="70" fill="url(#circleGrad)" clipPath="url(#cardClip)" />

            {/* Wallet icon (top-left) */}
            <rect x="28" y="24" width="34" height="26" rx="5" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
            <rect x="36" y="20" width="18" height="6" rx="3" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
            <rect x="44" y="31" width="10" height="8" rx="2" fill="white" fillOpacity="0.6" />

            {/* Label */}
            <text x="28" y="88" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.7" fontWeight="500" letterSpacing="1.5">
                WHATSAPP CREDITS
            </text>

            {/* Balance */}
            <text x="28" y="132" fontFamily="Poppins, sans-serif" fontSize="38" fill="white" fontWeight="700" letterSpacing="-0.5">
                ₹{balance.toLocaleString("en-IN")}
            </text>

            {/* Divider */}
            <line x1="28" y1="148" x2="872" y2="148" stroke="white" strokeOpacity="0.2" strokeWidth="1" />

            {/* Footer info */}
            <text x="28" y="172" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.65">
                ≈ {customers.toLocaleString("en-IN")} customers reachable
            </text>
            <text x="872" y="172" fontFamily="Poppins, sans-serif" fontSize="14" fill="white" fillOpacity="0.65" textAnchor="end">
                ₹{customerRate} / customer
            </text>
        </svg>
    );
}

// ─── Recharge History Table ───────────────────────────────────────────────────
function RechargeTable({ rows }: { rows: RechargeRow[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-700 ">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-neutral-900 bg-gray-50/60 dark:bg-neutral-800">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500  dark:text-neutral-200">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500  dark:text-neutral-200">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Customers</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-200">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 dark:hover:bg-neutral-900 ">
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
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "Success"
                                    ? " text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                                    }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === "Success" ? "bg-emerald-500" : "bg-red-400"
                                        }`} />
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

// ─── Recharge Dialog ──────────────────────────────────────────────────────────
function RechargeDialog({ customerRate }: { customerRate: number }) {
    const [amount, setAmount] = useState("");
    const customers = amount ? Math.floor(Number(amount) / customerRate) : 0;
    const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

    return (
        <Dialog>
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
                                        onClick={() => setAmount(String(a))}
                                        className={`rounded-lg border py-2 text-xs font-semibold  ${amount === String(a)
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
                                onChange={(e) => setAmount(e.target.value)}
                                min={1}
                            />
                        </Field>

                        {/* Preview */}
                        {customers > 0 && (
                            <div className="rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
                                <span className="font-semibold">₹{Number(amount).toLocaleString("en-IN")}</span> will cover{" "}
                                <span className="font-semibold">≈ {customers.toLocaleString("en-IN")} customers</span>
                            </div>
                        )}
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit" disabled={!amount || Number(amount) <= 0}>
                            Pay ₹{amount || "0"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export function WalletTab() {
    const w = mockData.wallet;

    return (
        <div className=" space-y-8">
            {/* Wallet Card + stats */}
            <div className="space-y-4">
                <WalletCard balance={w.creditBalance} customerRate={w.customerRate} />
            </div>

            {/* Recharge History */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-semibold text-black dark:text-white ">Recharge History</p>
                    <RechargeDialog customerRate={w.customerRate} />
                </div>
                <RechargeTable rows={w.recharges} />
            </div>

        </div>
    );
}