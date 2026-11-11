"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";
import { SPICE_OPTIONS, SIDE_OPTIONS } from "@/lib/menu-options";

export type CustomizerDish = {
  id: string;
  name: string;
  description: string | null;
  priceKobo: number;
  portionsLeft: number | null;
};

export default function DishCustomizer({ dish }: { dish: CustomizerDish }) {
  const router = useRouter();
  const [spice, setSpice] = useState("lumis-hot");
  const [sides, setSides] = useState<Set<string>>(new Set(["dodo"]));
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  const sideTotal = SIDE_OPTIONS.filter((s) => sides.has(s.id)).reduce(
    (sum, s) => sum + s.priceKobo,
    0,
  );
  const total = (dish.priceKobo + sideTotal) * quantity;

  function toggleSide(id: string) {
    setSides((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function addToBites() {
    setAdding(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuItemId: dish.id,
          quantity,
          spice,
          sides: [...sides],
          note: note.trim() || undefined,
        }),
      });
      router.push("/app/cart");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="bg-light-surface p-5 lg:p-8 rounded-3xl border border-light-outline-variant/60 shadow-sm space-y-6">
      {/* Header info + pricing */}
      <div className="space-y-3 pb-6 border-b border-light-outline-variant/50">
        <div className="flex items-center justify-between">
          {typeof dish.portionsLeft === "number" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-label font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Taking Orders • {dish.portionsLeft} Portions Left Today
            </span>
          )}
          <span className="text-body-sm text-light-outline">Batch: Dinner Pot</span>
        </div>

        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-light-on-surface leading-tight">
          {dish.name}
        </h1>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl lg:text-4xl font-extrabold text-brand-red">
            {formatNaira(dish.priceKobo)}
          </span>
        </div>

        {dish.description && (
          <p className="text-body-md text-light-outline leading-relaxed pt-1">{dish.description}</p>
        )}
      </div>

      {/* Spice level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-headline-sm text-light-on-surface font-bold">
            Pepper &amp; Spice Level
          </h3>
          <span className="text-label-sm font-label text-brand-red font-bold uppercase">
            Required (Choose 1)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SPICE_OPTIONS.map((s) => {
            const active = spice === s.id;
            return (
              <label
                key={s.id}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl cursor-pointer text-center transition-state-change ${
                  active
                    ? "border-2 border-brand-red bg-light-primary-container/20 shadow-xs"
                    : "border border-light-outline-variant bg-light-surface hover:bg-light-surface-container-low"
                }`}
              >
                <input
                  type="radio"
                  name="spice"
                  value={s.id}
                  checked={active}
                  onChange={() => setSpice(s.id)}
                  className="sr-only"
                />
                <span
                  className={`material-symbols-outlined text-2xl mb-1 ${
                    s.id === "mild"
                      ? "text-emerald-600"
                      : s.id === "lumis-hot"
                        ? "text-brand-red"
                        : "text-red-700"
                  }`}
                >
                  {s.icon}
                </span>
                <span
                  className={`font-label text-label-md font-bold ${
                    active ? "text-brand-red" : "text-light-on-surface"
                  }`}
                >
                  {s.name}
                </span>
                <span className="text-body-sm text-light-outline">{s.description}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-headline-sm text-light-on-surface font-bold">
            Choose Your Sides
          </h3>
          <span className="text-label-sm font-label text-light-outline">Optional Add-ons</span>
        </div>

        <div className="space-y-2.5">
          {SIDE_OPTIONS.map((s) => {
            const checked = sides.has(s.id);
            return (
              <label
                key={s.id}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-state-change ${
                  checked
                    ? "border-2 border-brand-red bg-light-primary-container/15"
                    : "border border-light-outline-variant bg-light-surface hover:bg-light-surface-container-low"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSide(s.id)}
                    className="w-5 h-5 rounded text-brand-red focus:ring-brand-red border-light-outline-variant"
                  />
                  <div>
                    <span className="font-label text-label-md text-light-on-surface font-bold block">
                      {s.name}
                    </span>
                    <span className="text-body-sm text-light-outline">{s.description}</span>
                  </div>
                </div>
                <span className="font-headline text-label-lg text-brand-red font-bold">
                  +{formatNaira(s.priceKobo)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Chef note */}
      <div className="space-y-2">
        <label className="font-headline text-label-lg text-light-on-surface font-bold block">
          Special Kitchen Note for Chef Lumi
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Please wrap the pepper sauce in a separate foil container..."
          className="w-full px-4 py-3 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-body-md"
        />
      </div>

      {/* Total + submit — fixed bottom bar on mobile, inline card row on desktop */}
      <div className="pt-4 border-t border-light-outline-variant/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-center border border-light-outline-variant rounded-2xl bg-light-surface p-1.5 shrink-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-light-outline hover:text-light-on-surface active:scale-95 transition-state-change"
          >
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>
          <span className="w-10 text-center font-headline text-headline-sm text-light-on-surface font-bold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-light-outline hover:text-light-on-surface active:scale-95 transition-state-change"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        </div>

        <button
          type="button"
          onClick={addToBites}
          disabled={adding}
          className="w-full sm:flex-1 flex items-center justify-between px-6 py-3.5 sm:py-4 rounded-2xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110 active:scale-98 transition-state-change shadow-lg shadow-brand-red/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl sm:text-2xl">shopping_bag</span>
            <span>{adding ? "Adding…" : "Add to Bites"}</span>
          </div>
          <span className="font-display text-lg sm:text-xl">{formatNaira(total)}</span>
        </button>
      </div>

      {/* Security chip */}
      <div className="flex items-center justify-center gap-4 text-body-sm text-light-outline pt-2 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-emerald-600">lock</span>
          Pay Online via Card, USSD or Transfer
        </span>
        <span>•</span>
        <span className="text-emerald-700 font-bold">Instant Kitchen Confirmation</span>
      </div>
    </div>
  );
}
