"use client"
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { isAuthenticated } from "@/lib/auth";
import { adminLogin } from "@/services/api";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


const Login = () => {
    const router = useRouter();
    useEffect(() => {
        if (isAuthenticated()) {
            router.replace('/dashboard'); // ← redirect if already logged in
        }
    }, []);
    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log("Form data:", data);

        try {
            const res = await adminLogin(data.phone as string, data.password as string);
            const { token } = res as { token: string };
            localStorage.setItem('token', token);
            localStorage.setItem('brandName', res.user.brand.name)
            router.push('/dashboard'); // or wherever
        } catch (err) {
            console.error("Login failed:", err);
        }
    };



    return (
        <div className="bg-background text-foreground">
            <SignInPage
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                onSignIn={handleSignIn}

            />
        </div>
    );
};

export default Login;