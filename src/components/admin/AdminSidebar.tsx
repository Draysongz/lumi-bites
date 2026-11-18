"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import IntakeToggle from "./IntakeToggle";

const NAV = [
  { href: "/admin", label: "Dashboard Home", icon: "dashboard" },
  { href: "/admin/orders", label: "Live Kitchen Orders", icon: "skillet", badge: "8" },
  { href: "/admin/menu", label: "Daily Batches & Menu", icon: "restaurant_menu" },
  { href: "/admin/catering", label: "Catering Requests", icon: "celebration" },
  { href: "/admin/riders", label: "Riders & Dispatch", icon: "moped", badge: "3 Active" },
  { href: "/admin/support", label: "Customer Tickets", icon: "support_agent", ping: true },
];

export default function AdminSidebar({ name, menuActive }: { name: string; menuActive: boolean }) {
  const pathname = usePathname();
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <aside className="w-64 bg-brand-dark text-white flex-col justify-between shrink-0 border-r border-white/10 hidden md:flex sticky top-0 h-screen">
      <div className="p-6 space-y-6">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold shadow-md shadow-brand-red/30">
            <span className="material-symbols-outlined text-2xl">local_fire_department</span>
          </div>
          <div>
            <span className="font-display font-black text-lg text-white tracking-tight block leading-tight">
              LUMI&apos;S BITES
            </span>
            <span className="text-[10px] font-label font-bold text-amber-400 tracking-wider uppercase">
              Kitchen Admin HQ
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 pt-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline text-label-md transition-colors ${
                  active
                    ? "bg-brand-red text-white font-bold shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-white/5 font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {"badge" in item && item.badge && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-brand-dark font-label text-[11px] font-extrabold flex items-center justify-center">
                    {item.badge.endsWith("Active") ? "3" : item.badge}
                  </span>
                )}
                {"ping" in item && item.ping && (
                  <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom profile */}
      <div className="p-6 border-t border-white/10 space-y-4">
        <IntakeToggle menuActive={menuActive} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div>
              <span className="font-headline text-body-sm font-bold text-white block leading-tight">
                {name}
              </span>
              <span className="text-[11px] text-stone-400">Head Chef &amp; Owner</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sign out"
            title="Sign out"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>

    
      </div>
    </aside>
  );
}
