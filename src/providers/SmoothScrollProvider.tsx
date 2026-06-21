"use client";
import { useEffect, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: true,
    });
    setLenis(l);

    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    l.on("scroll", ScrollTrigger.update);

    // Intercept clicks on local anchor links for smooth scrolling animation
    const handleLinkClick = (e: MouseEvent) => {
      // Ignore clicks with modifier keys or non-primary mouse clicks
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Handle hash links
      if (href.startsWith("#")) {
        e.preventDefault();

        // If it's just a raw "#" placeholder, ignore it to prevent jumping
        if (href === "#") return;

        // Custom mapping for "#experience" link to the Experience slide of AboutSection
        if (href === "#experience") {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            const count = 4; // number of slides inside AboutSection
            const zone = (aboutSection.offsetHeight - window.innerHeight) / count;
            // Scroll to the second slide (index 1) of the pinned AboutSection
            l.scrollTo(aboutSection.offsetTop + zone * 1 + zone / 2);
          }
          return;
        }

        // Standard hash scrolling
        try {
          const element = document.querySelector(href);
          if (element instanceof HTMLElement) {
            l.scrollTo(element);
          }
        } catch (err) {
          console.error("Lenis scroll selector error:", href, err);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
