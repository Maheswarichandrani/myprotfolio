"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TECH_ICONS } from "@/lib/tech-icons";
import { CONTACT } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

/* Pinned notes on a board — one per skill group, joined by a dashed trail. */
const NOTES = [
  {
    title: "Frontend",
    note: "Fast, accessible, responsive interfaces.",
    skills: ["Next.js", "React", "React Native", "Redux", "TanStack Query", "Tailwind CSS"],
    tint: "#f3dcc6",
    pin: "#d9915a",
    tilt: -2.5,
  },
  {
    title: "Backend",
    note: "APIs, auth and business logic.",
    skills: ["Node.js", "Express.js", "NestJS", "Spring Boot"],
    tint: "#efe3c9",
    pin: "#c9a46a",
    tilt: 2,
  },
  {
    title: "Databases",
    note: "Storing, querying and caching data.",
    skills: ["PostgreSQL", "MongoDB", "Redis"],
    tint: "#ecd5cf",
    pin: "#b0614f",
    tilt: -1.5,
  },
  {
    title: "Tools & DevOps",
    note: "Version control, testing and shipping.",
    skills: ["Git", "GitHub", "Docker", "Postman", "Vercel", "VS Code"],
    tint: "#e4e1c8",
    pin: "#7f8f5a",
    tilt: 2.5,
  },
  {
    title: "Languages",
    note: "The foundation under every layer.",
    skills: ["TypeScript", "JavaScript", "Java", "Python"],
    tint: "#ebdfd2",
    pin: "#8a6f58",
    tilt: -2,
  },
];

/** offset of `el` inside `root`, ignoring CSS transforms (stable while notes animate) */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [trail, setTrail] = useState({ d: "", w: 0, h: 0 });

  // build the dashed trail through every pin (and on to the avatar)
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const measure = () => {
      const pts = [...board.querySelectorAll<HTMLElement>(".sk-anchor")].map((el) => offsetWithin(el, board));
      if (pts.length < 2) return;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const midY = (a.y + b.y) / 2;
        d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
      }
      setTrail({ d, w: board.offsetWidth, h: board.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.from(".sk-head", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      // each note drops onto the board, then its pin pops in
      gsap.utils.toArray<HTMLElement>(".sk-note").forEach((note) => {
        const tilt = Number(note.dataset.tilt ?? 0);
        const pin = note.querySelector(".sk-pin");
        const tl = gsap.timeline({ scrollTrigger: { trigger: note, start: "top 85%" } });
        tl.fromTo(
          note,
          { opacity: 0, y: -36, rotation: tilt * 3 },
          { opacity: 1, y: 0, rotation: tilt, duration: 0.9, ease: "back.out(1.6)" }
        ).fromTo(pin, { scale: 0, y: -10 }, { scale: 1, y: 0, duration: 0.45, ease: "back.out(3)" }, "-=0.35");
      });

      gsap.fromTo(
        ".sk-end",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: ".sk-end", start: "top 90%" } }
      );

    },
    { scope: sectionRef }
  );

  // separate context: re-measuring the trail must not replay the note animations
  useGSAP(
    () => {
      if (!trail.d) return;
      // the dashed trail draws itself with scroll (revealed through a mask)
      gsap.fromTo(
        ".sk-trail-mask",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: boardRef.current, start: "top 85%", end: "bottom 65%", scrub: 0.5 },
        }
      );
    },
    { scope: sectionRef, dependencies: [trail.d] }
  );

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden bg-background section-padding">
      {/* ruled board */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 31px, var(--line) 31px 32px)" }}
      />

      <div className="section-container relative">
        <div className="text-center">
          <p className="sk-head font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Skills &amp; Tools</p>
          <h2 className="sk-head mt-3 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
            The stack I build with
          </h2>
          <p className="sk-head mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-dim lg:text-base">
            Everything I use to take a product from idea to production — pinned in one place.
          </p>
        </div>

        <div ref={boardRef} className="relative mx-auto mt-16 max-w-4xl lg:mt-20">
          {/* dashed trail, behind the notes */}
          {trail.d && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={trail.w}
              height={trail.h}
              viewBox={`0 0 ${trail.w} ${trail.h}`}
            >
              <defs>
                <mask id="sk-trail-reveal" maskUnits="userSpaceOnUse" x="-50" y="-50" width={trail.w + 100} height={trail.h + 100}>
                  <path
                    className="sk-trail-mask"
                    d={trail.d}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="8"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </mask>
              </defs>
              {/* full route, always visible but quiet */}
              <path
                d={trail.d}
                fill="none"
                stroke="var(--line-strong)"
                strokeOpacity="0.6"
                strokeWidth="1.4"
                strokeDasharray="6 7"
                strokeLinecap="round"
              />
              {/* highlighted progress — fills in as you scroll */}
              <path
                d={trail.d}
                fill="none"
                stroke="var(--rose)"
                strokeWidth="2.6"
                strokeDasharray="6 7"
                strokeLinecap="round"
                mask="url(#sk-trail-reveal)"
              />
            </svg>
          )}

          <div className="relative flex flex-col">
            {NOTES.map((n, i) => {
              const right = i % 2 === 1;
              return (
                <div
                  key={n.title}
                  className={`flex ${right ? "justify-end" : "justify-start"} ${i > 0 ? "mt-8 sm:-mt-10" : ""}`}
                >
                  <article
                    data-tilt={n.tilt}
                    className="sk-note relative w-[88%] sm:w-[68%] md:w-[56%] lg:w-[48%]"
                    style={{ transform: `rotate(${n.tilt}deg)` }}
                  >
                    {/* pushpin */}
                    <span className="sk-anchor absolute left-1/2 top-0 z-10 h-0 w-0" />
                    <span
                      className="sk-pin absolute left-1/2 top-0 z-10 -ml-[11px] -mt-[13px] h-[22px] w-[22px] rounded-full shadow-[0_6px_8px_-2px_rgba(0,0,0,0.55)]"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), ${n.pin} 38%, ${n.pin} 62%, rgba(0,0,0,0.35))`,
                      }}
                    />

                    <div
                      className="paper relative overflow-hidden rounded-2xl p-6 shadow-[0_24px_40px_-20px_rgba(43,29,21,0.35)] sm:p-7"
                      style={{ backgroundColor: n.tint, backgroundBlendMode: "multiply" }}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ background: `linear-gradient(160deg, ${n.tint}cc, transparent 70%)` }}
                      />
                      <div className="relative">
                        <span className="font-display text-2xl font-semibold text-[#a4582a]">0{i + 1}</span>
                        <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {n.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-foreground/70">{n.note}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {n.skills.map((name) => {
                            const Icon = TECH_ICONS[name];
                            return (
                              <span
                                key={name}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#4a3426]/15 bg-[#fbf6ec]/70 px-2.5 py-1.5 text-[13px] font-medium text-foreground"
                              >
                                {Icon && <Icon size={13} className="text-[#4a3426]" />}
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}

            {/* end of the trail */}
            <div className="sk-end mt-14 flex items-center justify-center gap-3 sm:mt-16">
              <span className="sk-anchor relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-rose bg-surface-2">
                {CONTACT.photo && (
                  <img
                    src={CONTACT.photo}
                    alt=""
                    className="h-full w-full scale-[1.9] object-cover object-[50%_38%] [transform-origin:50%_36%]"
                  />
                )}
              </span>
              <p className="text-sm leading-tight text-dim">
                <span className="font-medium text-foreground">Always learning</span>
                <br />
                exploring AI/ML next
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
