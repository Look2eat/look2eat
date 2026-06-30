"use client";

import { useMemo } from "react";
import {
    Select,
    SelectItem,
    SelectPopup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOutlet } from "@/lib/auth/OutletContext";

const ALL_OUTLETS = "all";

export default function SelectOutletCard() {
    const { selectedOutlet, setSelectedOutlet, outlets } = useOutlet();

    const outletItems = useMemo(() => {
        const items = outlets.map((outlet) => ({
            label: outlet.name,
            value: outlet.id,
        }));

        if (outlets.length > 1) {
            return [{ label: "All Outlets", value: ALL_OUTLETS }, ...items];
        }

        return items;
    }, [outlets]);

    const handleOutletChange = (value: string | null) => {
        if (!value) return;
        setSelectedOutlet(value);
    };

    return (
        <div className="w-66 rounded-[28px] bg-background px-4 py-6 mx-2 mt-6">
            <h1 className="text-2xl font-semibold text-[#1D2033] dark:text-[#FDFEFF] font-poppins">
                Select Outlet
            </h1>

            <div className="mt-4">
                <Select
                    aria-label="Select outlet"
                    items={outletItems}
                    value={selectedOutlet}
                    onValueChange={handleOutletChange}
                >
                    <SelectTrigger className="w-full rounded-lg border-none shadow-none bg-white">
                        <SelectValue placeholder="Select outlet" />
                    </SelectTrigger>

                    <SelectPopup>
                        {outletItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectPopup>
                </Select>
            </div>
        </div>
    );
}