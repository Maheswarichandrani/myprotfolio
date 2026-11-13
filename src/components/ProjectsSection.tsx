"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuChevronRight } from "react-icons/lu";
import { PROJECTS, PROFILE, type Project } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";
import { useRouter } from "next/navigation";
import { useLenis } from "@/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Book model
   leaf 0       front = leather cover        back = left page of P1
   leaf j (1…N) front = right page of Pj     back = left page of P(j+1) | closing left
   base board   right page under everything  = closing right page
   Spreads: 0 closed · 1…N projects · N+1 closing
   ------------------------------------------------------------------ */
const N = PROJECTS.length;
const LEAVES = N + 1;
const LEAD = 0.35; // scroll before the cover starts to lift
const TURN = 1; // one page turn
const HOLD = 0.85; // time to read each spread
const TAIL = 0.5;
const TOTAL = LEAD + LEAVES * (TURN + HOLD) + TAIL;
const turnAt = (k: number) => LEAD + k * (TURN + HOLD);
/** scroll-time at which spread s is resting fully open */
const restAt = (s: number) => (s === 0 ? 0 : turnAt(s - 1) + TURN + HOLD * 0.45);

const pad = (n: number) => String(n).padStart(2, "0");
const host = (url?: string) => (url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "");

/* ---------- building blocks ---------- */

/** Size container + padded body. cq units inside resolve against the full page,
 *  never against the padded box or the viewport. */
function Page({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="page-cq h-full w-full">
      <div className={`relative isolate h-full w-full overflow-hidden ${className}`}>{children}</div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[min(1.9cqw,1.8cqh)] font-medium uppercase tracking-[0.2em] text-rose ${className}`}>
      {children}
    </p>
  );
}

function PageNo({ n }: { n: number }) {
  return <span className="font-mono text-[min(1.8cqw,1.7cqh)] text-[#8a6f58]">p. {pad(n)}</span>;
}

/** Screenshot inside a minimal browser window. */
function BrowserShot({ p }: { p: Project }) {
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${p.title}`}
      className="group block overflow-hidden rounded-[min(1.4cqw,1.3cqh)] border border-[#4a3426]/15 bg-[#fbf6ec] shadow-[0_20px_40px_-18px_rgba(46,31,22,0.55)] transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      <div className="flex items-center gap-[1.6cqw] border-b border-[#4a3426]/10 px-[2cqw] py-[1.1cqh]">
        <span className="flex gap-[0.8cqw]">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-[min(1.2cqw,1.1cqh)] w-[min(1.2cqw,1.1cqh)] rounded-full bg-[#4a3426]/20" />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-[#4a3426]/[0.06] px-[2cqw] py-[0.3cqh] text-center font-mono text-[min(1.7cqw,1.6cqh)] text-[#6a5141]">
          {host(p.link)}
        </span>
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-[#2b1d15]">
        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </a>
  );
}

/* ---------- pages ---------- */

function CoverPage() {
  return (
    <div className="leather page-cq relative h-full w-full overflow-hidden rounded-r-[14px] rounded-l-[4px] shadow-[0_40px_80px_-30px_rgba(43,29,21,0.35)]">
      <div className="absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      <div className="absolute inset-[6%] left-[10%] rounded-[6px] border border-[#c9a46a]/35" />

      <div className="relative flex h-full flex-col justify-between py-[12%] pl-[17%] pr-[10%]">
        <p className="font-mono text-[min(1.9cqw,1.8cqh)] uppercase tracking-[0.3em] text-[#c9a46a]/80">
          Portfolio · Vol. 01
        </p>
        <div>
          <h3 className="font-display text-[min(10cqw,9cqh)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#f1e6d2]">
            Selected
            <br />
            <span className="text-[#c9a46a]">Works</span>
          </h3>
          <div className="mt-[3cqh] h-px w-[18cqw] bg-[#c9a46a]/50" />
          <p className="mt-[3cqh] max-w-[30ch] text-[min(2.8cqw,2.6cqh)] leading-relaxed text-[#cdb99d]">
            Client projects and products running in production.
          </p>
        </div>
        <p className="font-mono text-[min(1.7cqw,1.6cqh)] uppercase tracking-[0.25em] text-[#a88f72]">{PROFILE.fullName}</p>
      </div>
    </div>
  );
}

function LeftPage({ p, i }: { p: Project; i: number }) {
  const live = p.status === "Live";
  return (
    <Page className="flex flex-col px-[8cqw] pb-[4.5cqh] pt-[6cqh]">
      <div className="flex items-center justify-between">
        <Label>Project / {pad(i + 1)}</Label>
        <span className="flex items-center gap-[1cqw] font-mono text-[min(1.8cqw,1.7cqh)] uppercase tracking-[0.15em] text-[#6a5141]">
          <span
            className={`h-[min(1.3cqw,1.2cqh)] w-[min(1.3cqw,1.2cqh)] rounded-full ${live ? "bg-[#5f8a4e]" : "bg-[#c9a46a]"}`}
          />
          {p.status}
        </span>
      </div>

      <div className="mt-[5cqh]">
        <BrowserShot p={p} />
      </div>

      <dl className="mt-auto grid grid-cols-3 gap-[3cqw] border-t border-line pt-[2.4cqh]">
        {[
          ["Type", p.kind],
          ["Domain", p.domain],
          ["Role", p.role],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-[min(1.7cqw,1.6cqh)] uppercase tracking-[0.18em] text-[#8a6f58]">{k}</dt>
            <dd className="mt-[0.8cqh] text-[min(2.5cqw,2.4cqh)] font-medium leading-snug text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-[2.4cqh]">
        <PageNo n={i * 2 + 2} />
      </div>
    </Page>
  );
}

function RightPage({ p, i }: { p: Project; i: number }) {
  return (
    <Page className="flex flex-col px-[9cqw] pb-[4.5cqh] pt-[6cqh]">
      <Label>{p.category}</Label>
      <h3 className="mt-[1.6cqh] font-display text-[min(8.6cqw,7.8cqh)] font-semibold leading-[1] tracking-[-0.035em] text-foreground">
        {p.title}
      </h3>

      <p className="mt-[2.4cqh] text-[min(3.1cqw,2.95cqh)] leading-[1.5] text-foreground/80">{p.description}</p>

      {p.contributions?.length ? (
        <div className="mt-[3cqh]">
          <Label className="text-[#8a6f58]">What I did</Label>
          <ul className="mt-[1.4cqh] space-y-[1cqh]">
            {p.contributions.map((c) => (
              <li key={c} className="flex gap-[1.8cqw]">
                <LuChevronRight className="mt-[0.3em] h-[min(2.6cqw,2.5cqh)] w-[min(2.6cqw,2.5cqh)] shrink-0 text-rose" />
                <span className="text-[min(2.8cqw,2.65cqh)] leading-[1.45] text-foreground/80">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-[3cqh]">
        <Label className="text-[#8a6f58]">Stack</Label>
        <div className="mt-[1.4cqh] flex flex-wrap gap-[1.2cqw]">
          {p.tech.map((t) => {
            const Icon = TECH_ICONS[t];
            return (
              <span
                key={t}
                className="inline-flex items-center gap-[1cqw] rounded-[min(1cqw,1cqh)] border border-line-strong bg-[#fbf6ec]/60 px-[1.6cqw] py-[0.7cqh] font-mono text-[min(2cqw,1.9cqh)] text-foreground"
              >
                {Icon && <Icon className="h-[min(2.2cqw,2.1cqh)] w-[min(2.2cqw,2.1cqh)] text-[#4a3426]" />}
                {t}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-[2.2cqh]">
        <PageNo n={i * 2 + 3} />
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-[1cqw] rounded-[min(1.2cqw,1.1cqh)] bg-foreground px-[2.6cqw] py-[1.1cqh] text-[min(2.5cqw,2.4cqh)] font-medium text-[#f3e6cc] transition-colors duration-300 hover:bg-rose"
          >
            Visit live site
            <LuArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </Page>
  );
}

function ClosingLeft() {
  return (
    <Page className="flex flex-col justify-between px-[9cqw] pb-[4.5cqh] pt-[6cqh]">
      <Label>Index</Label>
      <ol className="space-y-[2cqh]">
        {PROJECTS.map((p, i) => (
          <li key={p.title} className="flex items-baseline gap-[3cqw] border-b border-line pb-[2cqh]">
            <span className="font-mono text-[min(2cqw,1.9cqh)] text-[#8a6f58]">{pad(i + 1)}</span>
            <span className="font-display text-[min(4.4cqw,4.1cqh)] font-semibold tracking-tight text-foreground">
              {p.title}
            </span>
            <span className="ml-auto font-mono text-[min(1.8cqw,1.7cqh)] uppercase tracking-[0.15em] text-[#8a6f58]">
              {p.status}
            </span>
          </li>
        ))}
      </ol>
      <PageNo n={N * 2 + 2} />
    </Page>
  );
}

function ClosingRight({ onContact }: { onContact: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <Page className="flex flex-col justify-center px-[10cqw]">
      <Label>Next project</Label>
      <h3 className="mt-[2.5cqh] font-display text-[min(7.4cqw,7cqh)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
        Have a product in mind? Let&apos;s build it.
      </h3>
      <p className="mt-[2.5cqh] max-w-[40ch] text-[min(3cqw,2.85cqh)] leading-relaxed text-foreground/75">
        I build fast, reliable web products end to end — from interface to API to deployment.
      </p>
      <a
        href="/contact"
        onClick={onContact}
        className="group mt-[5cqh] inline-flex items-center gap-[1.4cqw] self-start rounded-[min(1.2cqw,1.1cqh)] bg-foreground px-[3.6cqw] py-[1.6cqh] text-[min(2.8cqw,2.65cqh)] font-medium text-[#f3e6cc] transition-colors duration-300 hover:bg-rose"
      >
        Get in touch
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
      <span className="absolute bottom-[4.5cqh] right-[10cqw]">
        <PageNo n={N * 2 + 3} />
      </span>
    </Page>
  );
}

/* ---------- section ---------- */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [spread, setSpread] = useState(0);
  const lenis = useLenis();
  const router = useRouter();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ---- desktop: scroll-driven flip book
      mm.add("(min-width: 1024px)", () => {
        const leaves = gsap.utils.toArray<HTMLElement>(".leaf");
        gsap.set(leaves, { transformPerspective: 2600, rotationY: 0, zIndex: (i: number) => LEAVES - i + 1 });
        gsap.set(".shade-back", { opacity: 0.5 });
        gsap.set(bookRef.current, { xPercent: -25 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            onUpdate: (self) => {
              const time = self.progress * TOTAL;
              let s = 0;
              for (let k = 0; k < LEAVES; k++) if (time >= turnAt(k) + TURN / 2) s = k + 1;
              setSpread((prev) => (prev === s ? prev : s));
            },
          },
        });
        stRef.current = tl.scrollTrigger ?? null;

        // intro: heading settles, closed book rests a beat
        tl.fromTo(".book-head", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: LEAD, ease: "power1.out" }, 0);

        leaves.forEach((leaf, k) => {
          const t = turnAt(k);
          tl.to(leaf, { rotationY: -180, duration: TURN }, t);
          tl.to(leaf.querySelector(".shade-front"), { opacity: 0.5, duration: TURN / 2, ease: "power1.in" }, t);
          tl.to(leaf.querySelector(".shade-back"), { opacity: 0, duration: TURN / 2, ease: "power1.out" }, t + TURN / 2);
          tl.set(leaf, { zIndex: k + 1 }, t + TURN / 2);
          // the cover lift also slides the book to centre the open spread
          if (k === 0) tl.to(bookRef.current, { xPercent: 0, duration: TURN }, t);
        });
        tl.to({}, { duration: TAIL });

        return () => {
          stRef.current = null;
        };
      });

      // ---- mobile / tablet: journal pages that settle into place
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".journal-card").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0, rotation: i % 2 ? 1.5 : -1.5 },
            {
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 88%" },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const goTo = (s: number) => {
    const st = stRef.current;
    if (!st) return;
    const clamped = Math.max(0, Math.min(LEAVES, s));
    const y = st.start + (st.end - st.start) * (restAt(clamped) / TOTAL);
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const toContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/contact");
  };

  const counter =
    spread === 0 ? "Cover" : spread > N ? "End" : `${pad(spread)} / ${pad(N)}`;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-background lg:h-[var(--book-h)]"
      style={{ "--book-h": `${Math.round(TOTAL * 95)}vh` } as React.CSSProperties}
    >
      {/* ================= desktop book ================= */}
      <div className="sticky top-0 hidden h-screen flex-col items-center justify-center overflow-hidden pt-[84px] pb-6 lg:flex">
        <div className="book-head section-container mb-5 flex w-full items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Client Work</p>
            <h2 className="mt-2 font-clash text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-none text-foreground">
              Products in Production
            </h2>
          </div>
          <span className="rounded-md border border-line-strong px-3 py-1 font-mono text-xs text-silver">
            {counter}
          </span>
        </div>

        <div className="section-container w-full">
        <div className="relative h-[min(calc(100svh-230px),62vw)] w-full">
          <div ref={bookRef} className="relative h-full w-full will-change-transform">
            {/* right board + closing right page (bottom of the stack) */}
            <div className="leather absolute inset-y-0 left-1/2 z-0 w-1/2 rounded-r-[14px] shadow-[0_40px_80px_-30px_rgba(43,29,21,0.35)]">
              <div className="paper page-edges-right absolute bottom-[12px] left-0 right-[14px] top-[12px] rounded-r-[6px]">
                <ClosingRight onContact={toContact} />
              </div>
            </div>

            {/* leaf 0 — the cover */}
            <div className="leaf absolute inset-y-0 left-1/2 w-1/2">
              <div className="leaf-face">
                <CoverPage />
                <div className="shade-front pointer-events-none absolute inset-0 rounded-r-[14px] bg-gradient-to-r from-black/70 to-black/20 opacity-0" />
              </div>
              <div className="leaf-face leaf-back leather rounded-l-[14px]">
                <div
                  className="paper paper-left absolute bottom-[12px] left-[14px] right-0 top-[12px] rounded-l-[6px]"
                  style={{ boxShadow: "inset -28px 0 34px -22px rgba(60,38,22,0.45), -2px 0 0 #e4d0ab, -4px 0 0 #d4bc93, -6px 0 0 #e1cba3, -8px 0 0 #cdb38a" }}
                >
                  <LeftPage p={PROJECTS[0]} i={0} />
                </div>
                <div className="shade-back pointer-events-none absolute inset-0 rounded-l-[14px] bg-gradient-to-l from-black/60 to-transparent" />
              </div>
            </div>

            {/* leaves 1…N — paper pages */}
            {PROJECTS.map((p, j) => (
              <div key={p.title} className="leaf absolute bottom-[12px] left-1/2 top-[12px] w-[calc(50%-14px)]">
                <div className="leaf-face paper paper-right rounded-r-[6px]">
                  <RightPage p={p} i={j} />
                  <div className="shade-front pointer-events-none absolute inset-0 bg-gradient-to-r from-[#3c2616]/60 to-[#3c2616]/10 opacity-0" />
                </div>
                <div className="leaf-face leaf-back paper paper-left rounded-l-[6px]">
                  {j + 1 < N ? <LeftPage p={PROJECTS[j + 1]} i={j + 1} /> : <ClosingLeft />}
                  <div className="shade-back pointer-events-none absolute inset-0 bg-gradient-to-l from-[#3c2616]/55 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          {/* page controls */}
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => goTo(spread - 1)}
            disabled={spread === 0}
            className="absolute -left-6 top-1/2 z-[80] flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-[0_8px_20px_-6px_rgba(43,29,21,0.3)] transition-all duration-500 hover:scale-105 hover:bg-rose disabled:pointer-events-none disabled:opacity-0"
          >
            <LuArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => goTo(spread + 1)}
            disabled={spread > N}
            className="absolute -right-6 top-1/2 z-[80] flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-[0_8px_20px_-6px_rgba(43,29,21,0.3)] transition-all duration-500 hover:scale-105 hover:bg-rose disabled:pointer-events-none disabled:opacity-0"
          >
            <LuArrowRight size={18} />
          </button>
        </div>
        </div>

        <p className="mt-4 font-mono text-[11px] text-silver-dim">
          {spread === 0 ? "scroll to open the book" : "scroll or use the arrows to turn the page"}
        </p>
      </div>

      {/* ================= mobile / tablet ================= */}
      <div className="section-container section-padding lg:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Client Work</p>
        <h2 className="mt-3 font-clash text-[clamp(1.85rem,7vw,2.8rem)] font-semibold leading-[1.1] text-foreground">
          Products in Production
        </h2>

        <div className="mt-12 flex flex-col gap-10">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="journal-card paper relative overflow-hidden rounded-2xl px-5 pb-6 pt-5 shadow-[0_30px_60px_-30px_rgba(43,29,21,0.35)] sm:px-8"
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-rose">Project / {pad(i + 1)}</span>
                <span className="flex items-center gap-1.5 text-[#6a5141]">
                  <span className={`h-1.5 w-1.5 rounded-full ${p.status === "Live" ? "bg-[#5f8a4e]" : "bg-[#c9a46a]"}`} />
                  {p.status}
                </span>
              </div>

              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block overflow-hidden rounded-lg border border-[#4a3426]/15 bg-[#fbf6ec] shadow-[0_14px_24px_-12px_rgba(46,31,22,0.5)]"
              >
                <div className="flex items-center gap-2 border-b border-[#4a3426]/10 px-3 py-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 rounded-full bg-[#4a3426]/20" />
                    ))}
                  </span>
                  <span className="flex-1 truncate text-center font-mono text-[10px] text-[#6a5141]">{host(p.link)}</span>
                </div>
                <img src={p.image} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </a>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-rose">{p.category}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{p.description}</p>

              {p.contributions?.length ? (
                <>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6f58]">What I did</p>
                  <ul className="mt-2 space-y-2">
                    {p.contributions.map((c) => (
                      <li key={c} className="flex gap-2.5">
                        <LuChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-rose" />
                        <span className="text-[14px] leading-snug text-foreground/80">{c}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6f58]">Stack</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tech.map((t) => {
                  const Icon = TECH_ICONS[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-[#fbf6ec]/60 px-2 py-1 font-mono text-[11px] text-foreground"
                    >
                      {Icon && <Icon className="h-3 w-3 text-[#4a3426]" />}
                      {t}
                    </span>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8a6f58]">{p.role}</span>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-foreground px-3 py-2 text-sm font-medium text-[#f3e6cc]"
                  >
                    Visit site <LuArrowUpRight />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
