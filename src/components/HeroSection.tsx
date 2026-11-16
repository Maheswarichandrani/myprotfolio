"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import ScrollCue from "@/components/ScrollCue";
import CustomButton from "@/components/CustomButton";

const PHOTOS = [
  { id: "hackathon-prize", src: "/hackathon_prize.png", label: "5th Prize Winner" },
  { id: "stage-presentation", src: "/stage_presentation.png", label: "Innovation Pitch" },
  { id: "team-victory", src: "/team_victory.png", label: "Team Lead" },
  { id: "certificate-award", src: "/certificate_award.png", label: "Academic Excellence" },
  { id: "project-demo", src: "/project_demo.png", label: "Project Showcase", portrait: true },
  { id: "event-participation", src: "/event_participation.png", label: "Hackathon Finalist" },
];

/* x = fraction of the free space inside the page container (±1 = card edge on the
   container edge), so the cards line up with every other section's width. */
const TARGETS_DESKTOP = [
  { x: -0.78, y: "-29vh", r: -6 },
  { x: 0.78, y: "-29vh", r: 6 },
  { x: 1, y: "3vh", r: 4 },
  { x: 0.62, y: "31vh", r: -5 },
  { x: -0.62, y: "31vh", r: 5 },
  { x: -1, y: "3vh", r: -4 },
];

/* phones: two tidy rows of three — above and below the intro, never over it */
const TARGETS_MOBILE = [
  { x: -1, y: "-30vh", r: -4 },
  { x: 1, y: "-30vh", r: 4 },
  { x: 0, y: "-33vh", r: -2 },
  { x: 1, y: "30vh", r: -3 },
  { x: -1, y: "30vh", r: 3 },
  { x: 0, y: "33vh", r: 2 },
];

function HeroTypingLines() {
  const lines = [
    "Hello!",
    "I'm Maheswari",
    "Full-stack developer & Applied AI engineer",
    "Welcome to my portfolio.",
  ];
  // one clear hierarchy: label → headline → role → note
  const LINE_STYLES = [
    "font-mono text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-rose mb-3",
    "font-display text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground",
    "mt-3 font-display text-[clamp(1.1rem,2.6vw,1.6rem)] font-medium tracking-[-0.02em] text-silver-dim",
    "mt-4 text-sm sm:text-base text-dim",
  ];

  const [isReady, setIsReady] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    // typing starts the moment the hero text is revealed (see HeroSection timeline)
    const shown = () => (window as Window & { __heroShown?: boolean }).__heroShown === true;

    if (shown()) {
      setIsReady(true);
    } else {
      const onReady = () => setIsReady(true);
      window.addEventListener("hero:shown", onReady, { once: true });
      return () => window.removeEventListener("hero:shown", onReady);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (currentLineIndex < lines.length) {
      if (currentCharIndex < lines[currentLineIndex].length) {
        const timer = setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, 32);
        return () => clearTimeout(timer);
      } else {
        const lineTimer = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 180);
        return () => clearTimeout(lineTimer);
      }
    }
  }, [isReady, currentLineIndex, currentCharIndex, lines]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {lines.map((line, idx) => {
        if (idx > currentLineIndex) return null;
        const typing = idx === currentLineIndex;
        return (
          <div key={idx} className={`whitespace-pre-wrap ${LINE_STYLES[idx]}`}>
            {typing ? line.slice(0, currentCharIndex) : line}
            {typing && (
              <span className="ml-[0.08em] inline-block h-[0.85em] w-[2px] translate-y-[0.1em] animate-pulse bg-rose" />
            )}
          </div>
        );
      })}
    </div>
  );
}

const announceHeroShown = () => {
  (window as Window & { __heroShown?: boolean }).__heroShown = true;
  window.dispatchEvent(new CustomEvent("hero:shown"));
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".photo-card");
      const HERO_CONTENT = ".hero-content";
      const HERO_FADES = ".hero-fade";

      /** px offset from centre for a container fraction (same box as .section-container content) */
      const xFor = (f: number, card: HTMLElement) => {
        const el = containerRef.current!;
        const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        const inner = Math.min(el.clientWidth, 86 * 16) - pad * 2;
        return f * Math.max(0, inner / 2 - card.offsetWidth / 2);
      };

      const remember = (targets: typeof TARGETS_DESKTOP) =>
        cards.forEach((c, i) => c.setAttribute("data-rotate", String(targets[i].r)));

      const settleInstantly = (targets: typeof TARGETS_DESKTOP) => {
        remember(targets);
        cards.forEach((card, i) =>
          gsap.set(card, { x: xFor(targets[i].x, card), y: targets[i].y, rotation: targets[i].r, scale: 1, autoAlpha: 1 })
        );
        gsap.set([HERO_CONTENT, HERO_FADES], { autoAlpha: 1, y: 0 });
        announceHeroShown();
      };

      const play = (targets: typeof TARGETS_DESKTOP) => {
        remember(targets);

        const stack = cards.map((_, i) => ({
          x: gsap.utils.random(-18, 18),
          y: gsap.utils.random(-14, 14),
          r: gsap.utils.random(-9, 9),
          z: 10 + i,
        }));

        cards.forEach((card, i) =>
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.6, autoAlpha: 0, zIndex: stack[i].z, force3D: true })
        );
        gsap.set(HERO_CONTENT, { autoAlpha: 0 });
        gsap.set(HERO_FADES, { autoAlpha: 0, y: 28 });

        const tl = gsap.timeline({ defaults: { ease: LUXE }, paused: true });

        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              x: stack[i].x,
              y: stack[i].y,
              rotation: stack[i].r,
              scale: 1,
              autoAlpha: 1,
              duration: 1.0,
              ease: "back.out(1.15)",
            },
            i === 0 ? 0 : ">-0.55"
          );
        });

        tl.to({}, { duration: 0.6 });

        cards.forEach((card, i) => {
          tl.to(
            card,
            { x: () => xFor(targets[i].x, card), y: targets[i].y, rotation: targets[i].r, duration: 1.8, ease: "power3.inOut" },
            i === 0 ? ">" : "<0.07"
          );
        });

        tl.set(cards, { zIndex: 10 });
        tl.to(HERO_CONTENT, { autoAlpha: 1, duration: 0.1 }, "-=1.1");
        tl.call(() => setTimeout(announceHeroShown, 0), undefined, "<");
        tl.to(HERO_FADES, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1.1 }, "-=1.0");

        return tl;
      };

      const preloaderDone = () =>
        (window as Window & { __preloaderDone?: boolean }).__preloaderDone === true;
      const imagesReady = () => {
        const imgs = Array.from(
          containerRef.current?.querySelectorAll<HTMLImageElement>(".photo-card img") ?? []
        );
        const loaded = Promise.all(
          imgs.map((img) =>
            img.complete
              ? img.decode().catch(() => {})
              : new Promise<void>((res) => {
                  img.addEventListener("load", () => res(), { once: true });
                  img.addEventListener("error", () => res(), { once: true });
                })
          )
        );
        // never wait forever on a slow network
        return Promise.race([loaded, new Promise((r) => setTimeout(r, 2500))]);
      };
      const whenReady = (fn: () => void) => {
        const start = () =>
          imagesReady().then(() =>
            requestAnimationFrame(() => requestAnimationFrame(() => fn()))
          );
        if (preloaderDone()) start();
        else window.addEventListener("preloader:done", start, { once: true });
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          isDesktop: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
          isMobile: "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as Record<string, boolean>;

          gsap.set(cards, { autoAlpha: 0 });
          gsap.set([HERO_CONTENT, HERO_FADES], { autoAlpha: 0 });

          if (reduce) {
            const t = window.innerWidth >= 1024 ? TARGETS_DESKTOP : TARGETS_MOBILE;
            whenReady(() => settleInstantly(t));
            return;
          }

          const targets = isDesktop ? TARGETS_DESKTOP : TARGETS_MOBILE;
          const tl = play(targets);
          whenReady(() => tl.play(0));

          // keep settled cards on the container edges when the window is resized
          const onResize = () => {
            if (tl.progress() < 1) return;
            cards.forEach((card, i) => gsap.set(card, { x: xFor(targets[i].x, card) }));
          };
          window.addEventListener("resize", onResize);
          return () => window.removeEventListener("resize", onResize);
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
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-[clamp(1.5rem,6vw,5rem)] py-28 sm:py-36 lg:py-44"
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
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
            className="photo-card invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[4/3] w-[6.5rem] cursor-pointer overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-[0_14px_28px_-18px_rgba(43,29,21,0.45)] sm:w-40 sm:rounded-2xl sm:p-1.5 md:w-48 lg:w-56 xl:w-64"
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl">
              <Image
                src={photo.src}
                alt={photo.label}
                fill
                preload
                draggable={false}
                sizes="(min-width: 1280px) 256px, (min-width: 1024px) 224px, (min-width: 768px) 192px, 160px"
                className={`select-none ${photo.portrait ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="pointer-events-none absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap sm:block rounded-full border border-line bg-background/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-foreground sm:text-[9px]">
              {photo.label}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Content: Thin font, reduced width, exact text from user image */}
      <div className="hero-content invisible relative z-20 flex w-full max-w-sm sm:max-w-lg md:max-w-xl flex-col items-center text-center px-4">
        <div className="hero-fade flex min-h-[12.5rem] items-center justify-center sm:min-h-[16rem]">
          <HeroTypingLines />
        </div>

        <div className="hero-fade mt-6 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <CustomButton href="#projects" isFlowing className="text-xs px-6 py-3">
            View Projects
          </CustomButton>
          <CustomButton href="/contact" className="text-xs px-6 py-3">
            Contact Me
          </CustomButton>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}