"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import { PROJECTS } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE: { text: string; dim?: boolean }[] = [
  { text: "Building products used by " },
  { text: "real users", dim: true },
  { text: " and solving real problems through " },
  { text: "scalable software engineering", dim: true },
  { text: "." },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // intro reveal
      gsap.from(".proj-intro", {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.12,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // horizontal gallery — vertical scroll drives the track
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            gsap.set(progressRef.current, { scaleX: self.progress }),
        },
      });

      const ROUND_FROM = 96; // px — heavily rounded on entry
      const ROUND_TO = 24; // px — resting frame (matches rounded-3xl)

      gsap.utils.toArray<HTMLElement>(".proj-slide").forEach((slide, i) => {
        const img = slide.querySelector<HTMLElement>(".proj-img");
        // start every image rounded; it squares to its frame as it reveals
        gsap.set(img, { borderRadius: ROUND_FROM });

        const build = (tl: gsap.core.Timeline) =>
          tl
            .from(slide.querySelector(".proj-num"), {
              opacity: 0,
              x: -80,
              duration: 0.9,
              ease: LUXE,
            })
            .from(
              slide.querySelector(".proj-title"),
              { opacity: 0, y: 50, duration: 0.9, ease: LUXE },
              "-=0.6"
            )
            .from(
              slide.querySelectorAll(".proj-copy"),
              { opacity: 0, y: 30, duration: 0.8, stagger: 0.08, ease: LUXE },
              "-=0.6"
            )
            .fromTo(
              img,
              { opacity: 0, scale: 1.1, borderRadius: ROUND_FROM },
              {
                opacity: 1,
                scale: 1,
                borderRadius: ROUND_TO,
                duration: 1.2,
                ease: LUXE,
              },
              "<-=0.1"
            );

        if (i === 0) {
          // first slide is already on-screen when the section pins —
          // reveal it as the section scrolls in, not on horizontal drift
          build(
            gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse",
              },
            })
          );
        } else {
          build(
            gsap.timeline({
              scrollTrigger: {
                trigger: slide,
                containerAnimation: tween,
                start: "left 78%",
                toggleActions: "play none none reverse",
              },
            })
          );
        }

        // subtle vertical parallax against the horizontal drift
        gsap.fromTo(
          slide.querySelector(".proj-img img"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects" className="relative bg-background">
      {/* intro */}
      <div className="px-6 pt-28 pb-16 sm:px-10 lg:px-14 lg:pt-36">
        <p className="proj-intro font-mono text-[10px] uppercase tracking-[0.35em] text-silver sm:text-[11px]">
          Real World Projects
        </p>
        <h2 className="proj-intro font-clash mt-8 max-w-[24ch] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] font-medium">
          {HEADLINE.map((part, i) => (
            <span key={i} className={part.dim ? "text-white/30" : "text-foreground"}>
              {part.text}
            </span>
          ))}
        </h2>
      </div>

      {/* pinned horizontal gallery */}
      <div ref={pinRef} className="relative overflow-hidden">
        <div ref={trackRef} className="flex h-screen w-max will-change-transform">
          {PROJECTS.map((project, i) => (
            <article
              key={project.title}
              className="proj-slide relative flex h-screen w-screen flex-col gap-6 px-5 pt-16 pb-16 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:py-0"
            >
              {/* image hero — leads on mobile, sits right on desktop */}
              <div className="proj-img relative h-[32vh] shrink-0 overflow-hidden rounded-2xl border border-line lg:order-2 lg:h-[72vh] lg:flex-1 lg:rounded-3xl">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-110 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* copy */}
              <div className="relative flex min-h-0 flex-1 flex-col lg:order-1 lg:w-[42%] lg:max-w-xl lg:flex-none lg:justify-center">
                <span className="proj-num font-clash pointer-events-none hidden leading-[0.8] font-semibold text-white/[0.07] select-none [font-size:clamp(5rem,13vw,10rem)] lg:block">
                  0{i + 1}
                </span>

                <div className="lg:-mt-10">
                  <div className="proj-copy flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-silver lg:text-[10px] lg:tracking-[0.3em]">
                      <span className="text-white/30 lg:hidden">0{i + 1} — </span>
                      {project.category}
                    </span>
                    {project.highlight && (
                      <span className="rounded-full border border-line bg-white/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-silver">
                        ✦ {project.highlight}
                      </span>
                    )}
                  </div>

                  <h3 className="proj-title font-clash mt-3 text-[clamp(2rem,5vw,4rem)] leading-none font-semibold text-foreground lg:mt-4">
                    {project.title}
                  </h3>

                  <p className="proj-copy mt-3 max-w-[48ch] text-sm leading-relaxed text-dim lg:mt-5 lg:text-base">
                    {project.description}
                  </p>

                  <p className="proj-copy mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-silver-dim lg:mt-5 lg:text-[10px]">
                    Role — <span className="text-foreground/80">{project.role}</span>
                  </p>

                  {project.contributions && (
                    <ul className="proj-copy mt-4 hidden grid-cols-2 gap-x-6 gap-y-1.5 lg:grid">
                      {project.contributions.map((c) => (
                        <li key={c} className="text-xs leading-relaxed text-dim">
                          <span className="mr-2 text-white/25">—</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="proj-copy mt-4 flex flex-wrap gap-1.5 lg:mt-5 lg:gap-2">
                    {project.tech.map((t) => {
                      const Icon = TECH_ICONS[t];
                      return (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/75 lg:border-line-strong lg:bg-white/[0.05] lg:px-3.5 lg:py-1.5 lg:text-[10px] lg:tracking-[0.12em] lg:text-foreground/85"
                        >
                          {Icon && <Icon className="text-silver text-[1.15em]" />}
                          {t}
                        </span>
                      );
                    })}
                  </div>

                  <div className="proj-copy mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 lg:mt-7 lg:justify-start lg:gap-6 lg:border-0 lg:pt-0">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-silver inline-flex items-center gap-2 rounded-full px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(192,192,192,0.18)] transition-transform duration-300 hover:-translate-y-0.5 lg:px-6 lg:py-2.5"
                    >
                      View Live <span aria-hidden>↗</span>
                    </a>
                    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-dim lg:text-[10px]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          project.status === "Live"
                            ? "bg-silver"
                            : "animate-pulse bg-silver/80"
                        }`}
                      />
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* progress line */}
        <div className="absolute bottom-8 left-1/2 z-10 w-[40vw] max-w-md -translate-x-1/2">
          <div className="h-px w-full bg-white/10">
            <div
              ref={progressRef}
              className="h-px w-full origin-left scale-x-0 bg-gradient-to-r from-silver-dim to-silver"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
