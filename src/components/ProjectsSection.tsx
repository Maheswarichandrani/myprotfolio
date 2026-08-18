"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import { PROJECTS } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";
import CustomButton from "@/components/CustomButton";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Reveal intro header
      gsap.from(".proj-intro", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Reveal Bento cards with smooth stagger
      gsap.from(".bento-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: LUXE,
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects" className="relative bg-background section-padding">
      <div className="section-container">
        {/* Intro Header */}
        <div className="mb-12 lg:mb-16">
          <p className="proj-intro font-mono text-[10px] uppercase tracking-[0.35em] text-silver sm:text-[11px]">
            Real World & Freelance Projects
          </p>
          <h2 className="proj-intro font-clash mt-3 max-w-[24ch] text-[clamp(1.85rem,4vw,3.5rem)] leading-[1.1] font-medium text-foreground">
            Products In Production
          </h2>
          <p className="proj-intro mt-4 max-w-[50ch] text-sm leading-relaxed text-dim lg:text-base">
            Scalable applications built for real users, combining modern full-stack engineering with clean, intuitive user experiences.
          </p>
        </div>

        {/* Borderless Bento Grid */}
        <div className="bento-grid grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {PROJECTS.map((project, index) => {
            const isFirst = index === 0; // Creonex (2 cols)
            const isLast = index === 2;  // TreeKart (3 cols)

            return (
              <article
                key={project.title}
                className={`bento-card group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-surface-2/40 p-6 sm:p-8 backdrop-blur-md transition-colors duration-300 hover:bg-surface-2/70 ${
                  isFirst
                    ? "lg:col-span-2"
                    : isLast
                    ? "lg:col-span-3"
                    : "lg:col-span-1"
                }`}
              >
                {/* Top Row: Category, Highlight & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver font-semibold">
                      0{index + 1} — {project.category}
                    </span>
                    {project.highlight && (
                      <span className="rounded-full bg-foreground/[0.05] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-silver">
                        ✦ {project.highlight}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        project.status === "Live"
                          ? "bg-silver"
                          : "animate-pulse bg-silver/80"
                      }`}
                    />
                    {project.status}
                  </span>
                </div>

                {/* Card Content & Image Layout */}
                <div
                  className={`my-4 grid items-center gap-6 ${
                    isFirst || isLast ? "lg:grid-cols-12 lg:gap-8" : "grid-cols-1"
                  }`}
                >
                  {/* Text Details */}
                  <div
                    className={`flex flex-col justify-center ${
                      isFirst || isLast ? "lg:col-span-6" : ""
                    }`}
                  >
                    <h3 className="font-clash text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold uppercase leading-tight text-foreground">
                      {project.title}
                    </h3>

                    <p className="mt-3 max-w-[46ch] font-sans text-sm font-normal leading-relaxed text-dim">
                      {project.description}
                    </p>

                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim">
                      Role — <span className="text-foreground/90 font-medium">{project.role}</span>
                    </p>

                    {/* Tech Pills */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((t) => {
                        const Icon = TECH_ICONS[t];
                        return (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/80"
                          >
                            {Icon && <Icon className="text-silver text-[1.1em]" />}
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Frame (Borderless) */}
                  <div
                    className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-2 ${
                      isFirst || isLast ? "lg:col-span-6" : "w-full"
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
                  </div>
                </div>

                {/* Bottom Row: CTA Button */}
                <div className="flex items-center justify-between pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim">
                    {project.status === "Live" ? "Production Release" : "Development Phase"}
                  </span>

                  {project.link && (
                    <CustomButton href={project.link} target="_blank" isFlowing className="text-xs">
                      View Live ↗
                    </CustomButton>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
