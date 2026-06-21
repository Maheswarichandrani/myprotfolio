"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuTrophy } from "react-icons/lu";
import { LUXE } from "@/lib/ease";
import { ACADEMIC_PROJECTS } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";

gsap.registerPlugin(ScrollTrigger);

export default function AcademicSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".acad-card");

      // heading reveal
      gsap.from(".acad-head", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        stagger: 0.12,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      cards.forEach((card, i) => {
        // entrance reveal of each card's content
        gsap.from(card.querySelectorAll(".acad-anim"), {
          autoAlpha: 0,
          y: 40,
          filter: "blur(8px)",
          duration: 1,
          stagger: 0.12,
          ease: LUXE,
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        // stacked-card: previous card scales down + dims as next slides over it
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.92,
            autoAlpha: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1].parentElement,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="academic" className="relative bg-background py-24">
      <div className="px-5 sm:px-10 lg:px-14">
        <p className="acad-head font-mono text-[10px] uppercase tracking-[0.35em] text-silver">
          Academic Projects
        </p>
        <h2 className="acad-head silver-text font-clash mt-5 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-semibold">
          Hackathon Projects
        </h2>
        <p className="acad-head mt-5 max-w-[46ch] text-sm leading-relaxed text-dim lg:text-base">
          Built and shipped during hackathons hosted at SRKR Engineering College
          — fast, real builds under pressure.
        </p>
      </div>

      {ACADEMIC_PROJECTS.map((p, i) => (
        <div
          key={p.name}
          className="sticky top-0 flex min-h-screen items-center px-5 sm:px-10 lg:px-14"
        >
          <article className="acad-card relative grid w-full origin-top gap-8 overflow-hidden rounded-3xl bg-surface-2 p-6 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.15),0_8px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-25px_rgba(0,0,0,0.9),0_8px_30px_-10px_rgba(0,0,0,0.7)] ring-1 ring-line will-change-transform sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12">
            {/* radial accent */}
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(600px_circle_at_20%_20%,rgba(43, 43, 43, 0.06),transparent_60%)]" />

            {/* left — name, tagline, desc, tech */}
            <div className="relative z-10 flex flex-col justify-center lg:col-span-3">
              <p className="acad-anim font-mono text-[10px] uppercase tracking-[0.3em] text-silver-dim">
                0{i + 1} / 0{ACADEMIC_PROJECTS.length}
              </p>
              <h3 className="acad-anim silver-text font-clash mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold">
                {p.name}
              </h3>
              <p className="acad-anim mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                {p.tagline}
              </p>
              <p className="acad-anim mt-5 max-w-[42ch] text-sm leading-relaxed text-dim">
                {p.description}
              </p>
              <div className="acad-anim mt-6 flex flex-wrap gap-1.5">
                {p.tech.map((t) => {
                  const Icon = TECH_ICONS[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-foreground/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/75"
                    >
                      {Icon && <Icon className="text-silver text-[1.15em]" />}
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* center — image */}
            <div className="relative z-10 lg:col-span-6">
              <div className="acad-img relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-line">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* right — achievement + github */}
            <div className="relative z-10 flex flex-col justify-center gap-6 lg:col-span-3">
              <div className="acad-anim flex items-start gap-3 rounded-2xl border border-line bg-foreground/[0.03] p-4">
                <LuTrophy className="mt-0.5 shrink-0 text-lg text-silver" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {p.achievement}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                    Achievement
                  </p>
                </div>
              </div>

              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acad-anim inline-flex items-center justify-center gap-2 rounded-[6px] border border-line-strong px-5 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/[0.06]"
                >
                  View GitHub <span aria-hidden>↗</span>
                </a>
              )}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acad-anim inline-flex items-center justify-center gap-2 rounded-[6px] border border-line-strong px-5 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/[0.06]"
                >
                  View Live <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}
