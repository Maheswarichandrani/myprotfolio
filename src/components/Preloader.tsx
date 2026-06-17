"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROFILE } from "@/data/profile";

// Shown once per browser — flag persists in localStorage across reloads.
const SEEN_KEY = "portfolio:preloaded";

// 0..100 — each odometer reel renders one digit slice of these values.
const DIGITS: number[] = Array.from({ length: 101 }, (_, i) => i);

const markDone = () => {
  (window as Window & { __preloaderDone?: boolean }).__preloaderDone = true;
  window.dispatchEvent(new CustomEvent("preloader:done"));
};

export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  // Odometer reels — each is a vertical column scrolled by one shared value.
  const unitsRef = useRef<HTMLDivElement>(null);
  const tensRef = useRef<HTMLDivElement>(null);
  const hundredsRef = useRef<HTMLDivElement>(null);
  const tensWrapRef = useRef<HTMLDivElement>(null);
  const hundredsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, [done]);

  useGSAP(
    () => {
      // Already shown this browser → skip straight to the site. Runs in a
      // layout effect (before paint), so there's no flash of the preloader.
      let seen = false;
      try {
        seen = localStorage.getItem(SEEN_KEY) === "1";
      } catch {
        /* localStorage blocked — just play the preloader */
      }
      if (seen) {
        gsap.set(rootRef.current, { display: "none" });
        markDone();
        setDone(true);
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          try {
            localStorage.setItem(SEEN_KEY, "1");
          } catch {
            /* ignore — preloader simply shows again next time */
          }
          markDone();
          setDone(true);
        },
      });

      // Odometer: 0..100 lives in a 101-cell column; shifting the column by
      // one shared value rolls every reel in lock-step. quickSetter avoids
      // per-frame allocations (GSAP's recommended high-frequency setter).
      const CELLS = 101; // values 0..100
      const PER_CELL = 100 / CELLS; // yPercent shift per single digit step
      const setU = gsap.quickSetter(unitsRef.current, "yPercent");
      const setT = gsap.quickSetter(tensRef.current, "yPercent");
      const setH = gsap.quickSetter(hundredsRef.current, "yPercent");
      const setBar = gsap.quickSetter(lineRef.current, "scaleX");

      const draw = () => {
        const v = counter.v;
        const y = -v * PER_CELL;
        setU(y);
        setT(y);
        setH(y);
        setBar(v / 100);
        // Reveal higher digits only once they're actually reached (no "007").
        gsap.set(tensWrapRef.current, { autoAlpha: v >= 9.5 ? 1 : 0 });
        gsap.set(hundredsWrapRef.current, { autoAlpha: v >= 99.5 ? 1 : 0 });
      };

      // phase 1 — frame in, then count up smoothly through every number
      tl.set(lineWrapRef.current, { y: "38vh" })
        .set([tensWrapRef.current, hundredsWrapRef.current], { autoAlpha: 0 })
        .to(".pl-meta", { opacity: 1, duration: 0.8, stagger: 0.12 })
        .fromTo(
          barRef.current,
          { scaleY: 0, transformOrigin: "bottom center" },
          { scaleY: 1, duration: 0.9, ease: "expo.inOut" },
          "-=0.5"
        )
        .fromTo(
          counterRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: "expo.out" },
          "-=0.4"
        )
        // single continuous roll 0 → 100 — no skipped values, gentle ease.
        .to(
          counter,
          { v: 100, duration: 3.4, ease: "power1.inOut", onUpdate: draw },
          "-=0.2"
        );

      // phase 2 — counter exits, line sweeps bottom -> center, name reveals
      tl.to(counterRef.current, {
        yPercent: 115,
        duration: 0.8,
        ease: "expo.in",
      })
        .to(
          barRef.current,
          { scaleY: 0, transformOrigin: "top center", duration: 0.7, ease: "expo.inOut" },
          "<"
        )
        .to(
          lineWrapRef.current,
          { y: 0, duration: 1.1, ease: "expo.inOut" },
          "-=0.4"
        )
        .fromTo(
          ".pl-letter",
          { yPercent: 120, opacity: 0, filter: "blur(10px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.045,
            duration: 0.9,
            ease: "expo.out",
          },
          "-=0.15"
        )
        .fromTo(
          roleRef.current,
          { opacity: 0, letterSpacing: "0.7em" },
          { opacity: 1, letterSpacing: "0.35em", duration: 1.1, ease: "power2.out" },
          "-=0.55"
        )
        .to({}, { duration: 0.7 })
        // phase 3 — clear the stage, turn the page
        .to(".pl-letter", {
          yPercent: -120,
          opacity: 0,
          stagger: 0.025,
          duration: 0.6,
          ease: "expo.in",
        })
        .to(roleRef.current, { opacity: 0, duration: 0.4 }, "<")
        .to(
          lineRef.current,
          { scaleX: 0, transformOrigin: "right center", duration: 0.8, ease: "expo.inOut" },
          "<+=0.1"
        )
        .to(".pl-meta", { opacity: 0, duration: 0.4 }, "<")
        .to(castRef.current, { opacity: 0.5, duration: 0.7, ease: "power1.in" }, "+=0.1")
        .to(
          pageRef.current,
          { rotationY: -110, duration: 1.5, ease: "power2.inOut" },
          "<"
        )
        .to(pageRef.current, { opacity: 0, duration: 0.35, ease: "power1.out" }, "-=0.45")
        .to(castRef.current, { opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.8");
    },
    { scope: rootRef }
  );

  if (done) return null;

  const words = PROFILE.fullName.toUpperCase().split(" ");

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] [perspective:1600px]">
      {/* shadow the lifting page casts on the revealed site */}
      <div
        ref={castRef}
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-0"
      />

      <div
        ref={pageRef}
        className="relative flex h-full w-full origin-left flex-col items-center justify-center bg-black backface-hidden will-change-transform"
      >
        <div className="pl-meta absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 opacity-0">
          Portfolio — ©{PROFILE.year}
        </div>
        <div className="pl-meta absolute top-6 right-6 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 opacity-0 sm:block">
          {PROFILE.tagline}
        </div>

        <div ref={lineWrapRef} className="w-[80vw] max-w-[820px] will-change-transform">
          <div ref={lineRef} className="loader-line origin-left scale-x-0" />
        </div>

        <h1 className="font-clash mt-8 flex max-w-[90vw] flex-wrap justify-center gap-x-[0.3em] text-[clamp(1.6rem,6.5vw,4.5rem)] font-medium tracking-tight sm:mt-10">
          {words.map((word, wi) => (
            <span key={wi} className="flex overflow-hidden">
              {word.split("").map((c, i) => (
                <span
                  key={i}
                  className="pl-letter silver-text inline-block will-change-transform"
                >
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={roleRef}
          className="mt-6 px-4 text-center font-mono text-[13px] font-medium uppercase tracking-[0.35em] text-silver opacity-0 [text-shadow:0_0_24px_rgba(192,192,192,0.35)] sm:text-sm"
        >
          {PROFILE.role}
        </p>

        {/* big counter — bottom left, masked for slide in/out */}
        <div
          ref={barRef}
          className="absolute bottom-[8vh] left-0 h-[16vh] w-[2px] bg-gradient-to-b from-transparent via-silver to-silver-dim"
        />
        <div className="absolute bottom-[7vh] left-[7vw] overflow-hidden sm:bottom-[8vh] sm:left-[8vw]">
          <div ref={counterRef} className="flex items-start will-change-transform">
            <span className="font-clash flex text-[clamp(2.5rem,6.5vw,5rem)] leading-none font-semibold tracking-tight tabular-nums">
              {/* hundreds reel (only the "1" of 100) */}
              <div ref={hundredsWrapRef} className="h-[1em] overflow-hidden">
                <div ref={hundredsRef} className="flex flex-col will-change-transform">
                  {DIGITS.map((n) => (
                    <span key={n} className="silver-text flex h-[1em] w-[0.62em] items-center justify-center">
                      {Math.floor(n / 100)}
                    </span>
                  ))}
                </div>
              </div>
              {/* tens reel */}
              <div ref={tensWrapRef} className="h-[1em] overflow-hidden">
                <div ref={tensRef} className="flex flex-col will-change-transform">
                  {DIGITS.map((n) => (
                    <span key={n} className="silver-text flex h-[1em] w-[0.62em] items-center justify-center">
                      {Math.floor(n / 10) % 10}
                    </span>
                  ))}
                </div>
              </div>
              {/* units reel (always visible) */}
              <div className="h-[1em] overflow-hidden">
                <div ref={unitsRef} className="flex flex-col will-change-transform">
                  {DIGITS.map((n) => (
                    <span key={n} className="silver-text flex h-[1em] w-[0.62em] items-center justify-center">
                      {n % 10}
                    </span>
                  ))}
                </div>
              </div>
            </span>
            <span className="silver-text font-clash mt-[0.5em] text-[clamp(1rem,2.5vw,1.75rem)] leading-none font-semibold">
              %
            </span>
          </div>
        </div>

        <div className="pl-meta absolute right-6 bottom-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 opacity-0">
          Initialising experience
        </div>
      </div>
    </div>
  );
}
