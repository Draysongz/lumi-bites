import Link from "next/link";
import HeroMockup from "./HeroMockup";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white pt-20 pb-24 lg:pt-28 lg:pb-32 bg-food-doodle">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-red/35 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-yellow/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Hero story copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 font-label text-label-md font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></span>
            <span>Welcome to Lumi&apos;s Bites Kitchen • Lagos, Nigeria</span>
          </div>

          <h1 className="font-display text-display-lg-mobile lg:text-display-lg font-black text-white leading-tight tracking-tight">
            Hearty, Authentic <br />
            Nigerian Comfort Food <br />
            <span className="text-amber-400">Cooked Fresh Every Single Day.</span>
          </h1>

          <p className="text-body-lg text-stone-300 max-w-xl leading-relaxed">
            Lumi&apos;s Bites was founded on a simple promise:{" "}
            <em>fast and yummy, good for your tummy</em>. We are an online artisanal
            kitchen that rejects bulk-reheated catering. Instead, our admin kitchen team
            curates and uploads a daily batch of mouth-watering Nigerian specialties
            cooked to order and paid seamlessly online.
          </p>

          {/* CTA */}
          <div className="pt-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110 active:scale-98 transition-state-change shadow-xl shadow-brand-red/35 text-lg sm:w-auto"
            >
              <span className="text-center">Launch App </span>
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>

            <Link
              href="#about-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-label text-label-lg font-bold backdrop-blur-sm transition-state-change sm:w-auto"
            >
              <span className="material-symbols-outlined text-xl">menu_book</span>
              <span>Read Our Story</span>
            </Link>
          </div>

          {/* Core values */}
          {/* <div className="pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg">
            <div>
              <span className="font-display text-2xl font-extrabold text-amber-400 block">
                Flame-Grilled
              </span>
              <span className="text-body-sm text-stone-300">
                Over real hot coals with ata rodo glaze
              </span>
            </div>
            <div>
              <span className="font-display text-2xl font-extrabold text-white block">
                Zero Microwaves
              </span>
              <span className="text-body-sm text-stone-300">
                Cooked fresh per daily batch
              </span>
            </div>
            <div>
              <span className="font-display text-2xl font-extrabold text-emerald-400 block">
                Instant Pay
              </span>
              <span className="text-body-sm text-stone-300">
                Cards, USSD, OPay &amp; Bank Transfer
              </span>
            </div>
          </div> */}
        </div>

        {/* Visual media showcase: animated app mockup */}
        <div className="lg:col-span-5 relative">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
