import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { lookupDishImage } from "@/lib/images";
import DishCustomizer from "@/components/app/DishCustomizer";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// Decorative gallery thumbs (sibling dishes) — the dish itself has one image.
const GALLERY_SAMPLES = ["jollof", "suya", "egusi"];

export default async function DishDetailPage({ params }: Params) {
  const { id } = await params;

  const dish = await prisma.menuItem.findUnique({ where: { id } });
  if (!dish) notFound();

  const image = dish.imageUrl ?? lookupDishImage(dish.name) ?? undefined;

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
          <div className="relative w-full h-72 lg:h-[460px] rounded-3xl overflow-hidden bg-brand-dark border border-light-outline-variant/60 shadow-lg group">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-light-outline-variant">
                <span className="material-symbols-outlined text-7xl">restaurant</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-transparent to-transparent" />

            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-red text-white font-label text-label-sm font-bold uppercase tracking-wider shadow-sm">
                Chef Signature Catch
              </span>
              {typeof dish.rating === "number" && (
                <span className="px-3 py-1.5 rounded-full bg-brand-dark/90 text-white font-label text-label-sm font-bold flex items-center gap-1.5 backdrop-blur-md">
                  <span className="material-symbols-outlined text-base text-brand-yellow">star</span>
                  {dish.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-label-sm text-amber-300 font-label font-bold uppercase tracking-wider block">
                fast and yummy, good for your tummy
              </span>
              <h2 className="font-display text-2xl lg:text-3xl font-black text-white leading-tight">
                {dish.name}
              </h2>
              {dish.description && (
                <p className="text-body-sm text-stone-200 line-clamp-2">{dish.description}</p>
              )}
            </div>
          </div>

          {/* Thumbnail gallery (decorative) */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            <div className="h-24 rounded-2xl overflow-hidden border-2 border-brand-red shadow-xs cursor-pointer">
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Thumb 1" className="w-full h-full object-cover" />
              )}
            </div>
            {GALLERY_SAMPLES.map((key) => {
              const src = lookupDishImage(key);
              return (
                <div
                  key={key}
                  className="h-24 rounded-2xl overflow-hidden border border-light-outline-variant/60 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                  )}
                </div>
              );
            })}
          </div>

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
              portionsLeft: dish.portionsLeft,
            }}
          />
        </div>
      </div>
    </div>
  );
}
