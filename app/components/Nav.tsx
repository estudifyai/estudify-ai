"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[rgba(8,5,26,0.85)] border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Estudify"
            width={30}
            height={30}
            className="rounded-lg"
          />
          <span className="font-bold text-[17px] text-white tracking-tight">
            estudify<span className="text-[var(--cyan)]">.ai</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <a
            href="/#features"
            className="text-[14px] text-[var(--text2)] hover:text-white transition-colors"
          >
            Funciones
          </a>
          <a
            href="/#how"
            className="text-[14px] text-[var(--text2)] hover:text-white transition-colors"
          >
            Cómo funciona
          </a>
          <Link
            href="/#pricing"
            className="text-[14px] text-[var(--text2)] hover:text-white transition-colors"
          >
            Precios
          </Link>
          <a
            href="/#faq"
            className="text-[14px] text-[var(--text2)] hover:text-white transition-colors"
          >
            FAQ
          </a>
        </div>

        <a
          href="/#waitlist"
          className="px-4 h-9 inline-flex items-center rounded-full bg-white text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--text2)] transition-colors"
        >
          Únete a la Beta
        </a>
      </div>
    </nav>
  );
}
