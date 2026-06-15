import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import AcademicSection from "@/components/AcademicSection";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";
import ScrollCue from "@/components/ScrollCue";

export default function Home() {
  return (
    <>
      {/* content layer — solid bg covers the fixed footer underneath */}
      <main className="relative z-10 bg-background">
        {/* hero — placeholder, designed later */}
        <section className="relative flex h-screen items-center justify-center">
          <h1 className="silver-text font-clash text-6xl font-semibold">
            Portfolio
          </h1>
          <ScrollCue />
        </section>

        <AboutSection />

        <ProjectsSection />

        <AcademicSection />

        {/* contact form slots in here later */}

        <ClosingSection />
      </main>

      {/* transparent runway — height synced to the footer by Footer itself */}
      <div id="footer-sentinel" className="h-[60vh]" />
      <Footer />
    </>
  );
}
