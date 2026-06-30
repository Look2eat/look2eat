"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { listOutlets, type Outlet } from "../../services/admin/outlet";

const ALL_OUTLETS = "all";

type OutletContextType = {
    selectedOutlet: string;
    setSelectedOutlet: (value: string) => void;
    outlets: Outlet[];
    setOutlets: (outlets: Outlet[]) => void;
    patchOutlet: (id: string, patch: Partial<Outlet>) => void;
    addOutlet: (outlet: Outlet) => void; // ← new
};

const OutletContext = createContext<OutletContextType | null>(null);

export function OutletProvider({ children }: { children: React.ReactNode }) {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [selectedOutlet, setSelectedOutletState] = useState<string>("");

    useEffect(() => {
        listOutlets()
            .then((res) => setOutlets(res.data ?? []))
            .catch(() => setOutlets([]));
    }, []);

    useEffect(() => {
        if (!outlets.length) return;

        const token = localStorage.getItem("token");
        const savedOutlet = localStorage.getItem("defaultOutlet");

        if (!token) {
            const id = outlets.length > 1 ? ALL_OUTLETS : outlets[0].id;
            setSelectedOutletState(id);
            localStorage.setItem("defaultOutlet", id);
            return;
        }

        if (
            savedOutlet &&
            (savedOutlet === ALL_OUTLETS || outlets.some((o) => o.id === savedOutlet))
        ) {
            setSelectedOutletState(savedOutlet);
            return;
        }

        const id = outlets.length > 1 ? ALL_OUTLETS : outlets[0].id;
        setSelectedOutletState(id);
        localStorage.setItem("defaultOutlet", id);
    }, [outlets]);

    const patchOutlet = (id: string, patch: Partial<Outlet>) => {
        setOutlets(outlets.map((o) => o.id === id ? { ...o, ...patch } : o));
    };

    // Appends new outlet and auto-selects it
    const addOutlet = (outlet: Outlet) => {
        setOutlets((prev) => [...prev, outlet]);
        setSelectedOutletState(outlet.id);
        localStorage.setItem("defaultOutlet", outlet.id);
    };

    const setSelectedOutlet = (value: string) => {
        setSelectedOutletState(value);
        localStorage.setItem("defaultOutlet", value);
    };

    return (
        <OutletContext.Provider value={{ selectedOutlet, setSelectedOutlet, outlets, setOutlets, patchOutlet, addOutlet }}>
            {children}
        </OutletContext.Provider>
    );
}

export function useOutlet() {
    const ctx = useContext(OutletContext);
    if (!ctx) throw new Error("useOutlet must be used inside <OutletProvider>");
    return ctx;
}

export { ALL_OUTLETS };