import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './button';

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  loading?: boolean;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-foreground/1 backdrop-blur-sm transition-colors ">
    {children}
  </div>
);



// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome Back</span>,
  description = "Enter your details to sign in to your account",
  heroImageSrc,
  onSignIn,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="h-dvh flex flex-col md:flex-row font-geist w-dvw">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-start pt-60 justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-poppins font-bold leading-tight">{title}</h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300 flex flex-col gap-1">
                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                <GlassInputWrapper>
                  <input name="phone" type="phone" placeholder="Enter your phone number" className="w-full bg-transparent text-sm p-3 focus:outline-none font-medium rounded-xl " />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400 flex flex-col gap-1">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-3 pr-12 rounded-xl focus:outline-none font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>


              <Button
                type="submit"
                loading={loading}
                variant="default"
                className="animate-element animate-delay-600 w-full"
              >
                Sign In
              </Button>
            </form>




          </div>
        </div>
      </section>

      {/* Right column: hero image   */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
        </section>
      )}
    </div>
  );
};  