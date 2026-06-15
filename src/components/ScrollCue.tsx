"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/providers/SmoothScrollProvider";

export default function ScrollCue() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      // entrance
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 24,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });

      // dot falls down the mouse track, fades, repeats
      gsap.to(".cue-dot", {
        y: 16,
        opacity: 0,
        duration: 1.4,
        ease: "power1.in",
        repeat: -1,
        repeatDelay: 0.2,
      });

      // chevron bobs to entice
      gsap.to(".cue-arrow", {
        y: 5,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // soft glow pulse on the whole cue
      gsap.to(".cue-glow", {
        opacity: 0.55,
        scale: 1.15,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: rootRef }
  );

  const go = () => lenis?.scrollTo("#about", { duration: 1.6 });

  return (
    <button
      ref={rootRef}
      onClick={go}
      aria-label="Scroll to About section"
      className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-dim transition-colors duration-300 group-hover:text-silver">
        Scroll to explore
      </span>

      <span className="relative flex flex-col items-center">
        <span className="cue-glow absolute inset-0 -z-10 rounded-full bg-silver/20 opacity-0 blur-xl" />

        {/* mouse outline + falling dot */}
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line-strong pt-1.5 transition-colors duration-300 group-hover:border-silver">
          <span className="cue-dot h-1.5 w-1.5 rounded-full bg-silver" />
        </span>

        <svg
          className="cue-arrow mt-1 h-3 w-3 text-silver-dim transition-colors duration-300 group-hover:text-silver"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}
