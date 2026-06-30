"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInPage } from "@/components/ui/sign-in";
import { loginCashier } from "@/services/cashier/auth";

/**
 * Cashier login page — used by cashier staff, not admin owners.
 *
 * outletId is derived from the `next` query param automatically:
 *   /cashier/login?next=/cashier/76fba2dd-...
 *                                ↑ outletId extracted from this segment
 *
 * The cashier only types phone + password — outletId is never shown
 * in the UI, since it's already encoded in the URL they arrived from
 * (either by scanning a QR code or clicking a link from the dashboard).
 *
 * After successful login, redirects back to the original `next` URL
 * so the cashier lands on their own outlet's panel, not a generic page.
 */

function extractOutletId(nextParam: string | null): string | null {
    if (!nextParam) return null;
    // next = "/cashier/76fba2dd-6360-46d2-8324-42dcf216402f"
    const parts = nextParam.split("/").filter(Boolean);
    // parts = ["cashier", "76fba2dd-..."]
    return parts[1] ?? null;
}

export default function CashierLoginClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get("next");
    const outletId = extractOutletId(nextUrl);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        if (!outletId) {
            setError(
                "No outlet ID found in the URL. Please use the link provided by your manager.",
            );
            return;
        }

        setError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as {
            phone: string;
            password: string;
        };

        try {
            await loginCashier({
                phoneNumber: data.phone,
                password: data.password,
                outletId,
            });

            // Redirect back to the exact outlet panel URL they came from.
            // router.refresh() ensures the cashier panel's Server Components
            // re-read the new cookie.
            router.push(nextUrl ?? `/cashier/${outletId}`);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Login failed. Please try again.",
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background text-foreground">
            {error && (
                <div
                    role="alert"
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive shadow-sm"
                >
                    {error}
                </div>
            )}
            <SignInPage
                title={
                    <span className="font-light text-foreground tracking-tighter">
                        Cashier Sign In
                    </span>
                }
                description="Enter your credentials to access the cashier panel."
                onSignIn={handleSignIn}
            />
        </div>
    );
}