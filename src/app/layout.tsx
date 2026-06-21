import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Preloader from "@/components/Preloader";
import { PROFILE } from "@/data/profile";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chandranimaheswari.dev";
const title = `${PROFILE.fullName} — ${PROFILE.role}`;
const description =
  "Chandrani Maheswari — Full Stack Developer and final-year B.Tech CSE student. Building production-grade products with Next.js, TypeScript, and Node.js. Multiple hackathon wins, 450+ LeetCode problems solved.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${PROFILE.fullName}`,
  },
  description,
  applicationName: `${PROFILE.fullName} Portfolio`,
  authors: [{ name: PROFILE.fullName, url: siteUrl }],
  creator: PROFILE.fullName,
  keywords: [
    "Chandrani Maheswari",
    "Full Stack Developer",
    "Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Web Developer Portfolio",
    "Hackathon Winner",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${PROFILE.fullName} Portfolio`,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@Maheswarichandrani",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Preloader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
