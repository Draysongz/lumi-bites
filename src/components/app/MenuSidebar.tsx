import { formatNaira } from "@/lib/format";

export type SidebarItem = {
  id: string;
  name: string;
  category: string | null;
  priceKobo: number;
};

const CATEGORIES = [
  { key: "fish", icon: "set_meal", color: "text-brand-red", label: "Flame-Grilled Fish" },
  { key: "jollof", icon: "rice_bowl", color: "text-amber-600", label: "Smokey Party Jollof" },
  { key: "suya", icon: "outdoor_grill", color: "text-orange-600", label: "Spicy Beef Suya" },
  { key: "soup", icon: "soup_kitchen", color: "text-emerald-600", label: "Native Pot Soups" },
];

function countFor(items: SidebarItem[], key: string): number {
  return items.filter((it) => (it.category ?? "").toLowerCase().includes(key)).length;
}

export default function MenuSidebar({
  items,
  dailyNote,
}: {
  items: SidebarItem[];
  dailyNote: string | null;
}) {
  return (
    <aside className="hidden lg:col-span-3 lg:flex flex-col space-y-6 sticky top-24">
      {/* Category nav */}
      <div className="bg-light-surface rounded-2xl border border-light-outline-variant/60 p-4 shadow-xs space-y-1">
        <div className="px-3 py-2 text-label-sm font-label font-bold text-light-outline uppercase tracking-wider">
          Categories Taking Orders
        </div>

        <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-brand-red text-white font-label text-label-md font-bold shadow-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">local_fire_department</span>
            <span>All Today&apos;s Dishes</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{items.length}</span>
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-light-on-surface hover:bg-light-surface-container font-label text-label-md font-medium transition-state-change"
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-xl ${c.color}`}>{c.icon}</span>
              <span>{c.label}</span>
            </div>
            <span className="text-xs text-light-outline">{countFor(items, c.key)}</span>
          </button>
        ))}
      </div>

      {/* Chef's daily note */}
      <div className="bg-brand-dark text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden bg-food-doodle">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />
          <span className="font-label text-label-sm font-bold text-amber-300 uppercase">
            Chef Lumi&apos;s Daily Note
          </span>
        </div>
        <p className="text-body-sm text-stone-300 leading-relaxed">
          {dailyNote ??
            "Today's jumbo croaker fish were freshly delivered from the docks this morning. Flame-grilled with fresh ata rodo!"}
        </p>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-body-sm text-stone-400">
          <span>Batch: Dinner Pot</span>
          <span className="text-amber-400 font-bold">Cutoff 6:30 PM</span>
        </div>
      </div>

      {/* WhatsApp support */}
      <a
        href="https://wa.me/"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-800 font-label text-label-md font-bold hover:bg-emerald-100 transition-state-change"
      >
        <span className="material-symbols-outlined text-xl text-emerald-600">chat</span>
        <span>Chat with Kitchen Admin</span>
      </a>
    </aside>
  );
}
