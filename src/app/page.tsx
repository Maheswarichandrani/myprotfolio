import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import AcademicSection from "@/components/AcademicSection";
import ContactSection from "@/components/ContactSection";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <span id="top" className="absolute top-0" aria-hidden />
      <Navbar />

      {/* content layer — solid bg covers the fixed footer underneath */}
      <main className="relative z-10 bg-background">
        <HeroSection />

        <AboutSection />

        <ProjectsSection />

        <SkillsSection />

        <AcademicSection />

        <ContactSection />

        <ClosingSection />
      </main>

      {/* transparent runway — height synced to the footer by Footer itself */}
      <div id="footer-sentinel" className="h-[60vh]" />
      <Footer />
    </>
  );
}
