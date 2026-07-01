"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useBrand } from "@/lib/auth/BrandContext";
import { Milestone, LoyaltyTerm, LoyaltyTheme } from "@/types/loyalty";
import {
    getMilestones,
    syncMilestones,
    setCoinRatio,
    uploadBrandImages,
    updateBrandDetails,
    urlToFile,
} from "@/services/admin/loyalty";

import ThemeStep from "./ThemeStep";
import MilestonesStep from "./MilestonesStep";
import TermsStep, { DEFAULT_LOYALTY_TERMS, buildTermsText } from "./TermsStep";

const STEPS = [
    { step: 1, label: "Theme" },
    { step: 2, label: "Milestones" },
    { step: 3, label: "Terms" },
] as const;

const DEFAULT_THEME: LoyaltyTheme = {
    logoFile: null,
    logoPreview: null,
    bannerFile: null,
    bannerPreview: null,
    primaryColor: "#F43F5E",
};

interface LoyaltySettingsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactElement;
    /** Called after a successful save so parent views can refresh their data. */
    onSaved?: () => void;
}

/**
 * LoyaltySettingsDialog
 *
 * Usage:
 * 1. Self-contained:        <LoyaltySettingsDialog />
 * 2. With your own trigger: <LoyaltySettingsDialog trigger={<Button>Edit Loyalty</Button>} />
 * 3. Fully controlled:      <LoyaltySettingsDialog open={open} onOpenChange={setOpen} />
 */
export default function LoyaltySettingsDialog({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    trigger,
    onSaved,
}: LoyaltySettingsDialogProps = {}) {
    // Loyalty settings are brand-level — use BrandContext regardless of which
    // outlet is currently selected in the dashboard.
    const { brand, refresh: refreshBrand } = useBrand();
    const brandId = brand?.id ?? "";

    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isControlled ? openProp : internalOpen;
    const setOpen = isControlled ? onOpenChangeProp! : setInternalOpen;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1 — theme
    const [theme, setTheme] = useState<LoyaltyTheme>(DEFAULT_THEME);

    // Step 2 — coin ratio, points expiry + milestones
    const [coinRatioValue, setCoinRatioValue] = useState(brand?.coinRatioValue ?? 1);
    const [pointsExpiryDays, setPointsExpiryDays] = useState(365);
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    // Step 3 — terms
    const [terms, setTerms] = useState<LoyaltyTerm[]>(DEFAULT_LOYALTY_TERMS);
    const [minRedeemAmount, setMinRedeemAmount] = useState(0);

    useEffect(() => {
        if (!open || !brandId) return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        setCurrentStep(1);

        // Seed coin ratio from what BrandContext already holds so the field
        // isn't blank while milestones load.
        if (brand?.coinRatioValue) setCoinRatioValue(brand.coinRatioValue);

        getMilestones(brandId)
            .then((data) => {
                if (cancelled) return;
                setMilestones(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setError("Couldn't load milestones. Try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, brandId]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            // Theme — upload images, save brand color
            if (theme.logoFile || theme.bannerFile || theme.bannerPreview) {
                let bannerFile = theme.bannerFile;
                if (!bannerFile && theme.bannerPreview) {
                    bannerFile = await urlToFile(theme.bannerPreview, "loyalty-banner.jpg");
                }
                await uploadBrandImages({ logo: theme.logoFile, banner: bannerFile });
            }

            // Milestones + coin ratio
            await syncMilestones(brandId, milestones);
            await setCoinRatio(brandId, coinRatioValue);

            // Terms, brand color, points expiry
            await updateBrandDetails({
                termsText: buildTermsText(terms, minRedeemAmount),
                primaryColor: theme.primaryColor,
                pointsExpiryDays,
            });

            // Refresh BrandContext so logo, banner, coinRatio, color are
            // up to date across the dashboard without a full page reload.
            await refreshBrand();

            onSaved?.();
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't save your changes. Try again.");
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
                    Edit loyalty settings
                </DialogTrigger>
            )}
            <DialogPopup className="font-poppins sm:max-w-2xl w-full p-0 overflow-hidden">
                <DialogHeader className="px-8 pt-8 pb-2">
                    <DialogTitle className="text-2xl font-semibold">Loyalty settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Set up your loyalty program&apos;s theme, rewards, and terms.
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

                        <StepperPanel className="min-h-[400px] max-h-[60vh] overflow-y-auto px-8 py-6">
                            <StepperContent value={1}>
                                <ThemeStep theme={theme} setTheme={setTheme} />
                            </StepperContent>
                            <StepperContent value={2}>
                                <MilestonesStep
                                    coinRatioValue={coinRatioValue}
                                    setCoinRatioValue={setCoinRatioValue}
                                    pointsExpiryDays={pointsExpiryDays}
                                    setPointsExpiryDays={setPointsExpiryDays}
                                    milestones={milestones}
                                    setMilestones={setMilestones}
                                />
                            </StepperContent>
                            <StepperContent value={3}>
                                <TermsStep
                                    terms={terms}
                                    setTerms={setTerms}
                                    minRedeemAmount={minRedeemAmount}
                                    setMinRedeemAmount={setMinRedeemAmount}
                                />
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