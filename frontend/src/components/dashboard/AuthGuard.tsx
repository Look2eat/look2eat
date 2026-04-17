"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/login'); // ← redirect if no token
        }
    }, []);

    if (!isAuthenticated()) return null; // prevent flash of protected content

    return <>{children}</>;
}