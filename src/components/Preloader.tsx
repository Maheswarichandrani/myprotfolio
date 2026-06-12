"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROFILE } from "@/data/profile";

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
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (done) return;
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, [done]);

  useGSAP(
    () => {
      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("preloader:done"));
          setDone(true);
        },
      });

      const render = () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.floor(counter.v));
        }
        // line doubles as the progress bar while it waits near the bottom
        gsap.set(lineRef.current, { scaleX: counter.v / 100 });
      };

      // phase 1 — frame in, counter jumps through a few values only
      tl.set(lineWrapRef.current, { y: "38vh" })
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
        );

      [19, 47, 68, 86, 100].forEach((step) => {
        tl.to(counter, {
          v: step,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: render,
        }).to({}, { duration: 0.2 });
      });

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
          className="absolute bottom-[6vh] left-0 h-[24vh] w-[3px] bg-gradient-to-b from-transparent via-silver to-silver-dim"
        />
        <div className="absolute bottom-[4vh] left-[5vw] overflow-hidden">
          <div ref={counterRef} className="flex items-start will-change-transform">
            <span className="silver-text font-clash text-[clamp(4rem,11vw,8rem)] leading-[0.85] font-semibold tracking-tight tabular-nums">
              <span ref={countRef}>0</span>
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
