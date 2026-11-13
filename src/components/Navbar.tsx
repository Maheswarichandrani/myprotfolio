"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/providers/SmoothScrollProvider";

const LINKS = [
  // same order as the sections on the page
  { label: "About", href: "#about", num: "01" },
  { label: "Work", href: "#projects", num: "02" },
  { label: "Skills", href: "#skills", num: "03" },
  { label: "Academics", href: "#academic", num: "04" },
  { label: "Contact", href: "/contact", num: "05" },
];

const CTA = {
  label: "Resume",
  href: "https://drive.google.com/file/d/10Hk_oyprPmj1jz1Oxei6lMIVevbU7Ol4/view?usp=drive_link",
};

/** Thin accent rule that grows under the hovered / active link. */
function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-rose transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 ${
        active ? "scale-x-100" : "scale-x-0"
      }`}
    />
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hrefFor = (href: string) => (href.startsWith("/") || isHome ? href : `/${href}`);

  // condense on scroll + scroll-spy for the active chapter
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // headroom: hide while scrolling down, reveal on any scroll up, always shown near the top
      const delta = y - lastY;
      if (y < 120) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY = y;
      // on a separate route, that route's link is the active one
      if (pathname !== "/") {
        setActive(LINKS.find((l) => l.href === pathname)?.href ?? null);
        return;
      }
      const probe = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const l of LINKS) {
        if (!l.href.startsWith("#")) continue;
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top <= probe) current = l.href;
      }
      setActive(current);
    };
    // measure at most once per frame
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        onScroll();
      });
    };
    onScroll();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // gentle entrance once the preloader has dissolved
  useGSAP(
    () => {
      const play = () =>
        gsap.fromTo(
          ".nav-reveal",
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: "power2.out" }
        );
      gsap.set(".nav-reveal", { opacity: 0 });
      if ((window as Window & { __preloaderDone?: boolean }).__preloaderDone) play();
      else window.addEventListener("preloader:done", play, { once: true });
      return () => window.removeEventListener("preloader:done", play);
    },
    { scope: headerRef }
  );

  // mobile menu: soft paper sheet with staggered chapters
  useGSAP(
    () => {
      if (!open || !menuRef.current) return;
      gsap.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        ".m-item",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power2.out", delay: 0.1 }
      );
    },
    { dependencies: [open], scope: menuRef }
  );

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    // separate route (e.g. /contact)
    if (href.startsWith("/")) {
      lenis?.start();
      router.push(href);
      return;
    }
    // section anchor while on another page → go home to that section
    if (!isHome) {
      lenis?.start();
      router.push(href === "#top" ? "/" : `/${href}`);
      return;
    }
    const el = href === "#top" ? null : document.querySelector<HTMLElement>(href);
    if (href !== "#top" && !el) return;
    const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
    if (lenis) {
      lenis.start();
      // glide: short hops are quick, long jumps take a little longer — never abrupt
      const distance = Math.abs(y - window.scrollY);
      const duration = Math.min(2.2, Math.max(0.9, 0.7 + distance / 3000));
      lenis.scrollTo(y, {
        duration,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    } else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[translate,background-color,border-color] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled && !open ? "border-line bg-background/90 backdrop-blur-md" : "border-transparent bg-transparent"}`}
    >
      <nav
        className={`section-container relative flex items-center justify-between transition-[padding] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          scrolled ? "py-3.5" : "py-6"
        }`}
      >
        {/* signature */}
        <a
          href={isHome ? "#top" : "/"}
          onClick={(e) => go(e, "#top")}
          aria-label="Back to top"
          className="nav-reveal group relative z-10 flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong font-mono text-[11px] font-semibold text-rose transition-colors duration-300 group-hover:border-rose">
            CM
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
            chandrani<span className="text-silver-dim">.dev</span>
          </span>
        </a>

        {/* chapters */}
        <ul className="relative z-10 hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href} className="nav-reveal">
                <a
                  href={hrefFor(l.href)}
                  onClick={(e) => go(e, l.href)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex items-baseline gap-1.5 py-1"
                >
                  <span
                    className={`font-mono text-[10px] transition-colors duration-300 ${
                      isActive ? "text-rose" : "text-silver-dim"
                    }`}
                  >
                    {l.num}
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 group-hover:text-foreground ${
                      isActive ? "text-foreground" : "text-dim"
                    }`}
                  >
                    {l.label}
                  </span>
                  <Underline active={isActive} />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="relative z-10 flex items-center gap-3">
          {/* résumé */}
          <a
            href={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-reveal group relative hidden overflow-hidden rounded-lg border border-line-strong px-4 py-2 sm:block"
          >
            <span className="absolute inset-0 translate-y-full bg-rose transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />
            <span className="relative flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-background">
              {CTA.label}
              <span className="inline-block text-xs transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>

          {/* mobile: two-line toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="nav-reveal relative flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <span
              className={`block h-px w-6 bg-foreground transition-transform duration-500 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px bg-foreground transition-all duration-500 ${
                open ? "w-6 -translate-y-[4px] -rotate-45" : "ml-2 w-4"
              }`}
            />
          </button>
        </div>
      </nav>
    </header>

      {/* mobile / tablet menu — outside the header so `fixed` covers the viewport */}
      {open && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col bg-background px-8 pt-28 pb-10 lg:hidden"
        >
          <p className="m-item font-mono text-[10px] uppercase tracking-[0.35em] text-rose">Navigation</p>
          <ul className="mt-6 flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="m-item border-b border-line">
                <a
                  href={hrefFor(l.href)}
                  onClick={(e) => go(e, l.href)}
                  className="group flex items-baseline justify-between py-4"
                >
                  <span className="font-display text-[2rem] font-medium leading-none tracking-tight text-foreground transition-colors group-hover:text-rose">
                    {l.label}
                  </span>
                  <span className="font-mono text-xs text-silver-dim">{l.num}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
            className="m-item mt-10 self-start rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-foreground"
          >
            {CTA.label} ↗
          </a>
          <p className="m-item mt-auto font-mono text-[11px] text-silver-dim">Full Stack Developer · Open to work</p>
        </div>
      )}
    </>
  );
}
