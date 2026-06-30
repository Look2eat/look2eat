"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { ToggleTheme } from "../ui/toggle-theme";
import { useBrand } from "@/lib/auth/BrandContext";

// REMOVED: useAppStore (Zustand + persist). That store was (a) holding
// hardcoded dummy data ("Burger King" / "Avneet") instead of the real
// logged-in brand, and (b) persisting it to localStorage via zustand's
// `persist` middleware — meaning stale brand info from a PREVIOUS
// session/user could survive a logout and show up for whoever logs in
// next on the same browser. AuthContext fixes both: it's fed by a real,
// signature-verified /api/auth/me call (see lib/auth/verifyToken.ts),
// and it holds nothing in storage — only in-memory React state that's
// naturally cleared on next page load / different login.
//
// NOTE: logoUrl is NOT currently part of the JWT claims returned by
// Express's /auth/me (confirmed: sub, email, role, brandId, phoneNumber,
// name, slug, iat, exp — no logoUrl). Per explicit decision, this always
// shows a wordmark-style fallback (brand initial) rather than a real
// logo for now. If logoUrl becomes available later (e.g. Express adds it
// to /auth/me, or a separate brand-settings endpoint), swap the fallback
// block below for a real <img>.

export default function WelcomeCard() {
    const { user, isLoading } = useAuth();
    const { brand } = useBrand();

    if (isLoading) {
        return (
            <div className="h-44 w-full animate-pulse rounded-[36px] bg-gray-100" />
        );
    }

    if (!user || !brand) {
        // Shouldn't normally happen inside AuthGuard, but render nothing
        // rather than crash if the session check somehow comes back empty.
        return null;
    }

    const brandInitial = brand?.name?.trim().charAt(0).toUpperCase() || "?";

    return (
        <div className="w-66 rounded-[36px] bg-background py-6 px-4 mx-2 mt-6">
            <div className="flex items-start justify-between">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D2033] text-base font-semibold text-white dark:bg-[#FDFEFF] dark:text-[#1D2033]"
                    aria-label={brand?.name}
                    title={brand?.name}
                >
                    {brandInitial}
                </div>

                <ToggleTheme />
            </div>
            <h2 className="mt-2 text-4 font-medium text-[#8D9098]">
                {brand?.name}
            </h2>

            <h1 className="mt-4 text-2xl font-bold leading-[1.05] text-[#1D2033] dark:text-[#FDFEFF] font-poppins">
                Welcome back,
                <br />
                {user.name}!
            </h1>
        </div>
    );
}