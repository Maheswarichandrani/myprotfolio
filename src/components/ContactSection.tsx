"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import emailjs from "@emailjs/browser";
import { LUXE } from "@/lib/ease";
import { SOCIAL_LINKS } from "@/data/profile";
import CustomButton from "@/components/CustomButton";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-dim transition-colors duration-300 focus:border-line-strong focus:bg-surface";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
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

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setError("EmailJS keys missing in .env file. Please set NEXT_PUBLIC_EMAILJS_* keys.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      await emailjs.sendForm(serviceId, templateId, form, publicKey);
      setStatus("sent");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      setError(
        err && typeof err === "object" && "text" in err
          ? (err as { text: string }).text
          : "Failed to send message via EmailJS."
      );
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-background section-padding"
    >
      {/* soft top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="section-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Left — intro + socials */}
        <div className="flex flex-col">
          <p className="ct-reveal font-mono text-[11px] uppercase tracking-[0.35em] text-silver-dim">
            Get In Touch
          </p>
          <h2 className="ct-reveal silver-text font-clash mt-3 text-[clamp(1.85rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-tight">
            Let&apos;s build something exceptional
          </h2>
          <p className="ct-reveal mt-5 max-w-md text-sm leading-relaxed text-dim lg:text-base">
            Have a role, a high-impact project, or an innovative idea worth chasing? Drop a message —
            I read every submission and respond swiftly.
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

        {/* Right — EmailJS Contact Form */}
        <form ref={formRef} onSubmit={onSubmit} noValidate className="ct-reveal flex flex-col gap-5">
          {/* honeypot — hidden from humans */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div className="grid gap-5 sm:grid-cols-2">
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

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CustomButton
              type="submit"
              disabled={status === "sending"}
              isFlowing
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </CustomButton>

            <p
              aria-live="polite"
              className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
                status === "error" ? "text-red-400" : "text-silver"
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
