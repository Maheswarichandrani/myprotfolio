"use client";

import { useRef, useState, useEffect } from "react";
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

const TARGETS_DESKTOP = [
  { x: "-29vw", y: "-29vh", r: -6 },
  { x: "29vw", y: "-29vh", r: 6 },
  { x: "39vw", y: "3vh", r: 4 },
  { x: "25vw", y: "31vh", r: -5 },
  { x: "-25vw", y: "31vh", r: 5 },
  { x: "-39vw", y: "3vh", r: -4 },
];

const TARGETS_MOBILE = [
  { x: "-25vw", y: "-29vh", r: -5 },
  { x: "25vw", y: "-29vh", r: 5 },
  { x: "0vw", y: "-37vh", r: -3 },
  { x: "25vw", y: "30vh", r: -4 },
  { x: "-25vw", y: "30vh", r: 4 },
  { x: "0vw", y: "38vh", r: 3 },
];

function HeroTypingLines() {
  const lines = [
    "HELLO!",
    "HELLO I'M MAHESWARI",
    "I'M A FULL-STACK DEVELOPER &",
    "A FREELANCER",
    "WELCOME TO MY PORTFOLIO!"
  ];

  const [isReady, setIsReady] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const preloaderDone = () =>
      (window as Window & { __preloaderDone?: boolean }).__preloaderDone === true;

    if (preloaderDone()) {
      setIsReady(true);
    } else {
      const onReady = () => setIsReady(true);
      window.addEventListener("preloader:done", onReady, { once: true });
      return () => window.removeEventListener("preloader:done", onReady);
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
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-center font-mono font-light uppercase tracking-[0.2em] text-foreground/90 text-xs sm:text-sm md:text-base leading-snug">
      {lines.map((line, idx) => {
        if (idx < currentLineIndex) {
          return <div key={idx} className="whitespace-pre-wrap">{line}</div>;
        }
        if (idx === currentLineIndex) {
          return (
            <div key={idx} className="whitespace-pre-wrap text-silver font-normal">
              {line.slice(0, currentCharIndex)}
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-silver align-middle animate-pulse" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".photo-card");
      const HERO_CONTENT = ".hero-content";
      const HERO_FADES = ".hero-fade";

      const remember = (targets: typeof TARGETS_DESKTOP) =>
        cards.forEach((c, i) => c.setAttribute("data-rotate", String(targets[i].r)));

      const settleInstantly = (targets: typeof TARGETS_DESKTOP) => {
        remember(targets);
        cards.forEach((card, i) =>
          gsap.set(card, { x: targets[i].x, y: targets[i].y, rotation: targets[i].r, scale: 1, autoAlpha: 1 })
        );
        gsap.set([HERO_CONTENT, HERO_FADES], { autoAlpha: 1, y: 0 });
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
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.6, autoAlpha: 0, zIndex: stack[i].z })
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
              duration: 0.55,
              ease: "back.out(1.7)",
            },
            i === 0 ? 0 : ">-0.30"
          );
        });

        tl.to({}, { duration: 0.4 });

        cards.forEach((card, i) => {
          tl.to(
            card,
            { x: targets[i].x, y: targets[i].y, rotation: targets[i].r, zIndex: 10, duration: 1.2 },
            i === 0 ? ">" : "<0.06"
          );
        });

        tl.to(HERO_CONTENT, { autoAlpha: 1, duration: 0.1 }, "-=0.95");
        tl.to(HERO_FADES, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9 }, "-=0.8");

        return tl;
      };

      const preloaderDone = () =>
        (window as Window & { __preloaderDone?: boolean }).__preloaderDone === true;
      const whenReady = (fn: () => void) => {
        if (preloaderDone()) fn();
        else window.addEventListener("preloader:done", fn, { once: true });
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
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44"
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
            className="photo-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[4/3] w-[6.25rem] cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface/50 p-1.5 backdrop-blur-[2px] sm:w-40 md:w-48 lg:w-56 xl:w-64"
          >
            <img
              src={photo.src}
              alt={photo.label}
              draggable={false}
              className={`h-full w-full select-none rounded-xl ${
                photo.portrait ? "object-contain" : "object-cover"
              }`}
            />
            <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-background/75 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-foreground backdrop-blur-md sm:text-[9px]">
              {photo.label}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Content: Thin font, reduced width, exact text from user image */}
      <div className="hero-content relative z-20 flex w-full max-w-sm sm:max-w-md md:max-w-lg flex-col items-center text-center px-4">
        <div className="hero-fade min-h-[10rem] sm:min-h-[12rem] flex items-center justify-center">
          <HeroTypingLines />
        </div>

        <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-4">
          <CustomButton href="#projects" isFlowing className="text-xs px-6 py-3">
            View Projects
          </CustomButton>
          <CustomButton href="#contact" className="text-xs px-6 py-3">
            Contact Me
          </CustomButton>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}