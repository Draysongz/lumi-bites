import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 via-brand-red to-amber-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <span className="font-display text-xl text-amber-200 font-bold lowercase tracking-tight block">
          fast and yummy, good for your tummy
        </span>
        <h2 className="font-display text-headline-lg-mobile sm:text-display-md lg:text-[40px] font-black text-white leading-tight">
          Craving Chef Lumi&apos;s Famous Grilled Fish or Party Jollof?
        </h2>
        <p className="text-body-lg text-white/90 max-w-xl mx-auto">
          Check today&apos;s freshly prepared batch before orders close for the evening.
        </p>

        <div className="pt-2">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-brand-dark text-white font-label text-label-lg font-black hover:bg-stone-900 active:scale-98 transition-state-change shadow-2xl text-xl w-full sm:w-auto"
          >
            <span>Launch App</span>
            <span className="material-symbols-outlined text-2xl text-amber-400">
              rocket_launch
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
