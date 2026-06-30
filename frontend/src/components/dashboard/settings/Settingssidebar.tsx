"use client";

import { useState } from "react";
import { TabsList, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

export function SettingsSidebar() {
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
        <div className="border-r border-gray-100 dark:border-neutral-900 bg-gray-50/40 dark:bg-neutral-800/20 text-base">
            <TabsList variant="underline" className="flex flex-col items-stretch gap-5 p-3 w-40 pt-8">
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
                    <Dialog>
                        <DialogTrigger
                            render={
                                <button className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-300/20 transition-colors" />
                            }
                        >
                            Log Out
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
                </div>
            </TabsList>
        </div>
    );
}