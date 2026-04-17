"use client"
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { useRouter } from 'next/navigation';


const Login = () => {
    const router = useRouter();
    const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log("Sign In submitted:", data);
        alert(`Sign In Submitted! Check the browser console for form data.`);
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