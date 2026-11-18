"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";
import type { MenuDish } from "./page";
import AddDishModal from "./AddDishModal";

const FILTERS = [
  { key: "all", label: "All Dishes" },
  { key: "grill", label: "Flame Grills & Fish" },
  { key: "pot", label: "Party Pots & Soups" },
] as const;

/** Map a dish's category to a display bucket (grill / pot / other). */
function bucket(category: string | null, name: string): "grill" | "pot" | "other" {
  const n = (category ?? "").toLowerCase() + " " + name.toLowerCase();
  if (n.includes("grill") || n.includes("fish") || n.includes("suya") || n.includes("croaker") || n.includes("catfish"))
    return "grill";
  if (n.includes("pot") || n.includes("soup") || n.includes("jollof") || n.includes("egusi") || n.includes("yam"))
    return "pot";
  return "other";
}

const BUCKET_BADGE: Record<string, { label: string; cls: string }> = {
  grill: { label: "Flame Grill Special", cls: "bg-red-100 text-brand-red" },
  pot: { label: "Woodfire Party Pot", cls: "bg-amber-100 text-amber-800" },
  other: { label: "Today's Special", cls: "bg-stone-100 text-stone-700" },
};

export default function MenuController({ dishes }: { dishes: MenuDish[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [saved, setSaved] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return dishes;
    return dishes.filter((d) => bucket(d.category, d.name) === filter);
  }, [dishes, filter]);

  const activeCount = dishes.filter((d) => d.available).length;
  const totalPortions = dishes.reduce((s, d) => s + (d.portionsLeft ?? 0), 0);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-dark leading-tight">
            Daily Batches &amp; Menu Controller
          </h1>
          <p className="text-xs text-light-outline font-medium">
            Control what Lagos foodies can order and track portion stock in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/app"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-light-outline-variant hover:bg-stone-50 text-light-on-surface font-label text-label-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
            Preview Live Menu
          </a>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white font-label text-label-sm font-bold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Add New Dish Drop
          </button>
        </div>
      </div>

      {/* Service window banner */}
      <section className="bg-gradient-to-r from-stone-900 to-brand-dark text-white rounded-3xl p-6 lg:p-7 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-brand-dark font-label font-black text-xs uppercase tracking-wide">
              Today&apos;s Service Window
            </span>
            <span className="text-xs font-mono text-stone-300">
              {new Date().toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-white">
            Daily Fresh Drop: 11:00 AM – 6:30 PM
          </h2>
          <p className="text-xs lg:text-sm text-stone-300 leading-relaxed">
            Customers order from today&apos;s active batch until portions run out or the 6:30 PM cutoff.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/15 shrink-0 flex items-center gap-4">
          <div className="text-center px-2">
            <span className="text-[10px] font-label font-bold text-stone-400 uppercase block">Active Dishes</span>
            <span className="font-display text-2xl font-black text-white">{activeCount}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] font-label font-bold text-stone-400 uppercase block">Portions Left</span>
            <span className="font-display text-2xl font-black text-amber-400">{totalPortions}</span>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-light-outline-variant/40 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-label-sm font-label font-bold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-brand-red text-white shadow-xs"
                : "bg-white border border-light-outline-variant text-stone-700 hover:bg-stone-50"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Real-time Connected
          </span>
        </div>
      </div>

      {/* Dish cards */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-light-outline">No dishes in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((d) => (
            <DishCard key={d.id} dish={d} onSaved={() => setSaved(d.id)} snapSaved={saved === d.id} />
          ))}
        </div>
      )}

      {addOpen && <AddDishModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function DishCard({ dish, onSaved, snapSaved }: { dish: MenuDish; onSaved: () => void; snapSaved: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [price, setPrice] = useState((dish.priceKobo / 100).toLocaleString("en-NG"));
  const [portions, setPortions] = useState(dish.portionsLeft ?? 0);
  const [available, setAvailable] = useState(dish.available);

  const low = portions <= 4;
  const badge = BUCKET_BADGE[bucket(dish.category, dish.name)];

  function save(extra?: Record<string, unknown>) {
    startTransition(async () => {
      const priceKobo = Math.round(Number(price.replace(/[^\d]/g, "")) * 100);
      const res = await fetch(`/api/menu/${dish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKobo, portionsLeft: portions, available, ...extra }),
      });
      if (res.ok) {
        onSaved();
        router.refresh();
      }
    });
  }

  function setLive(next: boolean) {
    setAvailable(next);
    save({ available: next });
  }

  function markSoldOut() {
    setPortions(0);
    setAvailable(false);
    save({ portionsLeft: 0, available: false });
  }

  return (
    <article
      className={`bg-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs ${
        low ? "border-2 border-red-300" : "border border-light-outline-variant/60"
      }`}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {dish.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dish.image}
                alt={dish.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs border border-light-outline-variant/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-light-surface-container flex items-center justify-center shrink-0 text-light-outline-variant border border-light-outline-variant/40">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
            )}
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${badge.cls}`}>
                {low ? "Low Stock Alert" : badge.label}
              </span>
              <h3 className="font-headline text-headline-sm font-bold text-brand-dark mt-1 leading-tight">
                {dish.name}
              </h3>
              {dish.description && (
                <div className="text-xs text-light-outline mt-0.5 line-clamp-1">{dish.description}</div>
              )}
            </div>
          </div>

          {/* Live toggle */}
          <div className="text-right shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={available}
              onClick={() => setLive(!available)}
              disabled={pending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
                available ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  available ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`block text-[11px] font-bold mt-1 ${
                available ? "text-emerald-700" : low ? "text-brand-red" : "text-stone-500"
              }`}
            >
              {available ? (low ? "Selling Fast" : "Active on App") : "Paused / Hidden"}
            </span>
          </div>
        </div>

        {/* Price + status controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-stone-50 p-3 rounded-2xl border border-light-outline-variant/50">
            <span className="text-[11px] font-label font-bold text-light-outline uppercase block">Current Price</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-headline font-bold text-stone-800">₦</span>
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-20 font-headline font-bold text-stone-900 bg-white border border-light-outline-variant rounded-lg px-2 py-0.5 text-sm"
              />
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-light-outline-variant/50">
            <span className="text-[11px] font-label font-bold text-light-outline uppercase block">Status</span>
            <span
              className={`font-headline font-bold text-sm mt-1 block ${
                available ? (low ? "text-brand-red" : "text-emerald-700") : "text-stone-500"
              }`}
            >
              {available ? (low ? "Only a few left" : "Active on App") : "Paused"}
            </span>
          </div>
        </div>

        {/* Portion stepper */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700">Portion Inventory (Today&apos;s Batch):</span>
            <span
              className={`font-bold font-mono text-sm ${
                low ? "text-brand-red" : "text-emerald-700"
              }`}
            >
              {portions} Portions Left
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPortions((p) => Math.max(0, p - 1))}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  low ? "bg-brand-red" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, portions * 5)}%` }}
              />
            </div>
            <button
              onClick={() => setPortions((p) => p + 1)}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t flex items-center justify-between ${low ? "bg-red-50/50 border-red-200" : "bg-stone-50 border-light-outline-variant/50"}`}>
        <button
          onClick={markSoldOut}
          className="text-xs font-bold text-brand-red hover:underline"
        >
          Mark “Sold Out Today”
        </button>
        <button
          onClick={() => save()}
          disabled={pending}
          className="px-3.5 py-1.5 rounded-xl bg-brand-dark hover:bg-stone-800 text-white text-xs font-bold transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : snapSaved ? "Saved ✓" : "Save Updates"}
        </button>
      </div>
    </article>
  );
}
