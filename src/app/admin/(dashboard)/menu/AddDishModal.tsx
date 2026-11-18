"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "grill", label: "Flame Grills & Fish" },
  { value: "pot", label: "Woodfire Party Pots & Rice" },
  { value: "suya", label: "Charcoal Pit Beef Suya" },
  { value: "native", label: "Native Soups & Swallows" },
];

const SPICE_PRESETS = ["mild", "medium", "lagos-hot"];

export default function AddDishModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [price, setPrice] = useState("");
  const [portions, setPortions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [spice, setSpice] = useState<string[]>(["mild", "medium", "lagos-hot"]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setPhoto(f);
      setPhotoPreview(URL.createObjectURL(f));
    }
  }

  function toggleSpice(id: string) {
    setSpice((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setError(null);
      try {
        let imageUrl: string | null = null;
        if (photo) {
          const fd = new FormData();
          fd.append("file", photo);
          fd.append("folder", "dishes");
          const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
          if (!up.ok) {
            const e2 = (await up.json()) as { error?: string };
            throw new Error(e2.error || "Upload failed");
          }
          const upData = (await up.json()) as { url: string };
          imageUrl = upData.url;
        }

        const priceNaira = Math.round(Number(price.replace(/[^\d.]/g, "")));
        const portionsLeft = portions ? parseInt(portions, 10) : null;

        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date().toISOString().slice(0, 10),
            dishes: [
              {
                name,
                description: null,
                priceNaira: priceNaira || 0,
                imageUrl,
                category,
                prepTime: prepTime || null,
                spice: spice.join(",") || null,
                portionsLeft,
                available: true,
              },
            ],
            active: true,
          }),
        });
        if (!res.ok) {
          const e2 = (await res.json()) as { error?: string };
          throw new Error(e2.error || "Failed to publish dish");
        }

        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/70 flex items-center justify-center p-4 lg:p-8"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl border border-light-outline-variant/60 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-50 px-8 py-5 border-b border-light-outline-variant/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold shadow-md shadow-brand-red/20">
              <span className="material-symbols-outlined text-2xl">local_fire_department</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-headline-sm font-bold text-brand-dark">
                  Add New Daily Dish Drop
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  Lagos Batch Drop
                </span>
              </div>
              <p className="text-xs text-light-outline">
                Publish a fresh food batch for customers to order and pay online for today
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form */}
        <form className="px-8 pb-8 space-y-5" onSubmit={submit}>
          <div>
            <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
              Dish Title <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spicy Whole Grilled Croaker Fish"
              className="w-full px-4 py-3 bg-stone-50 border border-light-outline-variant rounded-2xl text-body-md text-stone-900 font-medium focus:ring-2 focus:ring-brand-red focus:border-brand-red focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
                Cuisine Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-light-outline-variant rounded-2xl text-body-md text-stone-900 font-medium focus:ring-2 focus:ring-brand-red focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
                Price in Naira (₦) <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-bold text-stone-500">
                  ₦
                </span>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="8,000"
                  className="w-full pl-8 pr-4 py-3 bg-stone-50 border border-light-outline-variant rounded-2xl text-body-md text-stone-900 font-bold focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
                Portions Available for Today&apos;s Batch <span className="text-brand-red">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min={1}
                  max={150}
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-light-outline-variant rounded-2xl text-body-md text-stone-900 font-bold focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
                <span className="text-xs text-light-outline font-medium shrink-0">Portions</span>
              </div>
              <span className="text-[11px] text-light-outline mt-1 block">
                App shows &quot;Sold Out&quot; once portions are exhausted.
              </span>
            </div>
            <div>
              <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
                Grill / Kitchen Prep Time
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g. 35 mins"
                className="w-full px-4 py-3 bg-stone-50 border border-light-outline-variant rounded-2xl text-body-md text-stone-900 font-medium focus:ring-2 focus:ring-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
              Signature Seasoning &amp; Spice Options Preset
            </label>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-light-outline-variant/60 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { id: "mild", label: "Mild Pepper" },
                  { id: "medium", label: "Medium Spice" },
                  { id: "lagos-hot", label: "Lagos Hot (Ata Rodo Char)" },
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                      s.id === "lagos-hot" && spice.includes(s.id)
                        ? "text-brand-red font-bold"
                        : "text-stone-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={spice.includes(s.id)}
                      onChange={() => toggleSpice(s.id)}
                      className="rounded text-brand-red focus:ring-brand-red"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-label-sm font-label font-bold text-stone-900 mb-1.5">
              Dish Photo
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-light-outline-variant hover:border-brand-red transition-colors flex flex-col items-center justify-center text-center cursor-pointer bg-stone-50 group"
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-24 h-24 rounded-xl object-cover mb-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-50 text-brand-red flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
              )}
              <span className="font-headline text-label-md font-bold text-brand-dark">
                {photo ? "Change dish photo" : "Click to browse or drop dish photo"}
              </span>
              <span className="text-xs text-light-outline mt-0.5">
                High resolution food photo (JPG or PNG up to 10MB)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
              />
            </div>
          </div>

          {error && <p className="text-body-sm text-error font-bold">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-light-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-light-outline-variant text-stone-700 font-label text-label-md font-bold hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-6 py-3 rounded-xl bg-brand-red hover:bg-red-700 text-white font-label text-label-md font-bold shadow-md shadow-brand-red/25 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">publish</span>
              <span>{pending ? "Publishing…" : "Publish Dish Drop Now"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
