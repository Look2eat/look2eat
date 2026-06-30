"use client";
import { useOutlet } from "@/lib/auth/OutletContext";
import { TeamTab } from "../settings/Teamtab";
import CashierPanelCard from "./CashierPanelCard";


const ALL_OUTLETS = "all";
export default function CashierMainScreen() {
    const cashierLink = "https://zuplin.in/cashier";
    const { selectedOutlet } = useOutlet();

    const isAllOutlets = selectedOutlet === ALL_OUTLETS || selectedOutlet === "";
    if (isAllOutlets) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
                <h1 className="text-2xl font-bold text-center font-poppins">
                    Please select an outlet to manage cashier accounts.
                </h1>
            </div>
        );
    }
    return (
        <div className="font-poppins ">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* 30% */}
                <aside className="w-full lg:w-[35%] ">
                    <CashierPanelCard cashierLink={cashierLink} />
                </aside>

                {/* 70% */}
                <main className="w-full lg:w-[65%]">
                    <div className="rounded-3xl bg-white dark:bg-[#121214] p-6 h-full ">

                        <h1 className="text-2xl font-bold">
                            Manage Cahier Accounts
                        </h1>

                        {/* <p className="mt-4 text-neutral-600">
                            Your cashier transactions, reports, analytics and controls
                            can be rendered here.
                        </p> */}
                        <div className="pt-4">
                            <TeamTab footer={true} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}