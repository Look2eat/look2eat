import { useEffect } from "react";

import { useAppStore } from "@/store/useAppStore";
import { ToggleTheme } from "../ui/toggle-theme";


export default function WelcomeCard() {
    const {
        logoUrl,
        outletName,
        userName,
        isLoaded,
        setDashboardData,
    } = useAppStore();

    useEffect(() => {
        // Only fetch if data doesn't already exist
        if (isLoaded) return;

        const fetchDashboardData = async () => {
            // Dummy API response
            const response = {
                logoUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg",
                outletName: "Burger King",
                userName: "Avneet",
            };

            setDashboardData(response);
        };

        fetchDashboardData();
    }, [isLoaded, setDashboardData]);

    if (!isLoaded) {
        return (
            <div className="h-44 w-full animate-pulse rounded-[36px] bg-gray-100" />
        );
    }

    return (
        <div className="w-66 rounded-[36px] bg-background py-6 px-3 mx-2 mt-6">
            <div className="flex items-start justify-between">
                <div>
                    <img
                        src={logoUrl}
                        alt={outletName}
                        className="h-10 w-10 object-contain"
                    />
                </div>

                <ToggleTheme />

            </div>
            <h2 className="mt-2 text-4 font-medium text-[#8D9098]">
                {outletName}
            </h2>

            <h1 className="mt-4 text-2xl font-bold leading-[1.05] text-[#1D2033] dark:text-[#FDFEFF] font-poppins">
                Welcome back,
                <br />
                {userName}!
            </h1>



        </div>
    );
}