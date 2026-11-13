"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROFILE } from "@/data/profile";

// Shown once per browser — flag persists in localStorage across reloads.
const SEEN_KEY = "portfolio:preloaded";

const markDone = () => {
  (window as Window & { __preloaderDone?: boolean }).__preloaderDone = true;
  window.dispatchEvent(new CustomEvent("preloader:done"));
};

const STEPS = ["compiling components", "loading projects", "ready"];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (done) return;
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, [done]);

  useGSAP(
    () => {
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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".pl-line > span", { yPercent: 110, duration: 0.9, stagger: 0.08 })
        .from(".pl-meta", { opacity: 0, y: 6, duration: 0.6, stagger: 0.06 }, "-=0.5")
        .to(
          counter,
          {
            v: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
              if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
              if (stepRef.current) stepRef.current.textContent = STEPS[v < 45 ? 0 : v < 100 ? 1 : 2];
            },
          },
          "-=0.4"
        )
        .to(".pl-line > span", { yPercent: -110, duration: 0.6, stagger: 0.05, ease: "power3.in" }, "+=0.2")
        .to(".pl-meta", { opacity: 0, duration: 0.3 }, "<")
        .add(() => {
          try {
            localStorage.setItem(SEEN_KEY, "1");
          } catch {
            /* ignore */
          }
          // Dispatch outside this GSAP callback: listeners (hero, navbar) create
          // tweens with selector strings, and inside a callback they'd be scoped to
          // the preloader's context — "target not found".
          setTimeout(markDone, 0);
        })
        .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" })
        .add(() => setDone(true));
    },
    { scope: rootRef }
  );

  if (done) return null;

  const [first, ...rest] = PROFILE.fullName.split(" ");

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col bg-[#f3ebe0] text-[#2b1d15] will-change-transform">
      <div className="pl-meta flex items-center justify-between px-6 pt-6 font-mono text-[11px] text-[#8a7262] sm:px-10">
        <span>{PROFILE.role}</span>
        <span>portfolio — {PROFILE.year}</span>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 sm:px-10">
        <h1 className="font-display text-[clamp(2.8rem,10vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <span className="pl-line block overflow-hidden pb-[0.06em]">
            <span className="block">{first}</span>
          </span>
          <span className="pl-line block overflow-hidden pb-[0.06em]">
            <span className="block text-[#8a7262]">{rest.join(" ")}</span>
          </span>
        </h1>
      </div>

      <div className="px-6 pb-8 sm:px-10">
        <div className="pl-meta mb-3 flex items-center justify-between font-mono text-[11px] text-[#8a7262]">
          <span>
            <span className="text-[#a4582a]">&gt;</span> <span ref={stepRef}>compiling components</span>
          </span>
          <span className="tabular-nums text-[#2b1d15]">
            <span ref={countRef}>000</span>%
          </span>
        </div>
        <div className="pl-meta h-px w-full bg-[#2b1d15]/10">
          <div ref={barRef} className="h-full w-full origin-left bg-[#a4582a]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
