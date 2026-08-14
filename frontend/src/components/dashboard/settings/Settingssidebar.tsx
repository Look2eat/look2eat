"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { TabsList, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { logout } from "@/services/auth/login";

const TAB_ITEMS = [
    { value: "profile", label: "Profile" },
    { value: "outlet", label: "Outlet" },
    { value: "wallet", label: "Wallet" },
    { value: "billing", label: "Billing" },
];

function LogoutDialog({ compact = false }: { compact?: boolean }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Clears l2e_session + l2e_has_session cookies server-side via
            // /api/auth/logout, then hard-redirects to /login. See
            // services/auth/login.ts — scoped to THIS browser only, no
            // server-side token revocation exists yet.
            await logout();
        } catch {
            // logout() shouldn't normally throw, but don't strand the user
            // on a spinner if the network call fails.
            setIsLoggingOut(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger
                render={
                    compact ? (
                        <button
                            aria-label="Log out"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-300/20 transition-colors"
                        />
                    ) : (
                        <button className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-300/20 transition-colors" />
                    )
                }
            >
                {compact ? <LogOut className="h-4.5 w-4.5" /> : "Log Out"}
            </DialogTrigger>
            <DialogPopup className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Log Out</DialogTitle>
                    <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                    <Button variant="destructive" type="button" loading={isLoggingOut} onClick={handleLogout}>
                        Log Out
                    </Button>
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
}

/**
 * Below md there isn't room for a fixed-width vertical tab rail beside
 * the panel content, so this becomes a horizontal scrollable tab row
 * instead — logout is pulled out of the (horizontally scrolling) tablist
 * into a pinned icon button so it's never scrolled out of reach. Desktop
 * layout (vertical rail, text "Log Out" row at the bottom) is unchanged.
 */
export function SettingsSidebar({ isMobile = false }: { isMobile?: boolean }) {
    if (isMobile) {
        return (
            <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50/40 px-2 py-2 dark:border-neutral-900 dark:bg-neutral-800/20">
                <TabsList
                    variant="underline"
                    className="flex flex-1 min-w-0 items-center gap-1 overflow-x-auto py-1"
                >
                    {TAB_ITEMS.map((tab) => (
                        <TabsTab
                            key={tab.value}
                            value={tab.value}
                            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium"
                        >
                            {tab.label}
                        </TabsTab>
                    ))}
                </TabsList>
                <LogoutDialog compact />
            </div>
        );
    }

    return (
        <div className="border-r border-gray-100 dark:border-neutral-900 bg-gray-50/40 dark:bg-neutral-800/20 text-base">
            <TabsList variant="underline" className={cn("flex flex-col items-stretch gap-5 p-3 w-40 pt-8")}>
                {TAB_ITEMS.map((tab) => (
                    <TabsTab
                        key={tab.value}
                        value={tab.value}
                        className="justify-start rounded-xl px-4 py-2.5 text-base font-medium"
                    >
                        {tab.label}
                    </TabsTab>
                ))}

                <div className="mt-auto pt-4">
                    <LogoutDialog />
                </div>
            </TabsList>
        </div>
    );
}