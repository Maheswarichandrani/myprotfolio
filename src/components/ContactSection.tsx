"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LUXE } from "@/lib/ease";
import { SOCIAL_LINKS } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-dim transition-colors duration-300 focus:border-line-strong focus:bg-surface";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useGSAP(
    () => {
      gsap.from(".ct-reveal", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.08,
        ease: LUXE,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    },
    { scope: sectionRef }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to send message.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-background px-6 py-28 sm:px-10 lg:px-14 lg:py-40"
    >
      {/* soft top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Left — intro + socials */}
        <div className="flex flex-col">
          <p className="ct-reveal font-mono text-[11px] uppercase tracking-[0.3em] text-silver-dim">
            Contact
          </p>
          <h2 className="ct-reveal silver-text font-clash mt-5 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">
            Let&apos;s build something
          </h2>
          <p className="ct-reveal mt-5 max-w-md text-sm leading-relaxed text-dim lg:text-base">
            Have a role, a project, or an idea worth chasing? Drop a message —
            I read every one and reply fast.
          </p>

          <div className="ct-reveal mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.2em] text-dim transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <form onSubmit={onSubmit} noValidate className="ct-reveal flex flex-col gap-4">
          {/* honeypot — hidden from humans */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver-dim">
                Name
              </span>
              <input
                name="name"
                type="text"
                required
                maxLength={120}
                placeholder="Your name"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver-dim">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver-dim">
              Message
            </span>
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={5}
              placeholder="Tell me about it…"
              className={`${fieldClass} resize-none`}
            />
          </label>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-silver inline-flex items-center justify-center rounded-[6px] px-7 py-3 font-sans text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            <p
              aria-live="polite"
              className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
                status === "error" ? "text-red-400" : "text-silver-dim"
              }`}
            >
              {status === "sent" && "Message sent — talk soon."}
              {status === "error" && error}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
