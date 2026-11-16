import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProjectsPage from "@/components/projects/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies of products Chandrani Maheswari has designed, built and shipped — Creonex, Nala Armoire and TreeKart.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <>
      <Navbar />
      <main className="relative bg-background">
        <ProjectsPage />
      </main>
    </>
  );
}
