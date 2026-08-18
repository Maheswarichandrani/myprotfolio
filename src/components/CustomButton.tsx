"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isFlowing?: boolean;
  /** When set, renders as a Next.js Link or anchor instead of a <button>. */
  href?: string;
  target?: string;
  rel?: string;
}

const CustomButton = ({
  children,
  className,
  isFlowing,
  href,
  target,
  rel,
  ...props
}: CustomButtonProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const swapRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: rootRef });

  const onMouseEnter = contextSafe(() => {
    gsap.to(fillRef.current, { y: "0%", duration: 0.4, ease: "power3.out" });

    if (isFlowing && swapRef.current) {
      gsap.to(swapRef.current, {
        yPercent: -100,
        duration: 0.45,
        ease: "power3.out",
      });
    } else if (textRef.current) {
      gsap.to(textRef.current, { color: "var(--background)", duration: 0.4, ease: "power3.out" });
    }

    gsap.to(rootRef.current, { scale: 1.03, duration: 0.3, ease: "back.out(1.7)" });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(fillRef.current, { y: "100%", duration: 0.4, ease: "power3.inOut" });

    if (isFlowing && swapRef.current) {
      gsap.to(swapRef.current, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.inOut",
      });
    } else if (textRef.current) {
      gsap.to(textRef.current, {
        color: "currentColor",
        duration: 0.4,
        ease: "power3.inOut",
      });
    }

    gsap.to(rootRef.current, { scale: 1, duration: 0.3, ease: "power3.inOut" });
  });

  const rootClass = cn(
    "relative inline-flex items-center justify-center overflow-hidden group rounded-full font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 px-7 py-3.5 border border-line-strong text-center cursor-pointer select-none shadow-sm hover:shadow-md",
    isFlowing ? "bg-silver text-background border-silver" : "bg-surface-2/80 text-foreground hover:border-foreground/40",
    className
  );

  const inner = (
    <>
      {/* Fill Layer — slides up on hover */}
      <div
        ref={fillRef}
        className={cn(
          "absolute inset-0 translate-y-[100%] pointer-events-none transition-colors",
          isFlowing ? "bg-foreground" : "bg-foreground"
        )}
      />

      {isFlowing ? (
        /* Vertical text-swap on hover — current line rolls up, duplicate rolls in */
        <span className="relative block overflow-hidden whitespace-nowrap z-10 text-background group-hover:text-background">
          <span ref={swapRef} className="relative block will-change-transform">
            <span className="flex items-center justify-center gap-2">{children}</span>
            <span className="absolute inset-x-0 top-full flex items-center justify-center gap-2" aria-hidden>
              {children}
            </span>
          </span>
        </span>
      ) : (
        <span ref={textRef} className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || target === "_blank";
    if (isExternal) {
      return (
        <a
          href={href}
          ref={rootRef as React.Ref<HTMLAnchorElement>}
          className={rootClass}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        href={href}
        ref={rootRef as React.Ref<HTMLAnchorElement>}
        className={rootClass}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={rootRef as React.Ref<HTMLButtonElement>}
      className={rootClass}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {inner}
    </button>
  );
};

export default CustomButton;
