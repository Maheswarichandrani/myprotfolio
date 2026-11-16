"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuChevronRight } from "react-icons/lu";
import ProjectsTeaser from "@/components/projects/ProjectsTeaser";
import { PROJECTS, PROFILE, type Project } from "@/data/profile";
import { TECH_ICONS } from "@/lib/tech-icons";
import { useRouter } from "next/navigation";
import { useLenis } from "@/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Book model
   leaf 0       front = cover board        back = left page of P1
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
  return <span className="font-mono text-[min(1.8cqw,1.7cqh)] tabular-nums text-[#8a7262]">{pad(n)}</span>;
}

/** Screenshot inside a minimal browser window. */
function BrowserShot({ p }: { p: Project }) {
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${p.title}`}
      className="group block overflow-hidden rounded-[min(1.4cqw,1.3cqh)] border border-[#231811]/10 bg-white shadow-[0_18px_36px_-22px_rgba(35,24,17,0.45)] transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      <div className="flex items-center gap-[1.6cqw] border-b border-[#231811]/[0.07] px-[2cqw] py-[1.1cqh]">
        <span className="flex gap-[0.8cqw]">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-[min(1.2cqw,1.1cqh)] w-[min(1.2cqw,1.1cqh)] rounded-full bg-[#231811]/15" />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-[#231811]/[0.05] px-[2cqw] py-[0.3cqh] text-center font-mono text-[min(1.7cqw,1.6cqh)] text-[#6f5a4b]">
          {host(p.link)}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#2b1d15]">
        <Image src={p.image} alt={p.title} fill sizes="(min-width: 1280px) 560px, 45vw" className="object-cover" />
      </div>
    </a>
  );
}

/* ---------- pages ---------- */

const LIVE = PROJECTS.filter((p) => p.status === "Live").length;
const COVER_STATS = [
  { k: "Products", v: pad(N) },
  { k: "Live", v: pad(LIVE) },
  { k: "In build", v: pad(N - LIVE) },
];

function CoverPage() {
  return (
    <div className="board page-cq relative h-full w-full overflow-hidden rounded-r-[16px] rounded-l-[6px] shadow-[0_40px_80px_-36px_rgba(35,24,17,0.45)]">
      {/* spine hinge */}
      <div className="absolute inset-y-0 left-0 w-[3.5%] bg-gradient-to-r from-black/35 to-transparent" />
      <div className="absolute inset-y-0 left-[3.5%] w-px bg-white/[0.06]" />

      {/* oversized outlined count — the one bold gesture on the cover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[6%] -right-[4%] select-none font-display text-[min(62cqw,58cqh)] font-semibold leading-none tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(246,239,230,0.09)" }}
      >
        {pad(N)}
      </span>

      <div className="relative flex h-full flex-col py-[9%] pl-[12%] pr-[9%]">
        <div className="flex items-center justify-between font-mono text-[min(1.8cqw,1.7cqh)] uppercase tracking-[0.25em] text-[#f6efe6]/50">
          <span>Selected Work</span>
          <span>{PROFILE.year}</span>
        </div>

        <div className="my-auto">
          <span className="inline-flex items-center gap-[1.4cqw] rounded-full border border-white/10 px-[2cqw] py-[0.8cqh] font-mono text-[min(1.7cqw,1.6cqh)] uppercase tracking-[0.2em] text-[#f6efe6]/70">
            <span className="relative flex h-[min(1.3cqw,1.2cqh)] w-[min(1.3cqw,1.2cqh)]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#7fb069]/60" />
              <span className="relative h-full w-full rounded-full bg-[#7fb069]" />
            </span>
            Running in production
          </span>
          <h3 className="mt-[3.5cqh] font-display text-[min(11cqw,10cqh)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#f6efe6]">
            Selected
            <br />
            Works<span className="text-[#d9915a]">.</span>
          </h3>
          <p className="mt-[3cqh] max-w-[30ch] text-[min(2.7cqw,2.5cqh)] leading-relaxed text-[#f6efe6]/55">
            Real products, real users — designed, built and shipped end to end.
          </p>
        </div>

        <dl className="flex border-t border-white/10 pt-[3cqh]">
          {COVER_STATS.map((s, i) => (
            <div key={s.k} className={`flex flex-1 flex-col-reverse ${i ? "border-l border-white/10 pl-[4cqw]" : ""}`}>
              <dt className="mt-[1.2cqh] font-mono text-[min(1.6cqw,1.5cqh)] uppercase tracking-[0.2em] text-[#f6efe6]/45">
                {s.k}
              </dt>
              <dd className="font-display text-[min(5cqw,4.6cqh)] font-semibold leading-none tracking-[-0.03em] text-[#f6efe6]">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
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
                className="inline-flex items-center gap-[1cqw] rounded-[min(1cqw,1cqh)] border border-line bg-white/80 px-[1.6cqw] py-[0.7cqh] font-mono text-[min(2cqw,1.9cqh)] text-foreground"
              >
                {Icon && <Icon className="h-[min(2.2cqw,2.1cqh)] w-[min(2.2cqw,2.1cqh)] text-[#3a2a1f]" />}
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
            className="group inline-flex items-center gap-[1cqw] rounded-[min(1.2cqw,1.1cqh)] bg-foreground px-[2.6cqw] py-[1.1cqh] text-[min(2.5cqw,2.4cqh)] font-medium text-[#fcf9f4] transition-colors duration-300 hover:bg-rose"
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
        className="group mt-[5cqh] inline-flex items-center gap-[1.4cqw] self-start rounded-[min(1.2cqw,1.1cqh)] bg-foreground px-[3.6cqw] py-[1.6cqh] text-[min(2.8cqw,2.65cqh)] font-medium text-[#fcf9f4] transition-colors duration-300 hover:bg-rose"
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
            <div className="board absolute inset-y-0 left-1/2 z-0 w-1/2 rounded-r-[16px] shadow-[0_40px_80px_-36px_rgba(35,24,17,0.45)]">
              <div className="sheet sheet-edges-right absolute bottom-[10px] left-0 right-[12px] top-[10px] rounded-r-[8px]">
                <ClosingRight onContact={toContact} />
              </div>
            </div>

            {/* leaf 0 — the cover */}
            <div className="leaf absolute inset-y-0 left-1/2 w-1/2">
              <div className="leaf-face">
                <CoverPage />
                <div className="shade-front pointer-events-none absolute inset-0 rounded-r-[16px] bg-gradient-to-r from-black/40 to-black/10 opacity-0" />
              </div>
              <div className="leaf-face leaf-back board rounded-l-[16px]">
                <div className="sheet sheet-edges-left absolute bottom-[10px] left-[12px] right-0 top-[10px] rounded-l-[8px]">
                  <LeftPage p={PROJECTS[0]} i={0} />
                </div>
                <div className="shade-back pointer-events-none absolute inset-0 rounded-l-[16px] bg-gradient-to-l from-black/30 to-transparent" />
              </div>
            </div>

            {/* leaves 1…N — sheets */}
            {PROJECTS.map((p, j) => (
              <div key={p.title} className="leaf absolute bottom-[10px] left-1/2 top-[10px] w-[calc(50%-12px)]">
                <div className="leaf-face sheet sheet-right rounded-r-[8px]">
                  <RightPage p={p} i={j} />
                  <div className="shade-front pointer-events-none absolute inset-0 bg-gradient-to-r from-[#231811]/30 to-[#231811]/5 opacity-0" />
                </div>
                <div className="leaf-face leaf-back sheet sheet-left rounded-l-[8px]">
                  {j + 1 < N ? <LeftPage p={PROJECTS[j + 1]} i={j + 1} /> : <ClosingLeft />}
                  <div className="shade-back pointer-events-none absolute inset-0 bg-gradient-to-l from-[#231811]/25 to-transparent" />
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

      {/* ================= mobile / tablet: one inviting door to /projects ================= */}
      <ProjectsTeaser />
    </section>
  );
}
