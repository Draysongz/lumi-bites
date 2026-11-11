"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app", label: "Today's Menu", icon: "restaurant_menu" },
  { href: "/app/orders", label: "My Orders", icon: "receipt_long" },
  { href: "/app/cart", label: "Cart", icon: "shopping_cart" },
  { href: "/app/help", label: "Help & Admin", icon: "support_agent" },
];

/** Desktop app footer — marketing/coverage chrome. */
export function AppFooter() {
  return (
    <footer className="hidden lg:block mt-auto bg-brand-dark text-white border-t border-white/10 py-6 px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm text-stone-400">
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-white">LUMI&apos;S BITES</span>
          <span>•</span>
          <span className="italic text-amber-300">&quot;fast and yummy, good for your tummy&quot;</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Thermal Dispatch across Lekki, Ikoyi &amp; VI</span>
          <Link href="/app/orders" className="hover:text-white transition-colors">
            Track Active Order
          </Link>
          <a href="https://wa.me/" className="text-amber-400 font-bold hover:underline">
            Kitchen Admin WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

/** Bottom tab bar (mobile) — fixed to the viewport bottom. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant/50 px-6 py-2 flex items-center justify-between max-w-[390px] mx-auto">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-col items-center gap-0.5 ${
              active ? "text-light-primary" : "text-light-outline hover:text-light-on-surface"
            } transition-state-change`}
          >
            <span className="material-symbols-outlined text-2xl">{t.icon}</span>
            <span className={`font-label text-label-sm ${active ? "font-bold" : ""}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Brand logomark (reused in header). */
export function BrandLockup() {
  return (
    <Link href="/app" className="flex items-center gap-3 shrink-0 group">
      <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-state-change">
        <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,15 C45,35 25,45 15,65 C10,75 18,90 35,90 C50,90 55,75 65,55 C72,40 85,30 70,15 Z"></path>
          <circle cx="80" cy="65" r="10"></circle>
          <circle cx="20" cy="30" r="7"></circle>
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-display font-extrabold text-xl lg:text-2xl tracking-tight text-brand-red leading-none">
            LUMI&apos;S
          </span>
          <span className="font-display font-extrabold text-xl lg:text-2xl tracking-wide text-brand-dark leading-none ml-1.5">
            BITES
          </span>
        </div>
        <span className="font-display text-[10px] lg:text-[10.5px] font-bold text-amber-600 tracking-tight lowercase">
          fast and yummy, good for your tummy
        </span>
      </div>
    </Link>
  );
}

/** Top app bar — mobile compact; desktop full brand/status/search/cart bar. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant/50 px-4 lg:px-8 py-3 lg:py-3.5 shadow-xs">
      {/* Mobile bar */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-light-primary-container flex items-center justify-center text-light-primary shrink-0">
            <span className="material-symbols-outlined text-xl">location_on</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-label text-label-sm text-light-outline uppercase tracking-wider">
                Delivering to
              </span>
              <span className="material-symbols-outlined text-sm text-light-outline">
                keyboard_arrow_down
              </span>
            </div>
            <span className="font-headline text-headline-sm text-light-on-surface truncate">
              Lekki Phase 1, Lagos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/notifications"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-light-surface-container flex items-center justify-center text-light-on-surface hover:bg-light-surface-container-high transition-state-change relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-yellow ring-2 ring-light-surface" />
          </Link>
          <Link
            href="/app/cart"
            aria-label="View Cart"
            className="w-10 h-10 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center hover:brightness-110 relative shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-yellow text-brand-dark text-label-sm font-label font-extrabold flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop bar */}
      <div className="hidden lg:flex max-w-7xl mx-auto items-center justify-between gap-6">
        <BrandLockup />

        {/* Location pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-light-surface-container border border-light-outline-variant/60 cursor-pointer hover:bg-light-surface-container-high transition-state-change">
          <div className="w-7 h-7 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">location_on</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-label-sm text-light-outline font-label uppercase leading-tight">
              Delivering to
            </span>
            <span className="font-headline text-body-md text-light-on-surface font-bold leading-tight flex items-center gap-1">
              Lekki Phase 1, Lagos
              <span className="material-symbols-outlined text-sm text-light-outline">expand_more</span>
            </span>
          </div>
        </div>

        {/* Live status badge */}
        <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <div className="flex flex-col text-left">
            <span className="font-label text-label-sm font-bold uppercase leading-tight text-emerald-900">
              Admin Taking Orders
            </span>
            <span className="text-body-sm leading-tight text-emerald-700">
              Fresh Pots Sizzling • Cutoff 6:30 PM
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-light-outline text-xl pointer-events-none">
            search
          </span>
          <input
            type="search"
            placeholder="Search croaker fish, jollof, suya..."
            className="w-full pl-11 pr-4 py-2 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface text-body-md placeholder:text-light-outline/70 focus:border-light-primary focus:ring-1 focus:ring-light-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/app/orders"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-light-surface-container hover:bg-light-surface-container-high text-light-on-surface font-label text-label-md font-bold transition-state-change"
          >
            <span className="material-symbols-outlined text-xl text-amber-700">receipt_long</span>
            <span>My Orders</span>
          </Link>
          <Link
            href="/app/cart"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white font-label text-label-md font-bold hover:brightness-110 active:scale-98 transition-state-change shadow-xs"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span>Cart (2)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            <span>₦15,200</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
