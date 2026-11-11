import { prisma } from "@/lib/prisma";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";
import { formatNaira } from "@/lib/format";
import { lookupDishImage } from "@/lib/images";
import DishCard, { type DishCardItem } from "@/components/app/DishCard";
import MenuSidebar, { type SidebarItem } from "@/components/app/MenuSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

function deriveBadge(index: number): { text: string; class: string } {
  if (index === 0) return { text: "Chef Signature", class: "bg-brand-red" };
  if (index === 1) return { text: "Party Favorite", class: "bg-amber-600" };
  if (index === 2) return { text: "Street Classic", class: "bg-orange-600" };
  return { text: "Native Pot", class: "bg-emerald-700" };
}

export default async function TodayMenuPage() {
  const menu = await prisma.dayMenu.findFirst({
    where: {
      date: { gte: lagosTodayStart(), lt: lagosTodayEnd() },
      active: true,
    },
    include: { items: { where: { available: true }, orderBy: { createdAt: "asc" } } },
  });

  const items = menu?.items ?? [];
  const featured = items[0];
  const featuredImage = featured ? featured.imageUrl ?? lookupDishImage(featured.name) : null;

  const dishes: DishCardItem[] = items.map((it, i) => {
    const badge = deriveBadge(i);
    return {
      id: it.id,
      name: it.name,
      description: it.description,
      priceKobo: it.priceKobo,
      imageUrl: it.imageUrl ?? lookupDishImage(it.name),
      rating: it.rating,
      portionsLeft: it.portionsLeft,
      badge: badge.text,
      badgeClass: badge.class,
      featured: i === 0,
    };
  });

  const sidebarItems: SidebarItem[] = items.map((it) => ({
    id: it.id,
    name: it.name,
    category: it.category,
    priceKobo: it.priceKobo,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
      {/* Desktop sidebar */}
      <MenuSidebar items={sidebarItems} dailyNote={menu?.dailyNote ?? null} />

      {/* Main content */}
      <div className="lg:col-span-9 space-y-6 w-full max-w-2xl mx-auto lg:max-w-none lg:mx-0">
        {/* Mobile search (desktop has a header search) */}
        <div className="relative flex items-center lg:hidden">
          <span className="material-symbols-outlined absolute left-3.5 text-light-outline text-xl pointer-events-none">
            search
          </span>
          <input
            type="search"
            placeholder="Search today's fish, jollof, soups..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-light-outline-variant bg-light-surface-container-low text-light-on-surface placeholder:text-light-outline/70 focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md shadow-xs"
          />
          <button
            type="button"
            className="absolute right-2.5 w-7 h-7 rounded-lg bg-light-surface flex items-center justify-center text-light-outline border border-light-outline-variant"
          >
            <span className="material-symbols-outlined text-base">tune</span>
          </button>
        </div>

        {/* Admin banner (mobile only — desktop shows the header status badge) */}
        {featured ? (
          <div className="lg:hidden bg-gradient-to-r from-red-600 via-brand-red to-amber-600 text-white rounded-xl px-3 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <div className="flex flex-col">
                <span className="font-label text-label-sm uppercase tracking-wide text-amber-200 font-bold leading-tight">
                  Admin Update: Today&apos;s Orders Active
                </span>
                <span className="text-body-sm font-medium text-white/95 leading-tight">
                  Fresh Pots Sizzling • Order cutoff 6:30 PM
                </span>
              </div>
            </div>
            <span className="bg-white/20 text-white text-label-sm font-label px-2.5 py-1 rounded-md shrink-0 font-bold">
              Live Today
            </span>
          </div>
        ) : !items.length ? (
          <div className="rounded-xl border border-light-outline-variant/50 bg-light-surface-container-low p-4 text-center text-body-md text-light-outline">
            No menu has been posted for today yet — check back soon!
          </div>
        ) : null}

        {/* Hero: today's #1 seller */}
        {featured && (
          <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-brand-dark text-white shadow-md bg-food-doodle">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-brand-red/30 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-stretch gap-5 md:gap-8 p-5 md:p-8">
              <div className="flex flex-col gap-2 md:flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-label-sm font-label font-bold w-fit">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  <span>Today&apos;s Number 1 Seller</span>
                </div>

                <h2 className="font-display text-display-md-mobile md:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {featured.name}
                </h2>
                {featured.description && (
                  <p className="text-body-sm md:text-body-md text-stone-300 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <span className="font-display text-2xl md:text-3xl font-extrabold text-amber-400">
                    {formatNaira(featured.priceKobo)}
                  </span>
                  {typeof featured.portionsLeft === "number" && (
                    <span className="text-label-sm text-amber-300 bg-white/10 px-2 py-0.5 rounded-md font-bold">
                      {featured.portionsLeft} left today
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/app/dish/${featured.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white font-label text-label-md font-extrabold hover:brightness-110 active:scale-98 transition-state-change shadow-md"
                  >
                    <span>Select &amp; Customize Sides</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Featured image */}
              {featuredImage && (
                <div className="md:w-56 lg:w-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage}
                    alt={featured.name}
                    className="w-full h-52 md:h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dish grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-3">
            <div>
              <h3 className="font-headline text-xl lg:text-2xl text-light-on-surface font-extrabold">
                Today&apos;s Hot Dishes
              </h3>
              <p className="text-body-sm text-light-outline">
                Prepared fresh per order by Chef Lumi. Limited portions left for today.
              </p>
            </div>
            {/* {items.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-label font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Taking Orders Now
              </span>
            )} */}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {dishes.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          ) : (
            <p className="text-body-md text-light-outline py-8 text-center">
              No dishes available right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
