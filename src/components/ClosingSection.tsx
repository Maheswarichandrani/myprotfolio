"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  { text: "Building the", silver: false },
  { text: "Future", silver: true },
  { text: "One Product", silver: false },
  { text: "At a Time", silver: true },
];

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cl-line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.09,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(".cl-meta", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.12,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      // drift up and let the viewport clip the heading on exit
      gsap.to(contentRef.current, {
        yPercent: -28,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background px-6"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center text-center will-change-transform"
      >
        <p className="cl-meta font-mono text-[10px] uppercase tracking-[0.35em] text-dim sm:text-[11px]">
          Full Stack Developer <span className="text-white/20">•</span> Software
          Engineer <span className="text-white/20">•</span>{" "}
          <span className="text-silver">Open to Work</span>
        </p>

        <h2 className="font-clash mt-8 text-[clamp(2.8rem,10vw,8.5rem)] leading-[0.95] font-semibold tracking-tight uppercase">
          {LINES.map((line) => (
            <span key={line.text} className="block overflow-hidden">
              <span
                className={`cl-line block will-change-transform ${
                  line.silver ? "silver-text" : "text-foreground"
                }`}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h2>

        <p className="cl-meta mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-silver">
          Based in India
        </p>
        <p className="cl-meta mt-3 max-w-[40ch] text-sm leading-relaxed text-dim">
          Building modern web applications and digital products.
        </p>
      </div>
    </section>
  );
}
