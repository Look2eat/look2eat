"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { LoyaltyTerm } from "@/types/loyalty";

export const DEFAULT_LOYALTY_TERMS: LoyaltyTerm[] = [
    { id: "min-purchase", label: "Minimum purchase required.", selected: true },
    { id: "no-clubbing", label: "2 offers cannot be clubbed.", selected: true },
    { id: "no-public-holidays", label: "Not redeemable on public holidays.", selected: false },
    { id: "in-store-only", label: "Reward redeemable in-store only.", selected: false },
    { id: "merchant-final-say", label: "Merchant reserves the right to final say.", selected: false },
];

export default function TermsStep({
    terms,
    setTerms,
    minRedeemAmount,
    setMinRedeemAmount,
}: {
    terms: LoyaltyTerm[];
    setTerms: React.Dispatch<React.SetStateAction<LoyaltyTerm[]>>;
    minRedeemAmount: number;
    setMinRedeemAmount: (v: number) => void;
}) {
    const toggleTerm = (id: string) => {
        setTerms((prev) =>
            prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
        );
    };

    return (
        <div className="space-y-7">
            <div className="space-y-1.5">
                <h3 className="text-base font-semibold">Terms & conditions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose the terms that apply to your loyalty program. These show up on the
                    customer-facing rewards page.
                </p>
            </div>

            <div className="rounded-xl border bg-muted/30 divide-y overflow-hidden">
                {terms
                    .filter((t) => !t.isDynamic)
                    .map((term) => (
                        <button
                            key={term.id}
                            type="button"
                            onClick={() => toggleTerm(term.id)}
                            className={`w-full flex items-center justify-between gap-3 px-5 py-4 bg-background text-left transition-colors ${term.selected ? "ring-1 ring-inset ring-primary" : ""
                                }`}
                        >
                            <span className="font-medium text-sm">{term.label}</span>
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-md border shrink-0 ${term.selected
                                        ? "bg-primary border-primary"
                                        : "bg-background border-input"
                                    }`}
                            >
                                {term.selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                            </span>
                        </button>
                    ))}
            </div>

            <div className="rounded-xl border p-5 space-y-2.5">
                <Label htmlFor="min-redeem-amount" className="text-sm font-medium">
                    Minimum amount required to redeem rewards
                </Label>
                <div className="flex items-center gap-2.5">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <Input
                        id="min-redeem-amount"
                        type="number"
                        min={0}
                        value={minRedeemAmount}
                        onChange={(e) => setMinRedeemAmount(Number(e.target.value))}
                        className="max-w-[140px]"
                    />
                </div>
                {minRedeemAmount > 0 && (
                    <p className="text-sm text-muted-foreground">
                        This will be added to your terms as: &ldquo;Minimum ₹{minRedeemAmount} required
                        to redeem rewards.&rdquo;
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * Builds the terms array sent to the backend (terms: string[] on PATCH
 * /api/v1/brands): each selected term is its own element, plus the
 * dynamic minimum-redeem-amount line appended at the end when set.
 * Sent line-by-line so the backend can store/display them individually.
 */
export function buildTermsArray(terms: LoyaltyTerm[], minRedeemAmount: number): string[] {
    const lines = terms.filter((t) => !t.isDynamic && t.selected).map((t) => t.label);
    if (minRedeemAmount > 0) {
        lines.push(`Minimum ₹${minRedeemAmount} required to redeem rewards.`);
    }
    return lines;
}