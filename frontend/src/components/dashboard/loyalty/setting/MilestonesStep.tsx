"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Milestone } from "@/types/loyalty";

export default function MilestonesStep({
    coinRatioValue,
    setCoinRatioValue,
    pointsExpiryDays,
    setPointsExpiryDays,
    milestones: rawMilestones,
    setMilestones,
}: {
    coinRatioValue: number;
    setCoinRatioValue: (v: number) => void;
    pointsExpiryDays: number;
    setPointsExpiryDays: (v: number) => void;
    milestones: Milestone[];
    setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}) {
    // Guard against API responses that aren't yet normalised — guarantees
    // .map() never throws regardless of what the server returns.
    const milestones: Milestone[] = Array.isArray(rawMilestones) ? rawMilestones : [];

    const [openIndex, setOpenIndex] = useState<number | null>(
        milestones.length > 0 ? 0 : null
    );

    const addMilestone = () => {
        setMilestones((prev) => [
            ...prev,
            { name: "", coinsRequired: 0, cashbackOffer: "" },
        ]);
        setOpenIndex(milestones.length);
    };

    const updateMilestone = (index: number, patch: Partial<Milestone>) => {
        setMilestones((prev) =>
            prev.map((m, i) => (i === index ? { ...m, ...patch } : m))
        );
    };

    const removeMilestone = (index: number) => {
        setMilestones((prev) => prev.filter((_, i) => i !== index));
        setOpenIndex(null);
    };

    return (
        <div className="space-y-7">
            {/* Coin earning ratio */}
            <div className="space-y-1.5">
                <h3 className="text-base font-semibold">How customers earn coins</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Set how many coins a customer earns for every ₹1 they spend.
                </p>
                <div className="space-y-3 mt-2">
                    <div className="rounded-xl border p-5 flex items-center gap-3.5">
                        <span className="text-sm text-muted-foreground shrink-0">₹1 spent =</span>
                        <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={coinRatioValue}
                            onChange={(e) => setCoinRatioValue(Number(e.target.value))}
                            className="max-w-[120px]"
                        />
                        <span className="text-sm text-muted-foreground">coins earned</span>
                    </div>

                    <div className="rounded-xl border p-5 flex items-center gap-3.5">
                        <span className="text-sm text-muted-foreground shrink-0">Points expire after</span>
                        <Input
                            type="number"
                            min={1}
                            value={pointsExpiryDays}
                            onChange={(e) => setPointsExpiryDays(Number(e.target.value))}
                            className="max-w-[120px]"
                        />
                        <span className="text-sm text-muted-foreground">days of inactivity</span>
                    </div>
                </div>
            </div>

            {/* Milestones (rewards) */}
            <div className="space-y-2.5">
                <div className="space-y-1.5">
                    <h3 className="text-base font-semibold">Milestones</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Set the rewards customers unlock as they collect coins.
                    </p>
                </div>

                <div className="space-y-3">
                    {milestones.map((milestone, index) => {
                        const isOpen = openIndex === index;
                        const title = milestone.name.trim() || `Milestone ${index + 1}`;
                        return (
                            <div key={index} className="rounded-xl border overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-muted/30 text-left"
                                >
                                    <span className="space-y-0.5">
                                        <span className="block font-medium text-sm">{title}</span>
                                        <span className="block text-xs text-muted-foreground">
                                            {milestone.coinsRequired || 0} coins required
                                        </span>
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className="px-5 py-4 space-y-4 bg-background">
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor={`milestone-desc-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Description
                                            </Label>
                                            <Textarea
                                                id={`milestone-desc-${index}`}
                                                value={milestone.cashbackOffer}
                                                onChange={(e) =>
                                                    updateMilestone(index, { cashbackOffer: e.target.value })
                                                }
                                                placeholder="e.g. ₹60 cashback on your next order"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor={`milestone-name-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Reward name
                                            </Label>
                                            <Input
                                                id={`milestone-name-${index}`}
                                                value={milestone.name}
                                                onChange={(e) =>
                                                    updateMilestone(index, { name: e.target.value })
                                                }
                                                placeholder="e.g. 60 Cashback"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor={`milestone-coins-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Coins required
                                            </Label>
                                            <Input
                                                id={`milestone-coins-${index}`}
                                                type="number"
                                                min={0}
                                                value={milestone.coinsRequired}
                                                onChange={(e) =>
                                                    updateMilestone(index, {
                                                        coinsRequired: Number(e.target.value),
                                                    })
                                                }
                                                className="max-w-[160px]"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeMilestone(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                                Remove milestone
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Button type="button" variant="outline" onClick={addMilestone} className="w-full">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add milestone
                </Button>
            </div>
        </div>
    );
}