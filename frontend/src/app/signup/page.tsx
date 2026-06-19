"use client"
import { useState } from "react";
import { SignUpPage } from "@/components/ui/signup";
import { useRouter } from 'next/navigation';
import { registerOwner, slugify } from "@/services/auth/register";

// REMOVED: isAuthenticated()-gated useEffect redirect. Middleware now
// handles redirecting an already-authenticated user away from /signup
// before any HTML renders — see src/middleware.ts. Nothing needs to run
// client-side for that anymore.
//
// REMOVED: adminLogin import — that function doesn't exist anymore.
// Login goes through fetch("/api/auth/login") directly in the login
// page; this page has nothing to do with login at all.

const SignUp = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return; // guard against double-submit

        setError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as {
            name: string;
            brandName: string;
            phone: string;
            email: string;
            password: string;
        };

        try {
            // registerOwner() calls OUR /api/auth/register route, which
            // talks to Express server-side and consumes the token from
            // the response into an httpOnly cookie. By the time this
            // resolves, the user IS logged in — the cookie is already
            // set. We never see the token here.
            await registerOwner({
                brandName: data.brandName,
                slug: slugify(data.brandName),
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
            });

            // User is genuinely authenticated now (unlike the earlier
            // assumption that registration didn't return a token) — go
            // straight to the dashboard, same as a normal login would.
            // router.refresh() forces Server Components to re-read the
            // new cookie instead of serving anything cached from the
            // logged-out state.
            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            // registerOwner() throws a plain Error with the backend's
            // message (e.g. slug collision, email already in use) — see
            // services/auth/register.ts.
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
            <SignUpPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                onSignUp={handleSignUp}
            />
        </div>
    );
};

export default SignUp;