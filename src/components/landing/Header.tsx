"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#about-us", label: "Our Story" },
  { href: "#culinary-philosophy", label: "Culinary Philosophy" },
  { href: "#daily-model", label: "The Daily Kitchen Model" },
  { href: "#specialties", label: "Signature Dishes" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link href="#" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-state-change shrink-0">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50,15 C45,35 25,45 15,65 C10,75 18,90 35,90 C50,90 55,75 65,55 C72,40 85,30 70,15 Z"></path>
              <circle cx="80" cy="65" r="10"></circle>
              <circle cx="20" cy="30" r="7"></circle>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center whitespace-nowrap">
              <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-brand-red leading-none">
                LUMI&apos;S
              </span>
              <span className="font-display font-extrabold text-lg sm:text-2xl tracking-wide text-brand-dark leading-none ml-1.5">
                BITES
              </span>
            </div>
            <span className="font-display text-[10px] sm:text-[11px] font-bold text-amber-600 tracking-tight lowercase truncate">
              fast and yummy, good for your tummy
            </span>
          </div>
        </Link>

        {/* Story nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-label text-label-lg font-bold text-light-on-surface">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-brand-red transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA (hidden on smallest screens, shown sm+) */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-red text-white font-label text-label-lg font-extrabold hover:brightness-110 active:scale-98 transition-state-change shadow-md shadow-brand-red/25 whitespace-nowrap"
          >
            <span>Launch App</span>
            <span className="material-symbols-outlined text-lg sm:text-xl">rocket_launch</span>
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-light-outline-variant/60 text-light-on-surface hover:bg-light-surface-container transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-2xl">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="md:hidden border-t border-light-outline-variant/40 bg-light-surface px-4 py-4 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 font-label text-label-lg font-bold text-light-on-surface hover:bg-light-surface-container hover:text-brand-red transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/app"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-red text-white font-label text-label-lg font-extrabold"
          >
            <span>Launch App</span>
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
