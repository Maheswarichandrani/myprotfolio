"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { PROJECTS, PROFILE, type Project } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";
import { useLenis } from "@/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");
const host = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "");
const slug = (p: Project) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const isLive = (p: Project) => p.status === "Live";
const LIVE = PROJECTS.filter(isLive).length;

const STATS = [
  { k: "Products", v: pad(PROJECTS.length) },
  { k: "Live", v: pad(LIVE) },
  { k: "In build", v: pad(PROJECTS.length - LIVE) },
];

function StatusPill({ p }: { p: Project }) {
  const live = isLive(p);
  return (
    <span
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dim"
    >
      <span className="relative flex h-1.5 w-1.5">
        {live && <span className="absolute inset-0 animate-ping rounded-full bg-[#5f8a4e]/50" />}
        <span className={`relative h-full w-full rounded-full ${live ? "bg-[#5f8a4e]" : "bg-[#c9a46a]"}`} />
      </span>
      {p.status}
    </span>
  );
}

/** Screenshot in a minimal browser window — the frame clips open on scroll. */
function Shot({ p, priority }: { p: Project; priority?: boolean }) {
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${p.title} live site`}
      className="cs-shot group block overflow-hidden rounded-2xl border border-line bg-[#fcf9f4] shadow-[0_40px_70px_-40px_rgba(35,24,17,0.55)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-2 w-2 rounded-full bg-[#231811]/15" />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-[#231811]/[0.05] px-3 py-0.5 text-center font-mono text-[11px] text-[#6f5a4b]">
          {host(p.link)}
        </span>
        <LuArrowUpRight className="h-3.5 w-3.5 text-[#6f5a4b] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#2b1d15]">
        <Image
          src={p.image}
          alt={`${p.title} — screenshot`}
          fill
          preload={priority}
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="cs-img object-cover object-top"
        />
      </div>
    </a>
  );
}

function CaseHead({ p, i, className = "" }: { p: Project; i: number; className?: string }) {
  return (
    <div className={className}>
      <div className="cs-in flex flex-wrap items-center gap-x-4 gap-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-rose">
          {pad(i + 1)} — {p.domain}
        </p>
        <StatusPill p={p} />
      </div>
      <h2 className="cs-in mt-4 font-display text-[clamp(2.4rem,7vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground">
        {p.title}
      </h2>
    </div>
  );
}

function CaseStudy({ p, i, onNext }: { p: Project; i: number; onNext: () => void }) {
  const last = i === PROJECTS.length - 1;
  const meta = [
    ["Type", p.kind],
    ["Domain", p.domain],
    ["Role", p.role],
    ["Status", p.status],
  ];

  return (
    <section id={slug(p)} data-case={i} className="case relative border-t border-line py-20 sm:py-24 lg:py-32">
      {/* oversized index number, quietly behind the content */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-10 select-none font-display text-[clamp(7rem,22vw,16rem)] font-semibold leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px var(--line-strong)" }}
      >
        {pad(i + 1)}
      </span>

      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* mobile: title sits above the screenshot */}
        <CaseHead p={p} i={i} className="lg:hidden" />

        <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
          <Shot p={p} priority={i === 0} />
        </div>

        <div className="lg:col-span-5">
          <CaseHead p={p} i={i} className="hidden lg:block" />

          <p className="cs-in text-[16px] leading-relaxed text-foreground/80 lg:mt-6 lg:text-[17px]">{p.description}</p>

          <dl className="cs-in mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-line">
            {meta.map(([k, v], m) => (
              <div
                key={k}
                className={`bg-surface/60 p-4 ${m % 2 ? "border-l border-line" : ""} ${m > 1 ? "border-t border-line" : ""}`}
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim">{k}</dt>
                <dd className="mt-1.5 text-[14px] font-medium leading-snug text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          {p.contributions?.length ? (
            <div className="mt-10">
              <p className="cs-in font-mono text-[11px] uppercase tracking-[0.25em] text-silver-dim">What I did</p>
              <ol className="mt-3">
                {p.contributions.map((c, n) => (
                  <li key={c} className="cs-row relative flex gap-4 py-4">
                    <span className="cs-rule absolute inset-x-0 bottom-0 h-px origin-left bg-line-strong" />
                    <span className="pt-0.5 font-mono text-[11px] text-rose">{pad(n + 1)}</span>
                    <span className="text-[15px] leading-relaxed text-foreground/85">{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mt-10">
            <p className="cs-in font-mono text-[11px] uppercase tracking-[0.25em] text-silver-dim">Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech.map((t) => {
                const Icon = TECH_ICONS[t];
                return (
                  <span
                    key={t}
                    className="cs-chip inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 py-1.5 font-mono text-[12px] text-foreground"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-silver" />}
                    {t}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="cs-in mt-10 flex flex-wrap items-center gap-3">
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors duration-300 hover:bg-rose"
              >
                Visit live site
                <LuArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {!last && (
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-rose hover:text-rose"
              >
                Next case
                <LuArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const lenis = useLenis();

  // a new route always opens at the top, even with Lenis carrying state over
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lenis]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ---- which case is on screen (drives the dock) — always on
      gsap.utils.toArray<HTMLElement>(".case").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
            else if (i === 0 && self.direction < 0) setActive(-1);
          },
        });
      });
      ScrollTrigger.create({
        trigger: ".pj-end",
        start: "top 70%",
        onEnter: () => setActive(PROJECTS.length),
        onLeaveBack: () => setActive(PROJECTS.length - 1),
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ---- intro: headline rises out of its mask once the page is ready
        gsap.set(".pj-line > span", { yPercent: 110 });
        gsap.set(".pj-in", { opacity: 0, y: 18 });
        const intro = () =>
          gsap
            .timeline({ defaults: { ease: "power4.out" }, delay: 0.15 })
            .to(".pj-line > span", { yPercent: 0, duration: 1.2, stagger: 0.1 })
            .to(".pj-in", { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }, "-=0.8");

        let off: (() => void) | undefined;
        if ((window as Window & { __preloaderDone?: boolean }).__preloaderDone) intro();
        else {
          const fn = () => setTimeout(intro, 0);
          window.addEventListener("preloader:done", fn, { once: true });
          off = () => window.removeEventListener("preloader:done", fn);
        }

        // ---- each case
        gsap.utils.toArray<HTMLElement>(".case").forEach((el) => {
          const shot = el.querySelector(".cs-shot");
          const img = el.querySelector(".cs-img");

          // screenshot opens like a shutter, image settles inside
          gsap.fromTo(
            shot,
            { clipPath: "inset(10% 6% 10% 6% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              ease: "none",
              scrollTrigger: { trigger: shot, start: "top 92%", end: "top 40%", scrub: 0.6 },
            }
          );
          gsap.fromTo(
            img,
            { scale: 1.18 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: shot, start: "top 92%", end: "top 30%", scrub: 0.6 } }
          );

          gsap.from(el.querySelectorAll(".cs-in"), {
            opacity: 0,
            y: 22,
            duration: 0.9,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          });

          // contribution rules draw in, rows lift one by one
          el.querySelectorAll<HTMLElement>(".cs-row").forEach((row) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
            tl.from(row.querySelector(".cs-rule"), { scaleX: 0, duration: 0.9, ease: "power3.inOut" }).from(
              row.children[1],
              { opacity: 0, x: -10, duration: 0.6, ease: "power2.out" },
              0.1
            ).from(row.children[2], { opacity: 0, y: 10, duration: 0.7, ease: "power2.out" }, 0.15);
          });

          gsap.from(el.querySelectorAll(".cs-chip"), {
            opacity: 0,
            y: 10,
            scale: 0.94,
            duration: 0.5,
            stagger: 0.04,
            ease: "back.out(2)",
            scrollTrigger: { trigger: el.querySelector(".cs-chip"), start: "top 92%" },
          });
        });

        gsap.from(".pj-end-in", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pj-end", start: "top 75%" },
        });

        return () => off?.();
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  const scrollToCase = (i: number) => {
    const el = document.getElementById(slug(PROJECTS[i]));
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const dockOn = active >= 0 && active < PROJECTS.length;
  const current = PROJECTS[Math.max(0, Math.min(active, PROJECTS.length - 1))];

  return (
    <div ref={rootRef} className="relative">
      {/* faint grid, same as the home hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[90vh] [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="section-container relative">
        {/* ============ intro ============ */}
        <header className="pb-16 pt-32 sm:pb-20 sm:pt-40">
          <Link
            href="/#projects"
            className="pj-in group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-rose"
          >
            <LuArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back home
          </Link>

          <p className="pj-in mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-rose">
            Case files · {PROFILE.year}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,11vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-foreground">
            <span className="pj-line reveal-line block pb-[0.06em]">
              <span>Products in</span>
            </span>
            <span className="pj-line reveal-line block pb-[0.06em]">
              <span>
                production<span className="text-rose">.</span>
              </span>
            </span>
          </h1>
          <p className="pj-in mt-6 max-w-[46ch] text-[16px] leading-relaxed text-dim sm:text-lg">
            Real products with real users. Here&apos;s what each one is, what I built, and the stack behind it.
          </p>

          <dl className="pj-in mt-10 grid max-w-xl grid-cols-3 border-y border-line">
            {STATS.map((s, i) => (
              <div key={s.k} className={`py-5 ${i ? "border-l border-line pl-5" : ""}`}>
                <dd className="font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[2.4rem]">
                  {s.v}
                </dd>
                <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim">{s.k}</dt>
              </div>
            ))}
          </dl>

          {/* index — jump straight to a case */}
          <ol className="pj-in mt-12">
            {PROJECTS.map((p, i) => (
              <li key={p.title}>
                <button
                  type="button"
                  onClick={() => scrollToCase(i)}
                  className="group flex w-full cursor-pointer items-center gap-4 border-b border-line py-4 text-left first:border-t sm:gap-6"
                >
                  <span className="font-mono text-[11px] text-silver-dim">{pad(i + 1)}</span>
                  <span className="font-display text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground transition-colors duration-300 group-hover:text-rose sm:text-2xl">
                    {p.title}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-silver-dim sm:inline">
                    {p.domain}
                  </span>
                  <span className="ml-auto flex items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isLive(p) ? "bg-[#5f8a4e]" : "bg-[#c9a46a]"}`}
                      aria-hidden
                    />
                    <LuArrowRight className="text-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-rose" />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </header>

        {/* ============ case studies ============ */}
        {PROJECTS.map((p, i) => (
          <CaseStudy key={p.title} p={p} i={i} onNext={() => scrollToCase(i + 1)} />
        ))}

        {/* ============ closing ============ */}
        <section className="pj-end board relative mb-24 overflow-hidden rounded-[1.75rem] px-6 py-14 text-[#f6efe6] sm:mb-32 sm:px-12 sm:py-20">
          <div aria-hidden className="board-grid pointer-events-none absolute inset-0" />
          <div className="relative">
            <p className="pj-end-in font-mono text-[11px] uppercase tracking-[0.3em] text-[#d9915a]">Next project</p>
            <h2 className="pj-end-in mt-4 max-w-[16ch] font-display text-[clamp(2rem,6vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Have a product in mind? Let&apos;s build it.
            </h2>
            <p className="pj-end-in mt-5 max-w-[44ch] text-[15px] leading-relaxed text-[#f6efe6]/65 sm:text-base">
              I build fast, reliable web products end to end — from interface to API to deployment.
            </p>
            <div className="pj-end-in mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#d9915a] px-6 py-3 text-sm font-medium text-[#1e150f] transition-colors duration-300 hover:bg-[#f6efe6]"
              >
                Get in touch
                <LuArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-[#f6efe6] transition-colors duration-300 hover:border-[#d9915a] hover:text-[#d9915a]"
              >
                Back home
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ============ floating case dock ============ */}
      <nav
        aria-label="Case studies"
        className={`fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#231811]/95 py-2 pl-4 pr-2 text-[#f6efe6] shadow-[0_20px_40px_-16px_rgba(35,24,17,0.6)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-6 ${
          dockOn ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <span className="w-[7.5rem] truncate font-display text-sm font-semibold tracking-tight sm:w-36">
          {current.title}
        </span>
        <span className="flex items-center gap-1">
          {PROJECTS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              aria-label={`Go to ${p.title}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => scrollToCase(i)}
              className="flex h-8 cursor-pointer items-center justify-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-6 bg-[#d9915a]" : "w-1.5 bg-white/30"
                }`}
              />
            </button>
          ))}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-[#f6efe6]/55">
          {pad(Math.max(1, active + 1))}/{pad(PROJECTS.length)}
        </span>
        <button
          type="button"
          aria-label="Next case"
          onClick={() => (active < PROJECTS.length - 1 ? scrollToCase(active + 1) : document.querySelector(".pj-end")?.scrollIntoView({ behavior: "smooth" }))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f6efe6] text-[#231811] transition-colors hover:bg-[#d9915a]"
        >
          <LuArrowRight size={14} />
        </button>
      </nav>
    </div>
  );
}
