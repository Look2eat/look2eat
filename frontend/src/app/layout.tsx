import type { Metadata, Viewport } from "next";
import { site, siteUrl } from "@/lib/site";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// TEMPORARY env diagnostic — remove with src/components/debug/EnvCheck.tsx
import { EnvCheck } from "@/components/debug/EnvCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase lets every page declare a relative canonical and still emit
  // an absolute URL, and is what makes the generated OG image resolve.
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    // Child routes set only their own name; this appends the brand.
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  // Matches the landing page's ground so mobile browser chrome blends in.
  other: { "format-detection": "telephone=no,address=no,email=no" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08090C" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes writes the resolved theme onto <html> before React
    // hydrates, so the server markup can never match. This is the fix the
    // library documents, and it silences a hydration error on every route.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-white dark:bg-[#121214]`}
      ><ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
          {children}
        </ThemeProvider>
        <EnvCheck />
      </body>
    </html>
  );
}
