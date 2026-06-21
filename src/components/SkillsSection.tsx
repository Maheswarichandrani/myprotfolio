"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuChevronDown } from "react-icons/lu";
import { LUXE } from "@/lib/ease";
import { TECH_ICONS } from "@/lib/tech-icons";

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = [
  {
    category: "Languages",
    description: "Core programming languages used to write robust, efficient logic.",
    skills: ["Java", "JavaScript", "TypeScript", "Python"],
  },
  {
    category: "Frontend",
    description: "Frameworks and libraries for building interactive, beautiful, and responsive interfaces.",
    skills: ["Next.js", "React", "React Native", "Redux", "Tailwind CSS"],
  },
  {
    category: "Backend",
    description: "Server-side technologies, API design, and backend logic.",
    skills: ["Node.js", "Express.js", "Spring Boot"],
  },
  {
    category: "Databases",
    description: "Relational and NoSQL storage systems designed for scalability and speed.",
    skills: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    category: "Tools & DevOps",
    description: "Essential development utilities, version control, and cloud platforms.",
    skills: ["Git", "GitHub", "Vercel", "VS Code", "Postman", "Docker"],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number>(1); // Frontend open by default

  useGSAP(
    () => {
      // reveal header elements
      gsap.from(".skills-head", {
        autoAlpha: 0,
        y: 45,
        duration: 1,
        stagger: 0.12,
        ease: LUXE,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // reveal accordion items
      gsap.from(".skills-accordion-item", {
        autoAlpha: 0,
        y: 35,
        duration: 1,
        stagger: 0.1,
        ease: LUXE,
        scrollTrigger: {
          trigger: ".skills-accordion-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section ref={sectionRef} id="skills" className="relative bg-background py-24 sm:py-32">
      {/* top separation line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="px-5 sm:px-10 lg:px-14">
        {/* Header */}
        <p className="skills-head font-mono text-[10px] uppercase tracking-[0.35em] text-silver">
          My Expertise
        </p>
        <h2 className="skills-head silver-text font-clash mt-5 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-semibold">
          Skills & Tools
        </h2>
        <p className="skills-head mt-5 max-w-[46ch] text-sm leading-relaxed text-dim lg:text-base">
          A curated collection of languages, frameworks, databases, and backend technologies I use to build scalable web applications.
        </p>

        {/* Accordion Container */}
        <div className="skills-accordion-container mt-16 w-full border-t border-line">
          {SKILLS_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.category}
                className="skills-accordion-item border-b border-line transition-colors duration-300 hover:bg-white/[0.01]"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="flex w-full items-center justify-between py-6 text-left focus:outline-none sm:py-8"
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-clash text-lg font-medium text-foreground sm:text-xl md:text-2xl">
                      {item.category}
                    </h3>
                    <p className="text-xs text-dim sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-line-strong bg-white/[0.03] text-silver transition-transform duration-300">
                    <LuChevronDown
                      size={18}
                      className={`transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-3 pb-8 pt-2">
                      {item.skills.map((skillName) => {
                        const Icon = TECH_ICONS[skillName];
                        return (
                          <div
                            key={skillName}
                            className="inline-flex items-center gap-2 rounded-[6px] border border-line-strong bg-white/[0.04] px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-white/[0.08]"
                          >
                            {Icon && <Icon className="text-silver text-base" />}
                            <span className="font-sans text-xs sm:text-sm">
                              {skillName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
