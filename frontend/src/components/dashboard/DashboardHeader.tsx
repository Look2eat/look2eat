"use client";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useBrand } from "@/lib/auth/BrandContext";

/**
 * Mobile-only top bar (hidden md:flex → shown below the sidebar's own
 * md breakpoint). Desktop always shows the full sidebar via AppSidebar,
 * so it never needs this row — on mobile the sidebar is an off-canvas
 * Sheet that starts closed, and this trigger is the only way to open it.
 *
 * Previously this component existed but was never rendered anywhere in
 * dashboard/layout.tsx, so there was no way to open the mobile sidebar
 * at all. Now mounted in the layout below.
 */
export default function DashboardHeader() {
    const { brand } = useBrand();
    const brandInitial = brand?.name?.trim().charAt(0).toUpperCase() || "?";

    return (
        <div className="sticky top-0 z-30 flex md:hidden items-center gap-3 border-b border-gray-100 bg-background px-4 py-3 dark:border-neutral-900">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />

            <div className="flex min-w-0 items-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="Zuplin"
                    width={88}
                    height={24}
                    className="block dark:hidden"
                />
                <Image
                    src="/logo_dark.svg"
                    alt="Zuplin"
                    width={88}
                    height={24}
                    className="hidden dark:block"
                />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
                {brand?.logoUrl ? (
                    <div
                        className="relative h-8 w-8 overflow-hidden rounded-lg"
                        aria-label={brand.name}
                        title={brand.name}
                    >
                        <Image src={brand.logoUrl} alt="" fill className="object-contain" />
                    </div>
                ) : (
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D2033] text-sm font-semibold text-white dark:bg-[#FDFEFF] dark:text-[#1D2033]"
                        aria-label={brand?.name}
                        title={brand?.name}
                    >
                        {brandInitial}
                    </div>
                )}
            </div>
        </div>
    );
}
