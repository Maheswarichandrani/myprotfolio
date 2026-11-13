import type { Metadata } from "next";
import { Geist, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Preloader from "@/components/Preloader";
import { PROFILE } from "@/data/profile";

// Professional type system — clean sans, technical display, code mono
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
    <html lang="en" className={`${geist.variable} ${grotesk.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Preloader />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
