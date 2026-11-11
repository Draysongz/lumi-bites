import Link from "next/link";
import { formatNaira } from "@/lib/format";

export type DishCardItem = {
  id: string;
  name: string;
  description: string | null;
  priceKobo: number;
  imageUrl: string | null;
  rating?: number | null;
  portionsLeft?: number | null;
  badge?: string;
  badgeClass?: string;
  featured?: boolean;
};

export default function DishCard({ dish }: { dish: DishCardItem }) {
  return (
    <article className="bg-light-surface rounded-xl overflow-hidden border border-light-outline-variant/60 shadow-xs flex flex-col h-full">
      {/* Image — fixed height, object-cover, so all cards match */}
      <div className="relative w-full h-44 md:h-56 bg-light-surface-container overflow-hidden shrink-0">
        <Link href={`/app/dish/${dish.id}`} className="block w-full h-full">
          {dish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-light-outline-variant">
              <span className="material-symbols-outlined text-5xl">restaurant</span>
            </div>
          )}
        </Link>
        {dish.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-white text-label-sm font-label px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
              dish.badgeClass ?? "bg-brand-red"
            }`}
          >
            {dish.badge}
          </span>
        )}
        {dish.featured && (
          <span className="absolute bottom-2.5 left-2.5 bg-amber-500/90 text-white text-label-sm font-label px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
            <span className="material-symbols-outlined text-sm text-white">star</span>
            Chef Lumi&apos;s Pick
          </span>
        )}
        {typeof dish.rating === "number" ? (
          <span className="absolute bottom-2.5 right-2.5 bg-brand-dark/90 text-white text-label-sm font-label px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
            <span className="material-symbols-outlined text-sm text-brand-yellow">star</span>
            {dish.rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      {/* Body — consistent skeleton with mt-auto footer for uniform alignment */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/app/dish/${dish.id}`} className="min-w-0 flex-1">
            <h4 className="font-headline text-headline-sm text-light-on-surface hover:text-light-primary transition-state-change line-clamp-2 min-h-[3rem]">
              {dish.name}
            </h4>
          </Link>
          <span className="font-headline text-headline-sm text-light-primary font-bold shrink-0">
            {formatNaira(dish.priceKobo)}
          </span>
        </div>

        {/* Always render the description slot so cards without one stay uniform */}
        <p className="text-body-sm text-light-outline line-clamp-2 min-h-[2.5rem]">
          {dish.description ?? ""}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant/40 mt-auto">
          {typeof dish.portionsLeft === "number" ? (
            <span className="text-label-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
              {dish.portionsLeft === 0
                ? "Sold Out"
                : `${dish.portionsLeft} ${dish.portionsLeft === 1 ? "Portion" : "Portions"} Left`}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-label-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Available
            </span>
          )}
          <Link
            href={`/app/dish/${dish.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-label-sm font-label font-bold hover:brightness-110 active:scale-95 transition-state-change"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Customize</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
