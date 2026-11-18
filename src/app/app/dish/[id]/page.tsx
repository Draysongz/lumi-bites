import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { lookupDishImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";
import DishCustomizer from "@/components/app/DishCustomizer";
import DishGallery from "@/components/app/DishGallery";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function DishDetailPage({ params }: Params) {
  const { id } = await params;

  const dish = await prisma.dish.findUnique({ where: { id } });
  if (!dish) notFound();

  // Today's live publishing (portions) for this dish, if published today.
  const todayDish = await prisma.dayDish.findFirst({
    where: {
      dishId: dish.id,
      dayMenu: {
        date: { gte: lagosTodayStart(), lt: lagosTodayEnd() },
        active: true,
      },
    },
    select: { portionsLeft: true },
  });

  const image =
    (await resolveImageUrl(dish.imageUrl)) ?? lookupDishImage(dish.name) ?? undefined;

  // Sibling dishes (other live dishes published today), for a gallery.
  const siblings = await prisma.dish.findMany({
    where: {
      id: { not: dish.id },
      dayDishes: { some: { available: true } },
    },
    select: { name: true, imageUrl: true },
  });

  const siblingImages = await Promise.all(
    siblings.map(async (s) => (await resolveImageUrl(s.imageUrl)) ?? lookupDishImage(s.name)),
  );

  const galleryImages = [image, ...siblingImages].filter((src): src is string => !!src);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-10">
      {/* Breadcrumbs */}
      <div className="bg-light-surface-container-low border-b border-light-outline-variant/40 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-body-sm text-light-outline">
          <Link href="/app" className="hover:text-brand-red transition-colors">
            Today&apos;s Menu
          </Link>
          <span>/</span>
          <span className="hover:text-brand-red transition-colors">
            {dish.category ?? "Today's Dishes"}
          </span>
          <span>/</span>
          <span className="text-light-on-surface font-bold truncate">{dish.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left: media + chef notes */}
        <div className="col-span-12 lg:col-span-7 space-y-6 lg:sticky lg:top-28">
          <DishGallery
            name={dish.name}
            description={dish.description}
            rating={dish.rating}
            images={galleryImages}
          />

          {/* Freshness / hygiene box */}
          <div className="hidden lg:grid p-6 rounded-2xl bg-light-surface-container border border-light-outline-variant/60 grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-2xl text-brand-red">
                local_fire_department
              </span>
              <h4 className="font-headline text-label-md font-bold text-light-on-surface">
                Hardwood Charcoal
              </h4>
              <p className="text-body-sm text-light-outline">Authentic smoke, zero gas oven bake</p>
            </div>
            <div className="space-y-1 border-x border-light-outline-variant/60 px-2">
              <span className="material-symbols-outlined text-2xl text-amber-600">timer</span>
              <h4 className="font-headline text-label-md font-bold text-light-on-surface">
                30-40 Mins Grill
              </h4>
              <p className="text-body-sm text-light-outline">Prepared upon online order</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-2xl text-emerald-600">moped</span>
              <h4 className="font-headline text-label-md font-bold text-light-on-surface">
                Thermal Foil Pack
              </h4>
              <p className="text-body-sm text-light-outline">Arrives piping hot at your door</p>
            </div>
          </div>
        </div>

        {/* Right: customizer */}
        <div className="col-span-12 lg:col-span-5">
          <DishCustomizer
            dish={{
              id: dish.id,
              name: dish.name,
              description: dish.description,
              priceKobo: dish.priceKobo,
              portionsLeft: todayDish?.portionsLeft ?? null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
