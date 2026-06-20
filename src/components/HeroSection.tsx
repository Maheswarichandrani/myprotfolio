"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import ScrollCue from "@/components/ScrollCue";

/* ------------------------------------------------------------------ */
/* Achievement photos — swap src + label for your own images.          */
/* Order here maps 1:1 to the scatter origins + final positions below. */
/* ------------------------------------------------------------------ */
const PHOTOS = [
  { id: "hackathon-prize", src: "/hackathon_prize.png", label: "5th Prize Winner" },
  { id: "stage-presentation", src: "/stage_presentation.png", label: "Innovation Pitch" },
  { id: "team-victory", src: "/team_victory.png", label: "Team Lead" },
  { id: "certificate-award", src: "/certificate_award.png", label: "Academic Excellence" },
  // tall portrait source — needs a portrait frame so it isn't cropped to a strip
  { id: "project-demo", src: "/project_demo.png", label: "Project Showcase", portrait: true },
  { id: "event-participation", src: "/event_participation.png", label: "Hackathon Finalist" },
];

/* Round ring — 6 cards evenly framing the centred content (clockwise   */
/* from top-left). Even hexagonal spread so the scatter reads "round".  */
const TARGETS_DESKTOP = [
  { x: "-29vw", y: "-29vh", r: -6 }, // top-left
  { x: "29vw", y: "-29vh", r: 6 }, //  top-right
  { x: "39vw", y: "3vh", r: 4 }, //    right
  { x: "25vw", y: "31vh", r: -5 }, //  bottom-right
  { x: "-25vw", y: "31vh", r: 5 }, //  bottom-left
  { x: "-39vw", y: "3vh", r: -4 }, //  left
];

/* Mobile: two rows (top + bottom) so the whole horizontal middle band   */
/* stays clear for the centred text + buttons — no card sits over it.     */
const TARGETS_MOBILE = [
  { x: "-25vw", y: "-29vh", r: -5 }, // top-left
  { x: "25vw", y: "-29vh", r: 5 }, //  top-right
  { x: "0vw", y: "-37vh", r: -3 }, //  top-centre (above the pair)
  { x: "25vw", y: "30vh", r: -4 }, //  bottom-right
  { x: "-25vw", y: "30vh", r: 4 }, //  bottom-left
  { x: "0vw", y: "38vh", r: 3 }, //    bottom-centre
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".photo-card");
      const HERO_CONTENT = ".hero-content";
      const HERO_FADES = ".hero-fade";

      // Store each card's resting rotation so hover-out can return to it.
      const remember = (targets: typeof TARGETS_DESKTOP) =>
        cards.forEach((c, i) => c.setAttribute("data-rotate", String(targets[i].r)));

      // Drop everything straight into place (reduced-motion / fallback).
      const settleInstantly = (targets: typeof TARGETS_DESKTOP) => {
        remember(targets);
        cards.forEach((card, i) =>
          gsap.set(card, { x: targets[i].x, y: targets[i].y, rotation: targets[i].r, scale: 1, autoAlpha: 1 })
        );
        gsap.set([HERO_CONTENT, HERO_FADES], { autoAlpha: 1, y: 0 });
      };

      // The full three-phase choreography.
      const play = (targets: typeof TARGETS_DESKTOP) => {
        remember(targets);

        // Per-card tiny offsets so the centre pile reads like a stack of
        // photos, not one card. Deterministic-ish via index.
        const stack = cards.map((_, i) => ({
          x: gsap.utils.random(-18, 18),
          y: gsap.utils.random(-14, 14),
          r: gsap.utils.random(-9, 9),
          z: 10 + i, // later cards sit on top of the pile
        }));

        // Reset: everything collapsed at dead centre, invisible.
        cards.forEach((card, i) =>
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.6, autoAlpha: 0, zIndex: stack[i].z })
        );
        gsap.set(HERO_CONTENT, { autoAlpha: 0 });
        gsap.set(HERO_FADES, { autoAlpha: 0, y: 28 });

        // Built paused — only starts once the preloader hands over.
        const tl = gsap.timeline({ defaults: { ease: LUXE }, paused: true });

        // ── Phase 1 · Photos drop into the centre ONE BY ONE, stacking ──
        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              x: stack[i].x,
              y: stack[i].y,
              rotation: stack[i].r,
              scale: 1,
              autoAlpha: 1,
              duration: 0.55,
              ease: "back.out(1.7)",
            },
            i === 0 ? 0 : ">-0.30" // overlap a little → steady one-by-one cadence
          );
        });

        // Brief beat once the full stack has gathered.
        tl.to({}, { duration: 0.4 });

        // ── Phase 2 · Scatter outward into the round ring ──
        cards.forEach((card, i) => {
          tl.to(
            card,
            { x: targets[i].x, y: targets[i].y, rotation: targets[i].r, zIndex: 10, duration: 1.2 },
            i === 0 ? ">" : "<0.06" // small stagger off the first
          );
        });

        // ── Phase 3 · Brand reveal (overlaps the scatter) ──
        tl.to(HERO_CONTENT, { autoAlpha: 1, duration: 0.1 }, "-=0.95");
        tl.to(HERO_FADES, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9 }, "-=0.8");

        // Ends static — no ambient drift.
        return tl;
      };

      // The hero must not animate while the full-screen preloader is up,
      // or the whole choreography burns off unseen behind it. Wait for the
      // preloader's handover event (with a global-flag fallback in case it
      // already finished before this mounted).
      const preloaderDone = () =>
        (window as Window & { __preloaderDone?: boolean }).__preloaderDone === true;
      const whenReady = (fn: () => void) => {
        if (preloaderDone()) fn();
        else window.addEventListener("preloader:done", fn, { once: true });
      };

      // matchMedia handles breakpoints AND reduced-motion, with auto-cleanup.
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          isDesktop: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
          isMobile: "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as Record<string, boolean>;

          // Hide everything up front so nothing flashes under the preloader.
          gsap.set(cards, { autoAlpha: 0 });
          gsap.set([HERO_CONTENT, HERO_FADES], { autoAlpha: 0 });

          if (reduce) {
            const t = window.innerWidth >= 1024 ? TARGETS_DESKTOP : TARGETS_MOBILE;
            whenReady(() => settleInstantly(t));
            return;
          }

          const tl = play(isDesktop ? TARGETS_DESKTOP : TARGETS_MOBILE);
          whenReady(() => tl.play(0));
        }
      );
    },
    { scope: containerRef }
  );

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.12,
      rotation: 0,
      zIndex: 50,
      boxShadow: "0 30px 70px rgba(0,0,0,0.9)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = parseFloat(e.currentTarget.getAttribute("data-rotate") || "0");
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: r,
      zIndex: 10,
      boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24"
    >
      {/* Uniform background grid (full-bleed, like the reference) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Floating achievement cards */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {PHOTOS.map((photo) => (
          <div
            key={photo.id}
            data-rotate="0"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{ willChange: "transform, opacity" }}
            className="photo-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[4/3] w-[6.25rem] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-[2px] sm:w-40 md:w-48 lg:w-56 xl:w-64"
          >
            <img
              src={photo.src}
              alt={photo.label}
              draggable={false}
              className={`h-full w-full select-none rounded-xl ${
                photo.portrait ? "object-contain" : "object-cover"
              }`}
            />
            <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/75 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur-md sm:text-[9px]">
              {photo.label}
            </div>
          </div>
        ))}
      </div>

      {/* Centre brand text */}
      <div className="hero-content relative z-20 flex max-w-[88%] flex-col items-center text-center sm:max-w-md md:max-w-lg lg:max-w-xl">
        <p className="hero-fade font-mono text-[11px] uppercase tracking-[0.3em] text-silver-dim sm:text-sm">
          Hi, I&apos;m Chandrani Maheswari
        </p>
        <p className="hero-fade mt-5 max-w-[28ch] text-balance text-lg font-medium leading-snug text-foreground sm:text-xl md:text-2xl lg:text-[1.7rem]">
          Full-stack developer crafting production-grade products —{" "}
          <span className="silver-text">integrating AI</span> to build smarter,
          more intuitive experiences.
        </p>
        <div className="hero-fade mt-9 flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="btn-silver inline-flex items-center justify-center rounded-[6px] px-6 py-3 font-sans text-sm font-semibold transition-colors duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-[6px] border border-line-strong px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:bg-white/[0.06]"
          >
            Contact Me
          </a>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}