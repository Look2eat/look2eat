"use client";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardHeader() {
    const [brandName, setBrandName] = useState("");

    useEffect(() => {
        setBrandName(localStorage.getItem('brandName') || "");
    }, []);

    return (
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="font-poppins">Hello, {brandName}</h1>
        </div>
    );
}