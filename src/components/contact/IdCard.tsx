"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROFILE, CONTACT } from "@/data/profile";

const whenPreloaderDone = (fn: () => void) => {
  if ((window as Window & { __preloaderDone?: boolean }).__preloaderDone) fn();
  else window.addEventListener("preloader:done", fn, { once: true });
  return () => window.removeEventListener("preloader:done", fn);
};

/** Fake barcode — deterministic bar widths so server and client render the same. */
const BARS = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1];

/**
 * A lanyard ID card hanging from the top of the page.
 * Drops in, swings to rest, sways gently; drag it sideways and it swings back.
 */
export default function IdCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const swing = swingRef.current!;
      gsap.set(swing, { transformOrigin: "50% 0%", yPercent: -110, rotation: 0 });
      gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.6 });

      const idle = () =>
        gsap.fromTo(
          swing,
          { rotation: -1.4 },
          { rotation: 1.4, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );

      const enter = () => {
        const tl = gsap.timeline();
        tl.to(swing, { yPercent: 0, duration: 1.2, ease: "power3.out" })
          .to(shadowRef.current, { opacity: 1, scaleX: 1, duration: 1, ease: "power2.out" }, "<0.4")
          .fromTo(
            swing,
            { rotation: 10 },
            { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.22)" },
            "<0.15"
          )
          .add(idle);
      };
      return whenPreloaderDone(() => setTimeout(enter, 0));
    },
    { scope: rootRef }
  );

  // ---- drag to swing ----
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  const onDown = contextSafe((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, active: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    gsap.killTweensOf(swingRef.current);
  });

  const onMove = contextSafe((e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    if (drag.current.active) {
      const dx = e.clientX - drag.current.x;
      gsap.to(swingRef.current, { rotation: gsap.utils.clamp(-32, 32, -dx * 0.16), duration: 0.25, ease: "power2.out" });
      return;
    }
    // hover: subtle 3D tilt toward the cursor
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotationY: px * 14, rotationX: -py * 10, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
  });

  const release = contextSafe(() => {
    if (drag.current.active) {
      drag.current.active = false;
      gsap.to(swingRef.current, {
        rotation: 0,
        duration: 2.6,
        ease: "elastic.out(1, 0.2)",
        onComplete: () => {
          gsap.fromTo(
            swingRef.current,
            { rotation: -1.4 },
            { rotation: 1.4, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 }
          );
        },
      });
    }
  });

  const onLeave = contextSafe(() => {
    gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" });
  });

  const initials = PROFILE.fullName
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div ref={rootRef} className="relative flex flex-col items-center">
      <div ref={swingRef} className="relative z-10 flex flex-col items-center will-change-transform">
        {/* strap */}
        <div className="relative h-[18vh] w-[30px] overflow-hidden rounded-b-sm bg-[repeating-linear-gradient(90deg,#2a1b12_0_3px,#36231a_3px_6px)] shadow-[inset_0_0_6px_rgba(43,29,21,0.3)] sm:h-[22vh] sm:w-[34px]">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#d9915a]/30" />
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.35em] text-[#d9915a]/80 [writing-mode:vertical-rl] rotate-180">
            chandrani.dev · chandrani.dev
          </p>
        </div>

        {/* metal clip */}
        <div className="relative -mt-1 flex flex-col items-center">
          <div className="h-[18px] w-[44px] rounded-[6px] border-[4px] border-[#9d968b] bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.5)] [border-top-color:#d6d0c4] [border-left-color:#c2bcb0]" />
          <div className="-mt-[2px] h-[38px] w-[14px] rounded-b-[6px] bg-gradient-to-r from-[#7d776d] via-[#e3ddd2] to-[#8a8478] shadow-[0_2px_3px_rgba(0,0,0,0.45)]" />
        </div>

        {/* card */}
        <div
          ref={cardRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={release}
          onPointerCancel={release}
          onPointerLeave={() => {
            release();
            onLeave();
          }}
          className="relative -mt-3 w-[270px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:w-[300px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* plastic sleeve */}
          <div className="rounded-[22px] border border-[#2b1d15]/15 bg-white/45 p-[10px] shadow-[0_30px_60px_-20px_rgba(43,29,21,0.35)]">
            <div className="mx-auto mb-2 h-[9px] w-[54px] rounded-full bg-background shadow-[inset_0_1px_3px_rgba(43,29,21,0.45)]" />

            <div className="paper overflow-hidden rounded-[14px]">
              {/* header band */}
              <div className="flex items-center justify-between bg-[#2b1d15] px-4 py-2.5">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#d9915a]/60 font-mono text-[9px] font-semibold text-[#d9915a]">
                    CM
                  </span>
                  <span className="font-display text-sm font-semibold tracking-tight text-[#f1e6d2]">
                    chandrani<span className="text-[#a88f72]">.dev</span>
                  </span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#a88f72]">Dev · {PROFILE.year}</span>
              </div>

              <div className="px-5 pb-4 pt-5">
                {/* photo */}
                <div className="mx-auto aspect-[4/5] w-[58%] overflow-hidden rounded-lg border border-[#4a3426]/20 bg-[linear-gradient(160deg,#d8c19c,#b89a70)] shadow-[0_8px_16px_-8px_rgba(46,31,22,0.5)]">
                  {CONTACT.photo ? (
                    <img src={CONTACT.photo} alt={PROFILE.fullName} draggable={false} className="h-full w-full scale-[1.5] object-cover object-[50%_38%] [transform-origin:50%_40%]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-5xl font-semibold tracking-tight text-[#2b1d15]/70">
                      {initials}
                    </div>
                  )}
                </div>

                {/* fields */}
                <dl className="mt-5 space-y-2.5">
                  {[
                    ["Name", PROFILE.fullName],
                    ["Role", PROFILE.role],
                    ["Email", CONTACT.email],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-3 border-b border-[#4a3426]/15 pb-1.5">
                      <dt className="w-12 shrink-0 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8a6f58]">{k}</dt>
                      <dd className="truncate text-[13px] font-medium text-[#2e1f16]">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* barcode */}
                <div className="mt-4 flex items-end justify-between">
                  <div className="flex h-7 items-stretch gap-[2px]" aria-hidden>
                    {BARS.map((w, i) => (
                      <span key={i} className="bg-[#2e1f16]" style={{ width: w }} />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-[#8a6f58]">CM-{PROFILE.year}</span>
                </div>
              </div>

              <div className="h-1.5 bg-[#d9915a]" />
            </div>
          </div>
        </div>
      </div>

      {/* floor shadow */}
      <div
        ref={shadowRef}
        aria-hidden
        className="mt-6 h-5 w-[230px] rounded-[50%] bg-[#2b1d15]/20 blur-md"
      />
      
    </div>
  );
}
