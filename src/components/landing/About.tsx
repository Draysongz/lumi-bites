import Link from "next/link";
import { DISH_IMAGES } from "@/lib/images";


  
export default function About() {
  return (
    <section id="about-us" className="py-24 bg-light-surface border-b border-light-outline-variant/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: image mosaic */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-48 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISH_IMAGES.croaker} alt="Smokey Party Jollof"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-60 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISH_IMAGES.suya} alt="Spicy Beef Suya"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden h-60 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISH_IMAGES.croaker} alt="Signature Grilled Croaker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-48 border border-light-outline-variant/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DISH_IMAGES.egusi} alt="Signature Grilled Croaker"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: what Lumi's Bites is about */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-label-md font-label font-bold text-brand-red uppercase tracking-wider">
              About Lumi&apos;s Bites
            </span>

            <h2 className="font-display text-headline-lg-mobile lg:text-display-md font-extrabold text-light-on-surface leading-tight">
              Born From A Passion For Real Food, Soulful Spice, And Effortless Ordering.
            </h2>

            <p className="text-body-lg text-light-outline leading-relaxed">
              In a fast-paced city like Lagos, good food often gets compromised for speed,
              or great food takes hours of chaotic phone calls and manual bank transfer
              screenshots. <strong>Lumi&apos;s Bites was created to bridge this gap completely.</strong>
            </p>

            <p className="text-body-md text-light-outline leading-relaxed">
              We operate as a focused online cloud kitchen. Instead of maintaining an
              overwhelming 50-dish menu of pre-made food, our kitchen admin selects and
              announces what fresh pots are being cooked each day. Whether it&apos;s
              charcoal-grilled whole fish, firewood party jollof, or pounded yam with rich
              egusi soup, each portion is prepared with unhurried care and handed directly
              to dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-light-surface-container border border-light-outline-variant/50">
                <div className="flex items-center gap-2.5 mb-1.5 text-brand-red">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                  <h4 className="font-headline text-headline-sm text-light-on-surface">
                    Daily Fresh Pots
                  </h4>
                </div>
                <p className="text-body-sm text-light-outline">
                  The admin opens the kitchen daily with fresh market produce.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-light-surface-container border border-light-outline-variant/50">
                <div className="flex items-center gap-2.5 mb-1.5 text-amber-600">
                  <span className="material-symbols-outlined text-2xl">payment</span>
                  <h4 className="font-headline text-headline-sm text-light-on-surface">
                    Seamless Online Pay
                  </h4>
                </div>
                <p className="text-body-sm text-light-outline">
                  Instant confirmation through cards and transfers. No waiting.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-red text-white font-label text-label-lg font-bold hover:brightness-110 active:scale-98 transition-state-change shadow-md w-full sm:w-auto"
              >
                <span>Launch App &amp; Taste The Difference</span>
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
