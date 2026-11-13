"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import emailjs from "@emailjs/browser";
import { LuArrowUpRight, LuMail, LuFileText, LuSend } from "react-icons/lu";
import { SiGithub, SiLeetcode } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { CONTACT, SOCIAL_LINKS } from "@/data/profile";
import IdCard from "@/components/contact/IdCard";

const social = (label: string) => SOCIAL_LINKS.find((s) => s.label === label)?.href ?? "#";

const LINKS = [
  { label: "Email", href: `mailto:${CONTACT.email}`, Icon: LuMail },
  { label: "LinkedIn", href: social("LinkedIn"), Icon: FaLinkedinIn },
  { label: "GitHub", href: social("GitHub"), Icon: SiGithub },
  { label: "LeetCode", href: social("LeetCode"), Icon: SiLeetcode },
  { label: "Resume", href: CONTACT.resume, Icon: LuFileText },
];

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-silver-dim/80 transition-colors duration-300 focus:border-rose focus:outline-none";
const label = "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-silver-dim";

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useGSAP(
    () => {
      gsap.set(".ct-in", { opacity: 0, y: 16 });
      const play = () =>
        gsap.to(".ct-in", { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", delay: 0.3 });
      if ((window as Window & { __preloaderDone?: boolean }).__preloaderDone) play();
      else {
        const fn = () => setTimeout(play, 0);
        window.addEventListener("preloader:done", fn, { once: true });
        return () => window.removeEventListener("preloader:done", fn);
      }
    },
    { scope: rootRef }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    if (data.get("company")) return; // honeypot — bots fill hidden fields
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setError("Email service isn't configured yet — please email me directly.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      await emailjs.sendForm(serviceId, templateId, form, publicKey);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Couldn't send right now — please email me directly.");
    }
  }

  return (
    <div ref={rootRef} className="section-container relative min-h-screen pb-24">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* left — ID card + links */}
        <div className="flex flex-col items-center lg:sticky lg:top-0">
          <IdCard />
          <ul className="ct-in mt-2 flex flex-wrap justify-center gap-3">
            {LINKS.map(({ label: l, href, Icon }) => (
              <li key={l}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={l}
                  title={l}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface text-silver transition-colors duration-300 hover:border-rose hover:text-rose"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* right — message form */}
        <div className="lg:max-w-lg lg:pt-40">
          <p className="ct-in font-mono text-[11px] uppercase tracking-[0.3em] text-rose">Contact</p>
          <h1 className="ct-in mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
            Let&apos;s work together.
          </h1>
          <p className="ct-in mt-4 text-[15px] text-dim sm:text-base">
            Open to full-time roles and freelance projects. Send a message and I&apos;ll get back to you.
          </p>

          <form ref={formRef} onSubmit={onSubmit} noValidate className="ct-in mt-10 flex flex-col gap-5">
            {/* honeypot — hidden from humans */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name</span>
                <input name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your full name" className={field} />
              </label>
              <label className="block">
                <span className={label}>Email</span>
                <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" className={field} />
              </label>
            </div>

            <label className="block">
              <span className={label}>Message</span>
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={5}
                placeholder="Tell me about your project, role or idea…"
                className={`${field} resize-none`}
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-silver px-6 py-3.5 text-sm font-medium text-background transition-colors duration-300 hover:bg-rose disabled:cursor-wait disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
                <LuSend size={15} />
              </button>
              <p
                aria-live="polite"
                className={`text-sm ${status === "error" ? "text-[#b3402e]" : "text-rose"}`}
              >
                {status === "sent" && "Thanks — your message is on its way."}
                {status === "error" && error}
              </p>
            </div>
          </form>

          <p className="ct-in mt-8 text-sm text-dim">
            Prefer email?{" "}
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-line-strong underline-offset-4 hover:decoration-rose">
              {CONTACT.email} <LuArrowUpRight size={13} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
