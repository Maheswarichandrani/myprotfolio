"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuArrowUpRight } from "react-icons/lu";
import { PROJECTS } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");
const host = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "");
const LIVE = PROJECTS.filter((p) => p.status === "Live").length;

/* fanned resting pose for the three screens (front → back) */
const FAN = [
  { x: 0, y: 6, r: 0, s: 1 },
  { x: -24, y: -8, r: -7, s: 0.9 },
  { x: 24, y: -8, r: 7, s: 0.9 },
];

/**
 * Mobile / tablet stand-in for the desktop flip book: one tactile "case files"
 * card whose screenshots fan out as it scrolls in, leading to /projects.
 */
export default function ProjectsTeaser() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shots = gsap.utils.toArray<HTMLElement>(".tz-shot");
      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tz-head", {
          opacity: 0,
          y: 18,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });

        // screens start stacked, then deal out into a fan
        gsap.set(shots, { xPercent: -50, yPercent: -40, rotation: 0, scale: 0.92, opacity: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".tz-card", start: "top 78%" } });
        tl.from(".tz-card", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" })
          .to(shots, { opacity: 1, duration: 0.3, stagger: 0.06 }, "-=0.5")
          .to(
            shots,
            {
              xPercent: (i: number) => FAN[i].x - 50,
              yPercent: (i: number) => FAN[i].y - 50,
              rotation: (i: number) => FAN[i].r,
              scale: (i: number) => FAN[i].s,
              duration: 1.1,
              ease: "back.out(1.3)",
              stagger: 0.05,
            },
            "-=0.15"
          )
          .from(".tz-foot", { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" }, "-=0.6");

        // the front screen breathes gently while idle
        gsap.to(shots[0], { y: -6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: reduce)", () => {
        shots.forEach((el, i) =>
          gsap.set(el, { xPercent: FAN[i].x - 50, yPercent: FAN[i].y - 50, rotation: FAN[i].r, scale: FAN[i].s })
        );
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="section-container pb-24 pt-6 sm:pb-28 sm:pt-10 lg:hidden">
      <p className="tz-head font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Client Work</p>
      <h2 className="tz-head mt-3 font-display text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
        Products in Production
      </h2>
      <p className="tz-head mt-4 max-w-[40ch] text-[15px] leading-relaxed text-dim">
        Real products with real users — designed, built and shipped end to end.
      </p>

      <Link
        href="/projects"
        aria-label={`Open the case files — ${PROJECTS.length} products`}
        className="tz-card board group relative mt-10 block overflow-hidden rounded-[1.75rem] text-[#f6efe6] shadow-[0_40px_70px_-36px_rgba(35,24,17,0.6)] transition-transform duration-300 active:scale-[0.985]"
      >
        <div aria-hidden className="board-grid pointer-events-none absolute inset-0" />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[9rem] font-semibold leading-none tracking-[-0.06em] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(246,239,230,0.08)" }}
        >
          {pad(PROJECTS.length)}
        </span>

        {/* top bar */}
        <div className="relative flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f6efe6]/55">Case files</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#f6efe6]/75">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#7fb069]/60" />
              <span className="relative h-full w-full rounded-full bg-[#7fb069]" />
            </span>
            {LIVE} live
          </span>
        </div>

        {/* fanned screens */}
        <div className="relative mx-auto mt-6 h-[13.5rem] w-full max-w-md sm:h-[17rem]">
          {PROJECTS.slice(0, 3).map((p, i) => {
            return (
              <div
                key={p.title}
                className="tz-shot absolute left-1/2 top-1/2 w-[62%] overflow-hidden rounded-xl border border-white/10 bg-[#fcf9f4] shadow-[0_24px_40px_-18px_rgba(0,0,0,0.65)]"
                style={{ zIndex: 10 - i, transform: "translate(-50%, -50%)" }}
              >
                <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-2.5 py-1.5">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1 w-1 rounded-full bg-black/20" />
                  ))}
                  <span className="ml-1 truncate font-mono text-[8px] text-[#6f5a4b]">{host(p.link)}</span>
                </div>
                <div className="relative aspect-[16/10]">
                  <Image src={p.image} alt="" fill sizes="(min-width: 640px) 280px, 62vw" className="object-cover object-top" />
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="tz-foot relative mt-6 flex items-end justify-between gap-4 border-t border-white/10 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">
              Open the case files
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f6efe6]/50">
              {pad(PROJECTS.length)} products · stack · impact
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9915a] text-[#1e150f] transition-transform duration-500 group-hover:rotate-45 group-active:rotate-45">
            <LuArrowUpRight size={20} />
          </span>
        </div>
      </Link>
    </div>
  );
}
