"use client"
import { useState } from "react";
import { SignInPage } from "@/components/ui/sign-in";
import { useRouter } from 'next/navigation';
import { loginAdmin } from "@/services/auth/login";

// REMOVED: isAuthenticated()-gated useEffect redirect. Middleware now
// handles redirecting an already-authenticated user away from /login
// before any HTML renders — see src/middleware.ts.
//
// REMOVED: adminLogin from services/api — replaced by loginAdmin from
// services/auth/login.ts, which calls our own /api/auth/login route
// instead of Express directly. See that file's comments for why.
//
// REMOVED: localStorage.setItem('token', ...) and
// localStorage.setItem('brandName', ...). The token is now set as an
// httpOnly cookie by the route handler — nothing for this component to
// store. If you need the brand name for display (e.g. a navbar), use
// getTokenPayload() from lib/auth.ts, which fetches it from
// /api/auth/me.

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return; // guard against double-submit

        setError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as {
            phone: string;
            password: string;
        };

        try {
            // loginAdmin() calls /api/auth/login, which sets the httpOnly
            // cookie server-side. By the time this resolves, the cookie
            // is already set — we never see the raw token here.
            await loginAdmin({ phone: data.phone, password: data.password });

            // router.refresh() forces Server Components to re-read the
            // new cookie instead of serving anything cached from the
            // logged-out state.
            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background text-foreground">
            {error && (
                <div
                    role="alert"
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive shadow-sm"
                >
                    {error}
                </div>
            )}
            <SignInPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                onSignIn={handleSignIn}
            />
        </div>
    );
};

export default Login;