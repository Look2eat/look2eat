"use client";

import { usePathname } from "next/navigation";
import { useOutlet } from "@/lib/auth/OutletContext";

const ALL_OUTLETS = "all";

const PAGE_LABELS: Record<string, string> = {
    "dashboard": "Dashboard",
    "feedback": "Feedback",
    "loyalty": "Loyalty",
    "cashier-panel": "Cashier Panel"
};

export default function PageHeading() {
    const pathname = usePathname();
    const { selectedOutlet, outlets } = useOutlet();

    // Derive page label from last URL segment
    const segment = pathname.split("/").filter(Boolean).pop() ?? "";
    const pageLabel = PAGE_LABELS[segment] ?? "";

    // Derive outlet name
    const isAll = selectedOutlet === ALL_OUTLETS || selectedOutlet === "";
    const currentOutlet = outlets.find((o) => o.id === selectedOutlet);
    const outletName = isAll ? "All Outlets" : (currentOutlet?.name ?? "");

    return (
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#1D2033] dark:text-[#FDFEFF]">
            {pageLabel} — {outletName}
        </h1>
    );
}