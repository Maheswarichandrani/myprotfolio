"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { ACADEMIC_PROJECTS } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const N = ACADEMIC_PROJECTS.length;
const pad = (n: number) => String(n).padStart(2, "0");

/* resting pose by depth in the deck (0 = top card) */
const SLOT = [
  { y: 0, r: 0, s: 1 },
  { y: 18, r: -3.5, s: 0.94 },
  { y: 34, r: 3, s: 0.88 },
];
const slot = (depth: number) => SLOT[Math.min(depth, SLOT.length - 1)];

const FLING_DISTANCE = 90; // px past which a release sends the card away
const FLING_VELOCITY = 0.6; // px/ms — a quick flick also counts

/**
 * Phones / tablets: academic projects as a physical deck.
 * Swipe (or tap the arrows) to send the top card to the back.
 */
export default function AcademicDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [order, setOrder] = useState(() => ACADEMIC_PROJECTS.map((_, i) => i));
  const orderRef = useRef(order);
  const busy = useRef(false);
  const dealt = useRef(false);
  const drag = useRef({ id: -1, x0: 0, dx: 0, t0: 0, moved: false, justDragged: false });

  /** move every card to the pose of its depth */
  const layout = useCallback((ord: number[], duration = 0.65) => {
    ord.forEach((idx, depth) => {
      const el = cardsRef.current[idx];
      if (!el) return;
      const s = slot(depth);
      gsap.set(el, { zIndex: 10 - depth });
      gsap.to(el, {
        x: 0,
        y: s.y,
        rotation: s.r,
        scale: s.s,
        opacity: 1,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
      el.inert = depth > 0; // only the top card is interactive / focusable
    });
  }, []);

  // re-stack after every shuffle (the first layout is done by the deal-in)
  useLayoutEffect(() => {
    orderRef.current = order;
    if (dealt.current) layout(order);
  }, [order, layout]);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { opacity: 0, y: 90, rotation: 0, scale: 0.9 });
        gsap.set(".deck-ui", { opacity: 0, y: 14 });

        const deal = gsap.timeline({
          paused: true,
          onComplete: () => {
            dealt.current = true;
          },
        });
        // deal from the bottom of the deck up, so the top card lands last
        [...orderRef.current].reverse().forEach((idx) => {
          const depth = orderRef.current.indexOf(idx);
          const s = slot(depth);
          const el = cardsRef.current[idx];
          if (!el) return;
          gsap.set(el, { zIndex: 10 - depth });
          el.inert = depth > 0;
          deal.to(el, { opacity: 1, y: s.y, rotation: s.r, scale: s.s, duration: 0.8, ease: "back.out(1.25)" }, "<0.14");
        });
        deal.to(".deck-ui", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");
        // a small nudge that says "I move"
        const top = cardsRef.current[orderRef.current[0]];
        deal
          .to(top, { x: -34, rotation: -4, duration: 0.45, ease: "power2.out" }, "+=0.15")
          .to(top, { x: 0, rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.55)" });

        ScrollTrigger.create({ trigger: rootRef.current, start: "top 75%", once: true, onEnter: () => deal.play() });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        layout(orderRef.current, 0);
        dealt.current = true;
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ---------- shuffle ---------- */

  const sendToBack = (dir: 1 | -1) => {
    if (busy.current || !dealt.current) return;
    busy.current = true;
    const ord = orderRef.current;
    const top = ord[0];
    const el = cardsRef.current[top];
    if (!el) return void (busy.current = false);
    gsap.to(el, {
      x: dir * el.offsetWidth * 1.15,
      rotation: dir * 16,
      opacity: 0,
      duration: 0.42,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => {
        gsap.set(el, { x: 0, rotation: 0, zIndex: 0 });
        orderRef.current = [...ord.slice(1), top];
        setOrder(orderRef.current);
        busy.current = false;
      },
    });
  };

  const bringBack = () => {
    if (busy.current || !dealt.current) return;
    const ord = orderRef.current;
    const last = ord[ord.length - 1];
    const el = cardsRef.current[last];
    if (!el) return;
    gsap.set(el, { x: -el.offsetWidth * 1.15, y: 0, rotation: -16, scale: 1, opacity: 0, zIndex: 20 });
    orderRef.current = [last, ...ord.slice(0, -1)];
    setOrder(orderRef.current);
  };

  const goTo = (idx: number) => {
    const steps = orderRef.current.indexOf(idx);
    if (steps <= 0 || busy.current) return;
    // rotate the deck so `idx` is on top
    const ord = orderRef.current;
    orderRef.current = [...ord.slice(steps), ...ord.slice(0, steps)];
    setOrder(orderRef.current);
  };

  /* ---------- drag the top card ---------- */

  const onPointerDown = (e: React.PointerEvent<HTMLElement>, idx: number) => {
    if (busy.current || !dealt.current || orderRef.current[0] !== idx) return;
    drag.current = { id: e.pointerId, x0: e.clientX, dx: 0, t0: e.timeStamp, moved: false, justDragged: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(d.dx) > 8) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    gsap.set(e.currentTarget, { x: d.dx, rotation: d.dx / 18 });
    // the next card rises to meet the gap
    const next = cardsRef.current[orderRef.current[1]];
    if (next) {
      const p = Math.min(Math.abs(d.dx) / 160, 1);
      const a = slot(1);
      gsap.set(next, { y: a.y * (1 - p), rotation: a.r * (1 - p), scale: a.s + (1 - a.s) * p });
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLElement>, cancelled = false) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    drag.current.id = -1;
    if (!d.moved) return;
    d.justDragged = true;
    const v = d.dx / Math.max(1, e.timeStamp - d.t0);
    if (!cancelled && (Math.abs(d.dx) > FLING_DISTANCE || Math.abs(v) > FLING_VELOCITY)) {
      sendToBack(d.dx > 0 ? 1 : -1);
    } else layout(orderRef.current, 0.55);
  };

  const active = order[0];

  return (
    <div ref={rootRef} className="section-container">
      <div className="grid pb-10">
        {ACADEMIC_PROJECTS.map((p, i) => (
          <article
            key={p.name}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            onPointerDown={(e) => onPointerDown(e, i)}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endDrag(e)}
            onPointerCancel={(e) => endDrag(e, true)}
            onClickCapture={(e) => {
              // a drag that ends over the button must not open the link
              if (drag.current.justDragged) {
                e.preventDefault();
                e.stopPropagation();
                drag.current.justDragged = false;
              }
            }}
            aria-roledescription="card"
            aria-label={`${p.name} — ${i + 1} of ${N}`}
            className={`relative col-start-1 row-start-1 cursor-grab select-none overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${p.bgGradient} p-5 text-[#f1e6d2] shadow-[0_30px_60px_-28px_rgba(23,16,12,0.75)] will-change-transform active:cursor-grabbing sm:p-7`}
            style={{ touchAction: "pan-y" }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,164,106,0.1),transparent_65%)]" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5 rounded-full border border-[#e6d3b3]/15 bg-[#120b07]/50 py-1.5 pl-1.5 pr-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6d3b3]/10 font-clash text-xs font-bold">
                  {p.name.charAt(0)}
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d9c6a6]">
                  {p.isWinner ? "Hackathon winner" : "Academic build"}
                </span>
              </div>
              <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-[#8f7a5f]">
                {pad(i + 1)} / {pad(N)}
              </span>
            </div>

            <p className="relative mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a46a]">
              {p.category}
            </p>
            <p className="relative mt-2 flex items-start gap-2 font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-wider text-[#d9c6a6]">
              <span aria-hidden>{p.isWinner ? "🏆" : "⚡"}</span>
              {p.achievement}
            </p>
            <h3 className="relative mt-2 font-clash text-[clamp(2.1rem,9vw,3rem)] font-medium uppercase leading-[0.98] tracking-tight">
              {p.name}
            </h3>
            <p className="relative mt-3 text-[14px] leading-relaxed text-[#d9c6a6]">{p.description}</p>

            <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-xl border border-[#e6d3b3]/10">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="pointer-events-none h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17100c]/50 via-transparent to-transparent" />
            </div>

            <ul className="relative mt-5 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-[#e6d3b3]/15 bg-[#120b07]/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#d9c6a6]"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="relative mt-6 flex items-center justify-between gap-4 border-t border-[#e6d3b3]/10 pt-4">
              {(p.github || p.link) && (
                <a
                  href={p.github || p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f1e6d2] px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#1e150f]"
                >
                  {p.github ? "View GitHub" : "View Live"} <LuArrowUpRight />
                </a>
              )}
              <span className="text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#8f7a5f]">
                {p.keyMetric}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* controls */}
      <div className="deck-ui mt-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous project"
          onClick={bringBack}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line-strong text-foreground transition-colors active:bg-surface-2"
        >
          <LuArrowLeft size={17} />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {ACADEMIC_PROJECTS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-label={`Show ${p.name}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="flex h-6 cursor-pointer items-center px-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? "w-6 bg-rose" : "w-1.5 bg-foreground/20"
                  }`}
                />
              </button>
            ))}
          </div>
          <p aria-live="polite" className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim">
            Swipe to shuffle · {pad(active + 1)}/{pad(N)}
          </p>
        </div>

        <button
          type="button"
          aria-label="Next project"
          onClick={() => sendToBack(-1)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-colors active:bg-rose"
        >
          <LuArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
