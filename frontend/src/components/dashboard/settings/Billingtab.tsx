"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { mockData, type BillingRow } from "../../../lib/mock-settings";

function BillingHistoryTable({ rows }: { rows: BillingRow[] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-100  dark:border-neutral-700 shadow-sm">
            <table className="w-full text-base">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60  dark:border-neutral-700 dark:bg-neutral-900">
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Invoice</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Date</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Amount</th>
                        <th className="px-4 py-2.5 text-left text-base font-semibold text-gray-500 dark:text-neutral-200">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 dark:border-neutral-700 last:border-0 hover:bg-gray-50/40 transition-colors dark:hover:bg-neutral-900 ">
                            <td className="px-4 py-3 font-mono text-sm text-gray-500 dark:text-neutral-300">{row.id}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-neutral-300">{row.date}</td>
                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-neutral-300">{row.amount}</td>
                            <td className="px-4 py-3">
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
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
    const b = mockData.billing;

    return (
        <div className=" space-y-1">
            {/* Current Plan Card */}
            <div className="mb-2 flex items-center justify-between rounded-2xl border border-indigo-100 dark:border-neutral-600 dark:bg-neutral-900 px-5 py-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#48494C] dark:text-neutral-300">Current Plan</p>
                    <p className="mt-1 text-2xl font-bold text-[#1D2033] dark:text-neutral-200">{b.plan}</p>
                    <p className="text-base text-[#48494C] dark:text-neutral-400">{b.amount}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-neutral-300">Next renewal</p>
                    <p className="mt-0.5 text-base font-semibold text-gray-700 dark:text-neutral-200">{b.renewalDate}</p>
                </div>
            </div>

            {/* Billing History */}
            <div className="border-b border-gray-100 dark:border-neutral-900 py-5">
                <p className="mb-3 text-base font-semibold text-gray-800 dark:text-neutral-200">Billing History</p>
                <BillingHistoryTable rows={b.history} />
            </div>

            {/* Cancel Subscription */}
            <div className="flex items-center justify-between py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Cancel Subscription</p>
                    <p className="mt-0.5 text-xs text-gray-400">You&apos;ll retain access until {b.renewalDate}.</p>
                </div>
                <Dialog>
                    <DialogTrigger
                        render={<Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 text-xs dark:border-red-700/20 dark:bg-red-500/70 dark:text-red-50" />}
                    >
                        Cancel Plan
                    </DialogTrigger>
                    <DialogPopup className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Cancel Subscription</DialogTitle>
                            <DialogDescription>
                                You&apos;ll keep access until {b.renewalDate}. After that, your account will be downgraded to the
                                Free plan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost" />}>Keep Plan</DialogClose>
                            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:border-red-600">
                                Cancel Subscription
                            </Button>
                        </DialogFooter>
                    </DialogPopup>
                </Dialog>
            </div>
        </div>
    );
}