"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { QRCode } from "@/components/kibo-ui/qr-code";

interface CashierPanelCardProps {
    cashierLink: string;
}

export default function CashierPanelCard({
    cashierLink,
}: CashierPanelCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(cashierLink);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="w-full rounded-3xl bg-white dark:bg-[#121214] p-5 ">
            {/* Heading */}
            <h2 className="text-center text-lg md:text-xl font-semibold leading-snug">
                To open cashier panel on another device scan QR code or copy the
                cashier link
            </h2>

            {/* Link */}
            <div className="mt-6 flex items-center justify-center gap-2">
                <a
                    href={cashierLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-600 dark:text-blue-500 underline text-sm md:text-base max-w-[220px] sm:max-w-full"
                >
                    {cashierLink}
                </a>

                <button
                    onClick={handleCopy}
                    className="flex-shrink-0 rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-500/40 transition"
                    aria-label="Copy cashier link"
                >
                    {copied ? (
                        <Check size={20} className="text-green-600" />
                    ) : (
                        <Copy size={20} className="text-blue-600 dark:text-white" />
                    )}
                </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-300" />
                <span className="font-semibold text-lg">OR</span>
                <div className="h-px flex-1 bg-neutral-300" />
            </div>

            {/* QR */}
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 dark:text-neutral-300 text-lg mb-5">Scan QR</p>

                <div className="rounded-xl bg-white p-3">
                    <QRCode data={cashierLink} background="#121214" foreground="#121214" />
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={() => window.open(cashierLink, "_blank")}
                className="mt-8 w-full rounded-2xl bg-[#0C2D83] py-4 text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
                Open Cashier Panel
                <ExternalLink size={18} />
            </button>
        </div>
    );
}