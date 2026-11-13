import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Chandrani Maheswari — Full Stack Developer open to full-time roles and freelance projects.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="relative bg-background">
        <ContactPage />
      </main>
    </>
  );
}
