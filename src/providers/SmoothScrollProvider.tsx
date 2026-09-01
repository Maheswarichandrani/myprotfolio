"use client";
import { useEffect, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Always (re)load at the top. Browsers restore the previous scroll position
    // on refresh BEFORE pins/sticky are measured → elements land in the wrong
    // place. Manual restoration + jump-to-top makes every load deterministic.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Don't refresh on mobile-browser-chrome show/hide (that resize is not a
    // real layout change and just causes a visible jump).
    ScrollTrigger.config({ ignoreMobileResize: true });

    // lerp (frame-rate independent) smoothing feels lighter/snappier than a long
    // fixed duration — reduces the "stuck" feel around pinned sections.
    const l = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    l.scrollTo(0, { immediate: true });
    setLenis(l);

    // Single rAF loop for Lenis (via gsap.ticker) → one clock, no double-driving.
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    l.on("scroll", ScrollTrigger.update);

    // Recalc all trigger positions once late-arriving layout has settled:
    // after paint, after web fonts swap in, and after full window load.
    const refresh = () => ScrollTrigger.refresh();
    const raf1 = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("load", refresh);
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