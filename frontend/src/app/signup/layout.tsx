import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start free",
  description:
    "Create your Zuplin account, add your first outlet and start rewarding regulars — no card required.",
  alternates: { canonical: "/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
