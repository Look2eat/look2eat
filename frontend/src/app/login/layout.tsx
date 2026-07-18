import type { Metadata } from "next";

/**
 * page.tsx here is a client component and so cannot export metadata; this
 * layout carries it instead. Without it the route inherited the home page's
 * title *and* its canonical, which told search engines /login and / were the
 * same page.
 */
export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your Zuplin dashboard.",
  alternates: { canonical: "/login" },
  // A sign-in form has nothing to offer search results.
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
