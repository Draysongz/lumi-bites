const pillars = [
  {
    icon: "local_fire_department",
    iconBg: "bg-red-100 text-brand-red",
    title: "Authentic Flame Grill",
    body: "We don't bake our fish or suya in electric ovens. Real hardwood charcoal delivers the smoky flavor that defines true Nigerian food.",
  },
  {
    icon: "update",
    iconBg: "bg-amber-100 text-amber-700",
    title: "Dynamic Daily Drops",
    body: "Admin uploads fresh dishes each morning based on the best fresh catches and market selections of the day.",
  },
  {
    icon: "lock",
    iconBg: "bg-emerald-100 text-emerald-800",
    title: "Instant Online Checkout",
    body: "Order and pay right inside the web app with verified debit cards, USSD codes, or direct transfer via Paystack.",
  },
  {
    icon: "moped",
    iconBg: "bg-stone-100 text-brand-dark",
    title: "Thermal Hot Delivery",
    body: "Dispatched in heavy-duty thermal foil packaging so your fish skin stays crispy and your jollof stays steaming hot.",
  },
];

export default function Pillars() {
  return (
    <section
      id="culinary-philosophy"
      className="py-24 bg-light-surface-container-low border-b border-light-outline-variant/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-label-md font-label font-bold text-brand-red uppercase tracking-wider">
            Culinary Philosophy
          </span>
          <h2 className="font-display text-headline-lg-mobile lg:text-display-md font-extrabold text-light-on-surface">
            What Sets Lumi&apos;s Bites Apart
          </h2>
          <p className="text-body-lg text-light-outline">
            Four foundational pillars behind every plate that leaves our kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-light-surface p-7 rounded-2xl border border-light-outline-variant/60 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${p.iconBg}`}
                >
                  <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                </div>
                <h3 className="font-headline text-headline-sm text-light-on-surface mb-2">
                  {p.title}
                </h3>
                <p className="text-body-sm text-light-outline leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
