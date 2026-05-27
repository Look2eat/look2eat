"use client";

import { Tabs, TabsPanel } from "@/components/ui/tabs";
import { SettingsSidebar } from "../../../components/dashboard/settings/Settingssidebar";
import { ProfileTab } from "../../../components/dashboard/settings/ProfileTab";
import { BusinessTab } from "../../../components/dashboard/settings/Businesstab";
import { TeamTab } from "../../../components/dashboard/settings/Teamtab";
import { SecurityTab } from "../../../components/dashboard/settings/Securitytab";
import { BillingTab } from "../../../components/dashboard/settings/Billingtab";

const PANELS = [
    { value: "profile", title: "My Profile", component: <ProfileTab /> },
    { value: "business", title: "Business Settings", component: <BusinessTab /> },
    { value: "team", title: "Team", component: <TeamTab /> },
    { value: "security", title: "Security", component: <SecurityTab /> },
    { value: "billing", title: "Billing", component: <BillingTab /> },
];

export default function AccountSettingsPage() {
    return (
        <div className=" px-6 py-6 font-poppins">
            <div className="mx-auto ">
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#1D2033] dark:text-[#FDFEFF]">Account Settings</h1>

                <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#040317] shadow-sm ring-1 ring-gray-100 dark:ring-gray-900">
                    <Tabs className="w-full flex-row lg:min-h-140 gap-4" defaultValue="profile" orientation="vertical">
                        <SettingsSidebar />

                        <div className="flex-1 min-w-0">
                            {PANELS.map(({ value, title, component }) => (
                                <TabsPanel key={value} value={value} className="p-8">
                                    <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                                    {component}
                                </TabsPanel>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}