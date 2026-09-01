"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ACADEMIC_PROJECTS } from "@/data/profile";
import CustomButton from "@/components/CustomButton";

gsap.registerPlugin(ScrollTrigger);

export default function AcademicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const overlaysRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const overlays = overlaysRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < 3) return;

      gsap.set(cards, { willChange: "transform" });
      gsap.set(overlays, { willChange: "opacity" });

      // Initial state
      gsap.set(cards[0], { autoAlpha: 1, yPercent: 0, scale: 1, zIndex: 1 });
      gsap.set(cards[1], { autoAlpha: 0, yPercent: 100, scale: 1, zIndex: 2 });
      gsap.set(cards[2], { autoAlpha: 0, yPercent: 100, scale: 1, zIndex: 3 });
      gsap.set(overlays, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          anticipatePin: 1,
        },
      });

      // --- STAGE 1: CARD 0 ACTIVE, THEN CARD 1 SLIDES UP ---
      tl.to(cards[1], { autoAlpha: 1, duration: 0.01 }, 0.25);

      tl.to(cards[0], {
        scale: 0.92,
        ease: "none",
        duration: 1,
      }, 0.25);

      tl.to(overlays[0], {
        opacity: 0.55,
        ease: "none",
        duration: 1,
      }, 0.25);

      tl.to(cards[1], {
        yPercent: 0,
        ease: "none",
        duration: 1,
      }, 0.25);

      // --- STAGE 2: CARD 1 LOCKED, THEN CARD 2 SLIDES UP ---
      tl.to(cards[2], { autoAlpha: 1, duration: 0.01 }, 1.55);

      tl.to(cards[1], {
        scale: 0.92,
        ease: "none",
        duration: 1,
      }, 1.55);

      tl.to(overlays[1], {
        opacity: 0.55,
        ease: "none",
        duration: 1,
      }, 1.55);

      tl.to(cards[2], {
        yPercent: 0,
        ease: "none",
        duration: 1,
      }, 1.55);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="academic" className="relative h-[480vh] bg-background">
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 flex h-screen w-screen overflow-hidden">
        {ACADEMIC_PROJECTS.map((p, i) => {
          const letter = p.name.charAt(0); // Monogram letter: H for HealVerse, D for DeepNox, I for InfraInk

          return (
            <div
              key={p.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`absolute inset-0 flex h-screen w-screen items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${p.bgGradient} p-0 will-change-transform`}
              style={{ transform: "translateZ(0)" }}
            >
              <article className="relative flex h-full w-full section-container flex-col justify-between p-6 sm:p-12 lg:p-16">
                {/* Ambient Radial Glow */}
                <div className="pointer-events-none absolute right-1/4 top-1/4 h-[35rem] w-[35rem] rounded-full bg-white/[0.03] blur-[120px]" />
                <div className="pointer-events-none absolute left-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-zinc-500/[0.03] blur-[100px]" />

                {/* Top Bar: Creative Monogram & Glass Badge (Left) + Category/Tech Stack (Right) */}
                <div className="relative z-10 flex items-start justify-between">
                  {/* Creative Glass Monogram Emblem */}
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-md shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-clash text-sm font-bold text-white shadow-inner">
                      {letter}
                    </div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                      {p.isWinner ? "HACKATHON WINNER" : "ACADEMIC BUILD"}
                    </span>
                  </div>

                  {/* Category Tag & Tech Stack */}
                  <div className="flex flex-col items-end text-right font-mono">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-silver">
                      {p.category}
                    </span>
                    <div className="my-2.5 h-[1px] w-52 bg-white/15" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                      {p.tech.join("  ·  ")}
                    </span>
                  </div>
                </div>

                {/* Middle Content Layout */}
                <div className="relative z-10 my-auto grid items-center gap-12 lg:grid-cols-12">
                  {/* Left Column: Info & Title */}
                  <div className="flex flex-col lg:col-span-6">
                    <div className="flex items-center gap-2">
                      {p.isWinner ? (
                        <span className="text-base">🏆</span>
                      ) : (
                        <span className="text-base">⚡</span>
                      )}
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        {p.achievement}
                      </span>
                    </div>

                    {/* Project Title Heading */}
                    <h3 className="font-clash mt-3 text-[clamp(2.25rem,4.5vw,4.25rem)] font-medium uppercase leading-[0.98] tracking-tight text-white">
                      {p.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 max-w-[46ch] font-sans text-sm font-normal leading-relaxed text-zinc-300">
                      {p.description}
                    </p>

                    <div className="mt-8">
                      {p.github ? (
                        <CustomButton href={p.github} target="_blank" isFlowing className="text-xs">
                          View GitHub ↗
                        </CustomButton>
                      ) : p.link ? (
                        <CustomButton href={p.link} target="_blank" isFlowing className="text-xs">
                          View Live ↗
                        </CustomButton>
                      ) : null}
                    </div>
                  </div>

                  {/* Right Column: Image Preview */}
                  <div className="relative flex items-center justify-center lg:col-span-6">
                    <div className="group relative aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    SRKR ENGINEERING COLLEGE
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {p.keyMetric}
                  </span>
                </div>
              </article>

              {/* Dimming overlay — animated via opacity only, keeps scroll smooth */}
              <div
                ref={(el) => {
                  overlaysRef.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}