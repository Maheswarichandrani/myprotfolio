"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/** Short closing statement on the home page — the full details live on /contact. */
export default function ContactCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-in", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="contact" className="relative border-y border-line bg-background py-24 sm:py-32">
      <div className="section-container">
        <p className="cta-in max-w-[30ch] font-display text-[clamp(1.6rem,3.6vw,2.9rem)] font-normal leading-[1.25] tracking-[-0.02em] text-foreground">
          Let&apos;s build and ship something remarkable.{" "}
          <span className="text-silver-dim">
            Open to freelance work and full-time roles — remote or on-site.
          </span>
        </p>

        <Link
          href="/contact"
          className="cta-in group mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground"
        >
          <span className="text-2xl font-light leading-none text-silver-dim transition-colors duration-300 group-hover:text-rose">
            {"{"}
          </span>
          <span className="transition-colors duration-300 group-hover:text-rose">Let&apos;s work together</span>
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          <span className="text-2xl font-light leading-none text-silver-dim transition-colors duration-300 group-hover:text-rose">
            {"}"}
          </span>
        </Link>
      </div>
    </section>
  );
}
