"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import { PROFILE, NAV_LINKS, SOCIAL_LINKS } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const linkStyle =
  "inline-block text-sm text-dim transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  // the runway spacer must match the footer's real height so the page
  // scrolls exactly far enough to uncover it — no further
  useEffect(() => {
    const sentinel = document.getElementById("footer-sentinel");
    const footer = footerRef.current;
    if (!sentinel || !footer) return;
    const sync = () => {
      sentinel.style.height = `${footer.offsetHeight}px`;
      ScrollTrigger.refresh();
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      // the fixed footer can't be a trigger — the sentinel spacer scrolls in its place
      gsap.from(".ft-item", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.07,
        ease: LUXE,
        scrollTrigger: {
          trigger: "#footer-sentinel",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.fromTo(
        wordRef.current,
        { yPercent: 35 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#footer-sentinel",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="fixed inset-x-0 bottom-0 z-0 overflow-hidden border-t border-line bg-surface"
    >
      {/* giant cropped background word */}
      <span
        ref={wordRef}
        className="font-clash pointer-events-none absolute bottom-0 left-0 w-full text-center text-[15vw] leading-none font-semibold tracking-tight whitespace-nowrap text-white/5 uppercase select-none will-change-transform"
      >
        Maheswari
      </span>

      <div className="relative z-10 px-6 pt-16 pb-8 sm:px-10 lg:px-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="ft-item">
            <p className="font-clash text-xl font-medium text-foreground">
              {PROFILE.fullName}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
              {PROFILE.role}
            </p>
          </div>

          <nav className="ft-item flex flex-col items-start gap-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-silver-dim">
              Navigation
            </p>
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className={linkStyle}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ft-item flex flex-col items-start gap-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-silver-dim">
              Connect
            </p>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyle}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="ft-item">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-silver-dim">
              Status
            </p>
            <p className="flex items-center gap-3 text-sm text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-silver/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-silver" />
              </span>
              Open to Work
            </p>
          </div>
        </div>

        <div className="ft-item mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
              © {PROFILE.year} {PROFILE.fullName}
            </p>
            <a
              href="https://srikardev.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim transition-colors duration-300 hover:text-foreground"
            >
              Teammate — srikardev.tech
            </a>
          </div>
          <p className="max-w-[60ch] text-xs leading-relaxed text-dim">
            Built with Next.js, TypeScript, Tailwind CSS, GSAP — and a passion
            for building impactful products.
          </p>
        </div>
      </div>
    </footer>
  );
}
