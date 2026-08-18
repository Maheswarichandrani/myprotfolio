"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { ABOUT_SLIDES } from "@/data/profile";
import { LUXE } from "@/lib/ease";
import CustomButton from "@/components/CustomButton";

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
      gsap.set(items.slice(1), { opacity: 0.3 });

      const setActive = (next: number) => {
        const prev = activeRef.current;
        if (next === prev) return;
        activeRef.current = next;

        // incoming image stack wiping in
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

        // Translate text list vertically as user scrolls
        gsap.to(listRef.current, {
          y: -items[next].offsetTop,
          duration: 1.1,
          ease: LUXE,
          overwrite: "auto",
        });

        items.forEach((el, i) => {
          if (i === next) {
            gsap.to(el, { opacity: 1, duration: 0.9, ease: LUXE, overwrite: "auto" });
            gsap.fromTo(
              el.children,
              { y: 14 },
              { y: 0, stagger: 0.05, duration: 1.0, ease: LUXE, overwrite: "auto" }
            );
          } else {
            gsap.to(el, {
              opacity: 0.3,
              duration: 0.8,
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
          const p = self.progress;
          let idx = 0;
          if (p < 0.22) idx = 0;
          else if (p < 0.45) idx = 1;
          else if (p < 0.68) idx = 2;
          else idx = 3;
          setActive(idx);
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
    <section ref={sectionRef} id="about" className="relative h-[480vh] bg-background mt-24 lg:mt-36">
      <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden section-container py-8 sm:py-12 lg:flex-row lg:gap-12 lg:py-12">
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
          <div className="flex items-end justify-between border-b border-line pb-4">
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
              <span className="font-mono text-[10px] tracking-[0.2em] text-silver-dim">
                / 0{COUNT}
              </span>
            </div>
          </div>

          {/* clip window — list translates vertically as user scrolls */}
          <div className="relative mt-6 min-h-0 flex-1 overflow-hidden">
            <div ref={listRef} className="flex flex-col gap-16 will-change-transform pb-24">
              {ABOUT_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className="about-item cursor-pointer space-y-3 pb-8"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-silver font-medium">
                    0{i + 1} — {slide.label}
                  </span>
                  <h3 className="font-clash text-[clamp(1.4rem,2.6vw,2.25rem)] leading-[1.12] font-medium text-foreground">
                    {slide.title}
                  </h3>
                  <p className="max-w-[52ch] text-sm leading-relaxed text-dim lg:text-base font-normal">
                    {slide.body}
                  </p>
                  {slide.link && (
                    <div className="pt-2">
                      <CustomButton
                        href={slide.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        isFlowing
                        className="text-xs"
                      >
                        View Live — {slide.link.label} ↗
                      </CustomButton>
                    </div>
                  )}
                  <div className="flex max-w-[52ch] flex-wrap gap-2 rounded-xl border border-line bg-surface-2/60 p-3.5">
                    {slide.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-wider text-dim font-medium"
                      >
                        {tag}
                        {ti < slide.tags.length - 1 && (
                          <span className="ml-2 text-foreground/20">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* soft fade at the bottom of the clip window */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
