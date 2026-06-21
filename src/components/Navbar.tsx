"use client";

import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Academics", href: "#academic" },
  { label: "Contact", href: "#contact" },
];

const CTA = {
  label: "Resume",
  href: "https://drive.google.com/file/d/10Hk_oyprPmj1jz1Oxei6lMIVevbU7Ol4/view?usp=drive_link",
};

/** Monogram mark — doubles as a scroll-to-top button. */
function Logo() {
  return (
    <a
      href="#top"
      aria-label="Home"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] font-clash text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.14]"
    >
      CM
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav className="relative w-full max-w-3xl">
        {/* Pill */}
        <div className="flex items-center justify-between gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm text-silver-dim transition-colors hover:bg-white/[0.06] hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-[6px] bg-[#ece7dd] px-5 py-2 font-sans text-xs font-semibold text-black transition-colors hover:bg-white md:inline-flex"
          >
            {CTA.label}
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/[0.06] md:hidden"
          >
            {open ? <HiXMark size={20} /> : <HiBars3 size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-3xl border border-white/10 bg-black/70 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-silver-dim transition-colors hover:bg-white/[0.06] hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={CTA.href}
              onClick={() => setOpen(false)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block rounded-[6px] bg-[#ece7dd] px-4 py-3 text-center font-sans text-xs font-semibold text-black transition-colors hover:bg-white"
            >
              {CTA.label}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
