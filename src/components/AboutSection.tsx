"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { ABOUT_SLIDES } from "@/data/profile";
import { LUXE } from "@/lib/ease";

gsap.registerPlugin(ScrollTrigger);

const COUNT = ABOUT_SLIDES.length;

// gradient placeholders until real images land in ABOUT_SLIDES
const PLACEHOLDERS = [
  "from-zinc-800 via-zinc-900 to-black",
  "from-neutral-700 via-zinc-900 to-black",
  "from-stone-800 via-neutral-900 to-black",
  "from-zinc-700 via-stone-900 to-black",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const numColRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".about-slide");
      const items = gsap.utils.toArray<HTMLElement>(".about-item");

      gsap.set(slides.slice(1), { autoAlpha: 0, scale: 1.05 });
      gsap.set(items.slice(1), { opacity: 0.25, filter: "blur(2px)" });

      const setActive = (next: number) => {
        const prev = activeRef.current;
        if (next === prev) return;
        activeRef.current = next;

        // incoming on top, wiping in from top-left to bottom-right;
        // outgoing stays opaque beneath until covered (no background flash)
        gsap.killTweensOf([slides[prev], slides[next]]);
        slides.forEach((s, i) =>
          gsap.set(s, { zIndex: i === next ? 2 : i === prev ? 1 : 0 })
        );
        gsap.to(slides[prev], { scale: 0.96, duration: 1.2, ease: LUXE });
        gsap.fromTo(
          slides[next],
          { autoAlpha: 0, scale: 1.06, clipPath: "inset(0% 100% 100% 0%)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: LUXE,
            onComplete: () => gsap.set(slides[prev], { autoAlpha: 0, scale: 1 }),
          }
        );
        gsap.to(slides[next], { autoAlpha: 1, duration: 0.35, ease: "power1.out" });

        // slide the list so the active block sits at the top of the clip window
        gsap.to(listRef.current, {
          y: -items[next].offsetTop,
          duration: 1.1,
          ease: LUXE,
          overwrite: "auto",
        });
        items.forEach((el, i) => {
          if (i === next) {
            gsap.fromTo(
              el,
              { opacity: 0.25, filter: "blur(8px)" },
              { opacity: 1, filter: "blur(0px)", duration: 1.1, ease: LUXE, overwrite: "auto" }
            );
            gsap.fromTo(
              el.children,
              { y: 16 },
              { y: 0, stagger: 0.06, duration: 1.0, ease: LUXE, overwrite: "auto" }
            );
          } else {
            gsap.to(el, {
              opacity: 0.25,
              filter: "blur(2px)",
              duration: 0.9,
              ease: LUXE,
              overwrite: "auto",
            });
          }
        });

        gsap.to(numColRef.current, {
          y: `${-next}em`,
          duration: 0.9,
          ease: LUXE,
          overwrite: "auto",
        });
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setActive(Math.min(COUNT - 1, Math.floor(self.progress * COUNT)));
        },
      });
    },
    { scope: sectionRef }
  );

  const scrollToSlide = (i: number) => {
    const el = sectionRef.current;
    if (!el || !lenis) return;
    const zone = (el.offsetHeight - window.innerHeight) / COUNT;
    lenis.scrollTo(el.offsetTop + zone * i + zone / 2);
  };

  return (
    <section ref={sectionRef} id="about" className="relative h-[400vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden p-5 sm:p-8 lg:flex-row lg:gap-12 lg:p-12">
        {/* image stack */}
        <div className="relative h-[34vh] overflow-hidden rounded-3xl border border-line lg:h-auto lg:w-[58%]">
          {ABOUT_SLIDES.map((slide, i) => (
            <div key={i} className="about-slide absolute inset-0 will-change-transform">
              <div
                className={`relative h-full w-full bg-gradient-to-br ${PLACEHOLDERS[i]} overflow-hidden`}
              >
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <span className="font-clash absolute right-6 bottom-4 text-[clamp(4rem,12vw,9rem)] leading-none font-medium text-foreground/5 select-none">
                  0{i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* content panel */}
        <div className="flex min-h-0 flex-1 flex-col lg:py-4">
          <div className="flex items-end justify-between">
            <h2 className="font-clash text-[clamp(1.5rem,3vw,2.5rem)] leading-none font-medium text-foreground">
              About Me
            </h2>
            <div className="flex items-baseline gap-2">
              <div className="h-[1em] overflow-hidden text-[clamp(1.5rem,3vw,2.5rem)] leading-none">
                <div ref={numColRef} className="font-clash leading-none font-medium">
                  {ABOUT_SLIDES.map((_, i) => (
                    <div key={i} className="silver-text h-[1em] leading-none">
                      0{i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                / 0{COUNT}
              </span>
            </div>
          </div>

          <div className="mt-5 border-t border-line" />

          {/* clip window — list translates inside it */}
          <div className="relative mt-8 min-h-0 flex-1 overflow-hidden">
            <div ref={listRef} className="flex flex-col gap-12 will-change-transform">
              {ABOUT_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className="about-item cursor-pointer"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-silver">
                    {slide.label}
                  </span>
                  <h3 className="font-clash mt-3 max-w-[20ch] text-[clamp(1.4rem,2.6vw,2.25rem)] leading-[1.12] font-medium text-foreground">
                    {slide.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-dim lg:text-base">
                    {slide.body}
                  </p>
                  {slide.link && (
                    <a
                      href={slide.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-5 inline-flex items-center gap-2 rounded-[6px] border border-line-strong px-4 py-2.5 font-sans text-xs font-medium text-foreground transition-colors duration-300 hover:bg-foreground/[0.06]"
                    >
                      View Live — {slide.link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                  <div className="mt-5 flex max-w-[52ch] flex-wrap gap-2 rounded-xl border border-line bg-foreground/[0.03] p-4">
                    {slide.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-wider text-dim"
                      >
                        {tag}
                        {ti < slide.tags.length - 1 && (
                          <span className="ml-2 text-foreground/15">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* soft fade at the bottom of the clip window */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
