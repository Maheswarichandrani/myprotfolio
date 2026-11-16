"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ACADEMIC_PROJECTS } from "@/data/profile";
import CustomButton from "@/components/CustomButton";
import AcademicDeck from "@/components/AcademicDeck";

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
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {

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
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="academic" className="relative bg-background py-20 sm:py-24 lg:h-[480vh] lg:py-0">
      {/* phones / tablets: section title (desktop lets the pinned cards speak) */}
      <div className="section-container mb-10 lg:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Academics</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
          Hackathons &amp; builds
        </h2>
      </div>
      <div className="lg:hidden">
        <AcademicDeck />
      </div>

      {/* Pinned Sticky Viewport (desktop) */}
      <div className="hidden w-full lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-hidden">
        {/* same content width as every other section (matches .section-container) */}
        <div className="relative mx-auto w-[calc(min(100%,86rem)-2*clamp(1.5rem,6vw,5rem))] lg:h-full lg:py-[clamp(0.75rem,3vh,1.75rem)]">
        <div className="relative flex w-full flex-col gap-6 lg:block lg:h-full">
        {ACADEMIC_PROJECTS.map((p, i) => {
          const letter = p.name.charAt(0); // Monogram letter: H for HealVerse, D for DeepNox, I for InfraInk

          return (
            <div
              key={p.name}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`relative flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${p.bgGradient} p-0 sm:rounded-[2rem] lg:absolute lg:inset-0 lg:h-full lg:rounded-[2.5rem] lg:will-change-transform`}
            >
              <article className="relative flex h-full w-full flex-col justify-between gap-8 p-5 sm:p-10 lg:gap-0 lg:p-14">
                {/* Ambient Radial Glow */}
                <div className="pointer-events-none absolute right-1/4 top-1/4 h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle,rgba(201,164,106,0.07),transparent_65%)]" />
                <div className="pointer-events-none absolute left-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(201,164,106,0.05),transparent_65%)]" />

                {/* Top Bar: Creative Monogram & Glass Badge (Left) + Category/Tech Stack (Right) */}
                <div className="relative z-10 flex items-start justify-between">
                  {/* Creative Glass Monogram Emblem */}
                  <div className="flex items-center gap-3 rounded-full border border-[#e6d3b3]/15 bg-[#120b07]/50 py-1.5 pl-1.5 pr-4 shadow-lg lg:px-4 lg:py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6d3b3]/10 font-clash text-sm font-bold text-[#f1e6d2] shadow-inner">
                      {letter}
                    </div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d9c6a6]">
                      {p.isWinner ? "HACKATHON WINNER" : "ACADEMIC BUILD"}
                    </span>
                  </div>

                  {/* Category Tag & Tech Stack */}
                  <div className="hidden flex-col items-end text-right font-mono lg:flex">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a46a]">
                      {p.category}
                    </span>
                    <div className="my-2.5 h-[1px] w-52 bg-[#e6d3b3]/15" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#b39c7d]">
                      {p.tech.join("  ·  ")}
                    </span>
                  </div>
                </div>

                {/* Middle Content Layout */}
                <div className="relative z-10 grid items-center gap-8 lg:my-auto lg:grid-cols-12 lg:gap-12">
                  {/* Left Column: Info & Title */}
                  <div className="flex flex-col lg:col-span-6">
                    <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a46a] lg:hidden">
                      {p.category}
                    </p>
                    <div className="flex items-start gap-2 lg:items-center">
                      {p.isWinner ? (
                        <span className="text-base">🏆</span>
                      ) : (
                        <span className="text-base">⚡</span>
                      )}
                      <span className="font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-wider text-[#d9c6a6] lg:text-xs">
                        {p.achievement}
                      </span>
                    </div>

                    {/* Project Title Heading */}
                    <h3 className="font-clash mt-3 text-[clamp(2.1rem,9vw,3rem)] lg:text-[clamp(2.25rem,4.5vw,4.25rem)] font-medium uppercase leading-[0.98] tracking-tight text-[#f1e6d2]">
                      {p.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 max-w-[46ch] font-sans text-sm font-normal leading-relaxed text-[#d9c6a6]">
                      {p.description}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-1.5 lg:hidden">
                      {p.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-md border border-[#e6d3b3]/15 bg-[#120b07]/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#d9c6a6]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 lg:mt-8">
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
                    <div className="group relative aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-xl lg:rounded-2xl border border-[#e6d3b3]/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17100c]/70 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="relative z-10 flex flex-col gap-1.5 border-t border-[#e6d3b3]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f7a5f]">
                    SRKR ENGINEERING COLLEGE
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f7a5f]">
                    {p.keyMetric}
                  </span>
                </div>
              </article>

              {/* Dimming overlay — animated via opacity only, keeps scroll smooth */}
              <div
                ref={(el) => {
                  overlaysRef.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 z-20 bg-[#0f0905] opacity-0"
              />
            </div>
          );
        })}
        </div>
        </div>
      </div>
    </section>
  );
}