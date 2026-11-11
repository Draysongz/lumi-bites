import Link from "next/link";
import { DISH_IMAGES } from "@/lib/images";

const features = [
  "Real-time view of today's active menu and remaining portion counters",
  "Custom spice levels (Mild, Lumi's Hot, Extra Fiery) and side combinations",
  "1-click secure checkout with cards, transfer, or mobile wallets",
  "Live order milestone tracking from kitchen to doorstep",
];

export default function DailyModel() {
  return (
    <section
      id="daily-model"
      className="py-24 bg-brand-dark text-white relative overflow-hidden bg-food-doodle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-label-md font-label font-bold text-amber-400 uppercase tracking-wider">
            The Lumi&apos;s Bites App
          </span>
          <h2 className="font-display text-headline-lg-mobile sm:text-display-md lg:text-[40px] font-black text-white leading-tight">
            Everything You Love About Lumi&apos;s Bites, In One Sleek App.
          </h2>
          <p className="text-body-lg text-stone-300 leading-relaxed">
            Forget waiting for replies on WhatsApp or wondering if today&apos;s fish is sold
            out. Launching the Lumi&apos;s Bites app gives you instant access to:
          </p>

          <ul className="space-y-3.5 text-body-md text-stone-200">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center text-white text-xs shrink-0">
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-yellow text-brand-dark font-label text-label-lg font-black hover:brightness-105 active:scale-98 transition-state-change shadow-xl shadow-brand-yellow/20 text-lg w-full sm:w-auto"
            >
              <span>Launch App Now</span>
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </Link>
          </div>
        </div>

        {/* App mockup preview */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm rounded-[36px] p-3 bg-stone-800 border-4 border-stone-700 shadow-2xl">
            <div className="rounded-[28px] overflow-hidden bg-light-surface text-light-on-surface p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-light-outline-variant/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-headline text-label-sm font-bold text-light-on-surface">
                    Lumi&apos;s Live Menu
                  </span>
                </div>
                <span className="text-label-sm text-brand-red font-bold font-label">
                  Lagos, NG
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-light-outline-variant/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISHIMAGES.croaker}
                  alt="fish"
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 bg-light-surface">
                  <div className="flex justify-between items-center">
                    <span className="font-headline text-label-md font-bold">
                      Whole Grilled Croaker
                    </span>
                    <span className="text-brand-red font-bold text-label-md">₦8,500</span>
                  </div>
                  <p className="text-body-sm text-light-outline mt-0.5">
                    Lumi&apos;s Hot • Fried Plantain
                  </p>
                </div>
              </div>

              <Link
                href="/app"
                className="w-full py-2.5 rounded-lg bg-brand-red text-white text-label-md font-bold font-label flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open in App</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
