"use client";

import { useMemo, useState } from "react";

export default function DishGallery({
  name,
  description,
  rating,
  images,
}: {
  name: string;
  description: string | null;
  rating: number | null;
  images: string[];
}) {
  // Dedupe, put a placeholder-less empty guard, and keep order stable.
  const unique = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);

  const [active, setActive] = useState(unique[0] ?? null);

  // Keep active in sync if the image set itself changes (e.g. navigation).
  const current = active && unique.includes(active) ? active : unique[0] ?? null;

  return (
    <div className="space-y-4">
      {/* Main hero image */}
      <div className="relative w-full h-72 lg:h-[460px] rounded-3xl overflow-hidden bg-brand-dark border border-light-outline-variant/60 shadow-lg group">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={name}
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
          {typeof rating === "number" && (
            <span className="px-3 py-1.5 rounded-full bg-brand-dark/90 text-white font-label text-label-sm font-bold flex items-center gap-1.5 backdrop-blur-md">
              <span className="material-symbols-outlined text-base text-brand-yellow">star</span>
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <span className="text-label-sm text-amber-300 font-label font-bold uppercase tracking-wider block">
            fast and yummy, good for your tummy
          </span>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-white leading-tight">
            {name}
          </h2>
          {description && (
            <p className="text-body-sm text-stone-200 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Thumbnail gallery — clicking swaps the hero */}
      {unique.length > 1 && (
        <div className="hidden lg:grid grid-cols-4 gap-4">
          {unique.map((src, i) => {
            const isActive = src === current;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setActive(src)}
                aria-label={`View image ${i + 1}`}
                className={`h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  isActive
                    ? "border-brand-red shadow-xs"
                    : "border-light-outline-variant/60 opacity-75 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
