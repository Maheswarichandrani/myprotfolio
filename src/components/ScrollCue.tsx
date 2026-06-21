// components/ScrollCue.tsx
"use client";

export default function ScrollCue() {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-silver-dim">
          Scroll
        </span>
        <div className="relative h-9 w-[1px] overflow-hidden bg-foreground/10">
          <span className="scroll-cue-dot absolute left-1/2 top-0 h-3 w-[1px] -translate-x-1/2 bg-silver" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollCue {
          0% {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 300%);
            opacity: 0;
          }
        }
        .scroll-cue-dot {
          animation: scrollCue 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-cue-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}