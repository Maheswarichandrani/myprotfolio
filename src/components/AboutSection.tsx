"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { ABOUT_SLIDES } from "@/data/profile";
import CustomButton from "@/components/CustomButton";

gsap.registerPlugin(ScrollTrigger);

const COUNT = ABOUT_SLIDES.length;

const PLACEHOLDERS = [
  "from-[#d9c6a6] via-[#bfa47e] to-[#8a6f58]",
  "from-[#cbb38d] via-[#a68863] to-[#6e5442]",
  "from-[#e0cfb2] via-[#b79a73] to-[#7c604b]",
  "from-[#c7ad86] via-[#9c7e5b] to-[#5c4636]",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null); // the overflow-hidden "window" that holds the list
  const listRef = useRef<HTMLDivElement>(null);
  const numColRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".about-slide");
      const items = gsap.utils.toArray<HTMLElement>(".about-item");

      // helper: y-offset so that `items[i]` sits vertically centered inside clipRef
      const centerY = (i: number) => {
        const container = clipRef.current;
        const item = items[i];
        if (!container || !item) return 0;
        return -(item.offsetTop + item.offsetHeight / 2 - container.offsetHeight / 2);
      };

      const media = gsap.utils.toArray<HTMLElement>(".about-media");

      // Clip-path only on the slide wrapper; scale lives on the inner media as a
      // pure GPU transform → image stays crisp (no re-raster blur, no opacity mud).
      gsap.set(slides, { zIndex: (i) => i, willChange: "clip-path" });
      gsap.set(media, { force3D: true, willChange: "transform" });
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(slides[0], { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(media.slice(1), { scale: 1.12, yPercent: 6 });
      gsap.set(items.slice(1), { opacity: 0.3 });
      gsap.set(listRef.current, { y: centerY(0) });

      const SLOT = 1;      // one scroll "unit" per slide
      const WINDOW = 0.8;  // most of the unit is spent transitioning → slow, readable
      const EASE = "power2.inOut"; // symmetric: gentle start, gentle settle (no snap)

      const tl = gsap.timeline({
        defaults: { ease: EASE, duration: WINDOW },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8, // short catch-up on top of Lenis → silky, never jerky
        },
      });

      for (let i = 0; i < COUNT - 1; i++) {
        const start = (i + 1) * SLOT - WINDOW / 2;

        // outgoing: drifts up + eases back slightly (parallax under the wipe)
        tl.to(media[i], { scale: 1.04, yPercent: -6 }, start);

        // incoming: clean curtain wipe from the bottom, image settles into place
        tl.to(slides[i + 1], { clipPath: "inset(0% 0% 0% 0%)" }, start);
        tl.to(media[i + 1], { scale: 1, yPercent: 0 }, start);

        // text list centers the active item
        tl.to(listRef.current, { y: () => centerY(i + 1) }, start);
        tl.to(items[i], { opacity: 0.3 }, start);
        tl.to(items[i + 1], { opacity: 1 }, start);

        tl.to(numColRef.current, { y: `${-(i + 1)}em` }, start);
      }

      // pad timeline to exactly COUNT units so each slide owns an equal scroll zone
      // (matches scrollToSlide math)
      tl.set({}, {}, COUNT * SLOT);
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
    <section ref={sectionRef} id="about" className="relative h-[600vh] bg-background mt-24 lg:mt-36">
      <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden section-container py-8 sm:py-12 lg:flex-row lg:gap-12 lg:py-12">
        {/* image stack */}
        <div className="relative h-[34vh] overflow-hidden rounded-3xl border border-line lg:h-auto lg:w-[58%]">
          {ABOUT_SLIDES.map((slide, i) => (
            <div key={i} className="about-slide absolute inset-0 overflow-hidden">
              <div className={`about-media relative h-full w-full bg-gradient-to-br ${PLACEHOLDERS[i]} overflow-hidden`}>
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading={i === 0 ? "eager" : "lazy"}
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

          {/* clip window — list now centers the active item instead of top-aligning it */}
          <div ref={clipRef} className="relative mt-6 min-h-0 flex-1 overflow-hidden">
            <div ref={listRef} className="flex flex-col gap-16 will-change-transform pb-24">
              {ABOUT_SLIDES.map((slide, i) => (
                <div key={i} onClick={() => scrollToSlide(i)} className="about-item cursor-pointer space-y-3 pb-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-rose font-medium">
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
                      <CustomButton href={slide.link.href} target="_blank" rel="noopener noreferrer" isFlowing className="text-xs">
                        View Live — {slide.link.label} ↗
                      </CustomButton>
                    </div>
                  )}
                  <div className="flex max-w-[52ch] flex-wrap gap-2 rounded-xl border border-line bg-surface-2/60 p-3.5">
                    {slide.tags.map((tag, ti) => (
                      <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-dim font-medium">
                        {tag}
                        {ti < slide.tags.length - 1 && <span className="ml-2 text-foreground/20">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* fades now sit top AND bottom since content is centered, not top-anchored */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}