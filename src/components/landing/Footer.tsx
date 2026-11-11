import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-brand-red">LUMI&apos;S</span>
              <span className="font-display font-black text-2xl text-white">BITES</span>
            </div>
            <p className="text-body-sm text-stone-300 font-medium italic">
              &quot;fast and yummy, good for your tummy&quot;
            </p>
            <p className="text-body-sm text-stone-400">
              Lagos premier online kitchen for freshly flame-roasted spicy fish, authentic
              native soups, and party staples.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-body-sm text-stone-300 font-medium">
              <li>
                <Link href="#about-us" className="hover:text-amber-400">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#culinary-philosophy" className="hover:text-amber-400">
                  Culinary Philosophy
                </Link>
              </li>
              <li>
                <Link href="#daily-model" className="hover:text-amber-400">
                  How The App Works
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-amber-400">
                  Today&apos;s Live Menu
                </Link>
              </li>
            </ul>
          </div>

          {/* Coverage & kitchen hours */}
          <div className="space-y-3">
            <h4 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              Kitchen &amp; Dispatch
            </h4>
            <ul className="space-y-2 text-body-sm text-stone-300">
              <li>
                <strong className="text-white">Daily Order Hours:</strong> 11:00 AM – 7:00 PM
              </li>
              <li>
                <strong className="text-white">Batch Days:</strong> Monday – Saturday
              </li>
              <li>
                <strong className="text-white">Delivery Areas:</strong> Lekki 1 &amp; 2, Ikoyi,
                Victoria Island, Ikeja GRA
              </li>
            </ul>
          </div>

          {/* App CTA */}
          <div className="space-y-3">
            <h4 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              Order Online
            </h4>
            <p className="text-body-sm text-stone-300">
              Ready to order today&apos;s fresh culinary batch?
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:brightness-110 text-white font-label text-label-md font-bold transition-all"
            >
              <span>Launch App</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-body-sm text-stone-400 gap-4">
          <span className="text-center sm:text-left">© 2026 Lumi&apos;s Bites Online Restaurant. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white">
              Hygiene Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
