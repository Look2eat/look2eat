"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Stepper,
    StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperSeparator,
    StepperTrigger,
} from "@/components/reui/stepper";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { GripVertical, Check, Loader2 } from "lucide-react";

/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 */

/** Shape returned by GET /api/v1/feedback/settings (via our Next.js proxy) */
interface ApiCategory {
    name: string;
    enabled: boolean;
    displayOrder: number;
}

interface ApiSettings {
    id: string;
    brandId: string;
    isFeedbackEnabled: boolean;
    categories: ApiCategory[];
    isRewardEnabled: boolean;
    rewardCoins: number;
    feedbackTrigger: "IMMEDIATE" | "DELAY";
    delayHours: number | null;
    notifyManager: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ApiGetResponse {
    data: {
        configured: boolean;
        settings: ApiSettings;
    };
}

/** Internal component state — decoupled from the wire format */
interface FeedbackCategory {
    /** Stable UI key — just the display name since the API has no separate id */
    id: string;
    label: string;
    enabled: boolean;
    displayOrder: number;
}

type TimingOption = "IMMEDIATE" | "DELAY";

/** Shape we POST/PUT back to the API */
interface ApiPutBody {
    isFeedbackEnabled: boolean;
    categories: ApiCategory[];
    isRewardEnabled: boolean;
    rewardCoins: number;
    feedbackTrigger: TimingOption;
    delayHours: number | null;
    notifyManager: boolean;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function apiToCategories(apiCats: ApiCategory[]): FeedbackCategory[] {
    return [...apiCats]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((c) => ({
            id: c.name.toLowerCase().replace(/\s+/g, "-"),
            label: c.name,
            enabled: c.enabled,
            displayOrder: c.displayOrder,
        }));
}

function categoriesToApi(cats: FeedbackCategory[]): ApiCategory[] {
    return cats.map((c, i) => ({
        name: c.label,
        enabled: c.enabled,
        displayOrder: i + 1, // re-derive order from current array index after DnD
    }));
}

// ---------------------------------------------------------------------------
// Fallback defaults (used only when the API returns unconfigured)
// ---------------------------------------------------------------------------

const DEFAULT_CATEGORIES: FeedbackCategory[] = [
    { id: "food", label: "Food", enabled: true, displayOrder: 1 },
    { id: "service", label: "Service", enabled: true, displayOrder: 2 },
    { id: "ambience", label: "Ambience", enabled: true, displayOrder: 3 },
    { id: "cleanliness", label: "Cleanliness", enabled: true, displayOrder: 4 },
    { id: "value", label: "Value for Money", enabled: true, displayOrder: 5 },
];

// ---------------------------------------------------------------------------
// API calls (routed through the Next.js BFF proxy that attaches the JWT)
// ---------------------------------------------------------------------------

async function fetchFeedbackSettings(): Promise<{
    categories: FeedbackCategory[];
    isRewardEnabled: boolean;
    rewardCoins: number;
    feedbackTrigger: TimingOption;
    delayHours: number | null;
    notifyManager: boolean;
}> {
    const res = await fetch("/api/proxy/feedback/settings", { method: "GET" });
    if (!res.ok) throw new Error(`GET feedback/settings failed: ${res.status}`);

    const json: ApiGetResponse = await res.json();
    const s = json.data.settings;

    return {
        categories: s?.categories ? apiToCategories(s.categories) : DEFAULT_CATEGORIES,
        isRewardEnabled: s?.isRewardEnabled ?? true,
        rewardCoins: s?.rewardCoins ?? 50,
        feedbackTrigger: s?.feedbackTrigger ?? "IMMEDIATE",
        delayHours: s?.delayHours ?? null,
        notifyManager: s?.notifyManager ?? true,
    };
}

async function saveFeedbackSettings(body: ApiPutBody): Promise<void> {
    const res = await fetch("/api/proxy/feedback/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT feedback/settings failed: ${res.status}`);
}

/**
 * ---------------------------------------------------------------------------
 * Step definitions
 * ---------------------------------------------------------------------------
 */
const STEPS = [
    { step: 1, label: "Categories" },
    { step: 2, label: "Reward" },
    { step: 3, label: "Timing" },
    { step: 4, label: "Alerts" },
] as const;

interface FeedbackSettingsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactElement;
    /** Called after a successful save so the parent can refetch dashboard data */
    onSaved?: () => void;
}

/**
 * FeedbackSettingsDialog
 *
 * Usage:
 * 1. Self-contained:        <FeedbackSettingsDialog />
 * 2. With your own trigger: <FeedbackSettingsDialog trigger={<Button>Edit Feedback</Button>} />
 * 3. Fully controlled:      <FeedbackSettingsDialog open={open} onOpenChange={setOpen} />
 */
export default function FeedbackSettingsDialog({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    trigger,
    onSaved,
}: FeedbackSettingsDialogProps = {}) {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isControlled ? openProp : internalOpen;
    const setOpen = isControlled ? onOpenChangeProp! : setInternalOpen;

    const [currentStep, setCurrentStep] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1 — categories (order + enabled flags)
    const [categories, setCategories] = useState<FeedbackCategory[]>(DEFAULT_CATEGORIES);

    // Step 2 — reward
    const [isRewardEnabled, setIsRewardEnabled] = useState(true);
    const [rewardCoins, setRewardCoins] = useState(50);

    // Step 3 — timing
    const [feedbackTrigger, setFeedbackTrigger] = useState<TimingOption>("IMMEDIATE");
    const [delayHours, setDelayHours] = useState<number>(2);

    // Step 4 — alerts
    const [notifyManager, setNotifyManager] = useState(true);

    // Fetch settings whenever the dialog is opened
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        setCurrentStep(1);

        fetchFeedbackSettings()
            .then((data) => {
                if (cancelled) return;
                setCategories(data.categories);
                setIsRewardEnabled(data.isRewardEnabled);
                setRewardCoins(data.rewardCoins);
                setFeedbackTrigger(data.feedbackTrigger);
                setDelayHours(data.delayHours ?? 2);
                setNotifyManager(data.notifyManager);
            })
            .catch(() => {
                if (!cancelled) setError("Couldn't load feedback settings. Try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await saveFeedbackSettings({
                isFeedbackEnabled: true,
                categories: categoriesToApi(categories),
                isRewardEnabled,
                rewardCoins,
                feedbackTrigger,
                delayHours: feedbackTrigger === "DELAY" ? delayHours : null,
                notifyManager,
            });
            setOpen(false);
            onSaved?.();
        } catch {
            setError("Couldn't save your changes. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const isLastStep = currentStep === STEPS.length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? (
                <DialogTrigger render={trigger} />
            ) : (
                <DialogTrigger render={<Button variant="outline" />}>
                    Edit feedback settings
                </DialogTrigger>
            )}
            <DialogPopup className="font-poppins sm:max-w-2xl w-full p-0 overflow-hidden">
                <DialogHeader className="px-8 pt-8 pb-2">
                    <DialogTitle className="text-xl font-semibold">Feedback settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Configure how your business collects and rewards customer feedback.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 px-8 py-20">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading your settings…</p>
                    </div>
                ) : (
                    <Stepper value={currentStep} onValueChange={setCurrentStep} className="space-y-0">
                        <StepperNav className="px-8 pt-4 pb-2">
                            {STEPS.map(({ step, label }) => (
                                <StepperItem key={step} step={step}>
                                    <StepperTrigger asChild>
                                        <div className="flex items-center gap-2.5">
                                            <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">
                                                {step}
                                            </StepperIndicator>
                                            <span className="hidden sm:inline text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-medium">
                                                {label}
                                            </span>
                                        </div>
                                    </StepperTrigger>
                                    {STEPS.length > step && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>

                        <StepperPanel className="min-h-[400px] px-8 py-6">
                            <StepperContent value={1}>
                                <CategoryStep categories={categories} setCategories={setCategories} />
                            </StepperContent>
                            <StepperContent value={2}>
                                <RewardStep
                                    enabled={isRewardEnabled}
                                    setEnabled={setIsRewardEnabled}
                                    points={rewardCoins}
                                    setPoints={setRewardCoins}
                                />
                            </StepperContent>
                            <StepperContent value={3}>
                                <TimingStep
                                    timing={feedbackTrigger}
                                    setTiming={setFeedbackTrigger}
                                    delayHours={delayHours}
                                    setDelayHours={setDelayHours}
                                />
                            </StepperContent>
                            <StepperContent value={4}>
                                <AlertStep enabled={notifyManager} setEnabled={setNotifyManager} />
                            </StepperContent>
                        </StepperPanel>

                        {error && <p className="text-sm text-destructive px-8 pb-2">{error}</p>}

                        <DialogFooter className="flex items-center justify-between gap-2.5 sm:justify-between px-8 py-6 border-t bg-muted/30">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep((prev) => prev - 1)}
                                disabled={currentStep === 1 || saving}
                            >
                                Previous
                            </Button>
                            {isLastStep ? (
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Saving…
                                        </>
                                    ) : (
                                        "Save settings"
                                    )}
                                </Button>
                            ) : (
                                <Button onClick={() => setCurrentStep((prev) => prev + 1)}>Next</Button>
                            )}
                        </DialogFooter>
                    </Stepper>
                )}
            </DialogPopup>
        </Dialog>
    );
}

/**
 * ---------------------------------------------------------------------------
 * Step 1 — Feedback categories, drag to reorder
 * ---------------------------------------------------------------------------
 */
function CategoryStep({
    categories,
    setCategories,
}: {
    categories: FeedbackCategory[];
    setCategories: React.Dispatch<React.SetStateAction<FeedbackCategory[]>>;
}) {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [newLabel, setNewLabel] = useState("");
    const dragCounter = useRef(0);

    const handleDragStart = (id: string) => (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) {
            e.preventDefault();
            return;
        }
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (id: string) => (e: React.DragEvent) => {
        e.preventDefault();
        if (id !== draggedId) setOverId(id);
    };

    const handleDrop = (id: string) => (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedId || draggedId === id) {
            setDraggedId(null);
            setOverId(null);
            return;
        }
        setCategories((prev) => {
            const next = [...prev];
            const fromIndex = next.findIndex((c) => c.id === draggedId);
            const toIndex = next.findIndex((c) => c.id === id);
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
        setDraggedId(null);
        setOverId(null);
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setOverId(null);
    };

    const addCategory = () => {
        const label = newLabel.trim();
        if (!label) return;
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        setCategories((prev) => [...prev, { id, label, enabled: true, displayOrder: prev.length + 1 }]);
        setNewLabel("");
    };

    const toggleCategory = (id: string) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
        );
    };

    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <h3 className="text-base font-semibold">Choose the categories for feedback rating</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    After your customer gives their rating, they&apos;ll be asked to choose the reason
                    from these categories. Drag to set the order they&apos;ll see.
                </p>
            </div>

            <div className="rounded-xl border bg-muted/30 divide-y overflow-hidden">
                {categories.map((cat) => {
                    const isDragging = draggedId === cat.id;
                    const isOver = overId === cat.id && draggedId !== cat.id;
                    return (
                        <div
                            key={cat.id}
                            draggable
                            onDragStart={handleDragStart(cat.id)}
                            onDragOver={handleDragOver(cat.id)}
                            onDrop={handleDrop(cat.id)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between gap-3 px-5 py-4 bg-background transition-colors cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : ""
                                } ${isOver ? "bg-primary/5" : ""}`}
                        >
                            <div className="flex items-center gap-3.5">
                                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span
                                    className={`font-medium text-sm ${cat.enabled ? "" : "text-muted-foreground line-through"
                                        }`}
                                >
                                    {cat.label}
                                </span>
                            </div>
                            <button
                                type="button"
                                aria-pressed={cat.enabled}
                                aria-label={`Toggle ${cat.label}`}
                                draggable={false}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleCategory(cat.id);
                                }}
                                className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors cursor-pointer ${cat.enabled
                                        ? "bg-primary border-primary"
                                        : "bg-background border-input hover:border-primary/50"
                                    }`}
                            >
                                {cat.enabled && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2.5">
                <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Add a category, e.g. Packaging"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addCategory();
                        }
                    }}
                />
                <Button type="button" variant="outline" onClick={addCategory}>
                    + Add
                </Button>
            </div>
        </div>
    );
}

/**
 * ---------------------------------------------------------------------------
 * Step 2 — Feedback reward
 * ---------------------------------------------------------------------------
 */
function RewardStep({
    enabled,
    setEnabled,
    points,
    setPoints,
}: {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
    points: number;
    setPoints: (v: number) => void;
}) {
    return (
        <div className="space-y-5">
            <h3 className="text-base font-semibold leading-snug">
                Now, let&apos;s give your customers a reward for sharing feedback
            </h3>

            <div className="rounded-xl border p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="font-medium text-sm">Feedback reward</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Reward your customers when they share feedback with you.
                    </p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            {enabled && (
                <div className="rounded-xl border p-5 space-y-2.5">
                    <Label htmlFor="reward-points" className="text-sm font-medium">
                        Bonus points
                    </Label>
                    <div className="flex items-center gap-2.5">
                        <Input
                            id="reward-points"
                            type="number"
                            min={0}
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            className="max-w-[140px]"
                        />
                        <span className="text-sm text-muted-foreground">points per feedback</span>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * ---------------------------------------------------------------------------
 * Step 3 — Feedback timing
 * ---------------------------------------------------------------------------
 */
function TimingStep({
    timing,
    setTiming,
    delayHours,
    setDelayHours,
}: {
    timing: TimingOption;
    setTiming: (v: TimingOption) => void;
    delayHours: number;
    setDelayHours: (v: number) => void;
}) {
    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <h3 className="text-base font-semibold">Decide when you want to ask for feedback</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Customers can only provide feedback for up to 5 days after the feedback
                    communication is sent.
                </p>
            </div>

            <RadioGroup
                value={timing}
                onValueChange={(v) => setTiming(v as TimingOption)}
                className="space-y-3"
            >
                <Label
                    className={`flex items-start gap-3.5 rounded-xl border p-5 cursor-pointer transition-colors ${timing === "IMMEDIATE" ? "border-primary bg-primary/5" : ""
                        }`}
                >
                    <Radio value="IMMEDIATE" className="mt-1" />
                    <span className="space-y-1">
                        <span className="block font-medium text-sm">Immediately with purchase</span>
                        <span className="block text-sm text-muted-foreground leading-relaxed">
                            Select this if your customer has experienced your product or service by the
                            time they pay the bill.
                        </span>
                    </span>
                </Label>

                <Label
                    className={`flex items-start gap-3.5 rounded-xl border p-5 cursor-pointer transition-colors ${timing === "DELAY" ? "border-primary bg-primary/5" : ""
                        }`}
                >
                    <Radio value="DELAY" className="mt-1" />
                    <span className="space-y-1 flex-1">
                        <span className="block font-medium text-sm">After a delay</span>
                        <span className="block text-sm text-muted-foreground leading-relaxed">
                            Select this if your customer pays first and then experiences your product or
                            service.
                        </span>

                        {timing === "DELAY" && (
                            <span
                                className="block pt-3 mt-2 border-t"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Label htmlFor="delay-hours" className="text-sm font-medium block mb-2">
                                    Send feedback request after
                                </Label>
                                <span className="flex items-center gap-2.5">
                                    <Input
                                        id="delay-hours"
                                        type="number"
                                        min={1}
                                        max={120}
                                        value={delayHours}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => setDelayHours(Number(e.target.value))}
                                        className="max-w-[120px]"
                                    />
                                    <span className="text-sm text-muted-foreground">hours</span>
                                </span>
                            </span>
                        )}
                    </span>
                </Label>
            </RadioGroup>
        </div>
    );
}

/**
 * ---------------------------------------------------------------------------
 * Step 4 — Negative feedback alert
 * ---------------------------------------------------------------------------
 */
function AlertStep({
    enabled,
    setEnabled,
}: {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
}) {
    return (
        <div className="space-y-5">
            <h3 className="text-base font-semibold">Negative feedback alert</h3>

            <div className="rounded-xl border p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="font-medium text-sm">Notify the outlet manager</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Resolving feedback in real time improves customer experience and prevents
                        customers from sharing a negative review online. You can change who gets
                        notified in outlet settings.
                    </p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} className="shrink-0" />
            </div>
        </div>
    );
}