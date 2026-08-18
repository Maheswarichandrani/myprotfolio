"use client";

import { useState, useEffect } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "next-themes";
import CustomButton from "@/components/CustomButton";

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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2/40 font-clash text-sm font-semibold text-foreground transition-colors hover:bg-surface-2/80"
    >
      CM
    </a>
  );
}

/** Theme toggle with Sun/Moon icons, avoiding hydration mismatch. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-line bg-surface-2/40 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2/40 text-foreground transition-all duration-300 hover:bg-surface-2/80 active:scale-95 cursor-pointer"
    >
      {isDark ? <LuSun size={16} /> : <LuMoon size={16} />}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav className="relative w-full max-w-3xl">
        {/* Pill */}
        <div className="flex items-center justify-between gap-2 rounded-full border border-line bg-background/40 px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm text-silver-dim transition-colors hover:bg-surface-2/40 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <CustomButton
                href={CTA.href}
                target="_blank"
                rel="noopener noreferrer"
                isFlowing
                className="py-2 px-5 text-xs font-semibold"
              >
                {CTA.label}
              </CustomButton>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-2/40 md:hidden"
            >
              {open ? <HiXMark size={20} /> : <HiBars3 size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-3xl border border-line bg-background/70 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-silver-dim transition-colors hover:bg-surface-2/40 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex flex-col gap-2 p-2">
              <a
                href={CTA.href}
                onClick={() => setOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[6px] bg-silver px-4 py-3 text-center font-sans text-xs font-semibold text-background transition-colors hover:bg-foreground"
              >
                {CTA.label}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
