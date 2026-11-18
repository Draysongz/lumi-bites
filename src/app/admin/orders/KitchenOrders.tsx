"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { formatNaira } from "@/lib/format";
import { SPICE_OPTIONS, SIDE_OPTIONS } from "@/lib/menu-options";
import type { KitchenOrder } from "./page";

type Status = KitchenOrder["status"];

const ACTIVE: Status[] = ["PENDING", "PAID", "CONFIRMED", "READY"];

/** Status → display pill + next advance action. */
const STATUS_META: Record<Status, { label: string; cls: string; dot: string; next?: string; nextLabel?: string }> = {
  PENDING: { label: "Awaiting Payment", cls: "bg-stone-500/20 text-stone-300 border-stone-500/30", dot: "bg-stone-400" },
  PAID: { label: "Queued", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30", dot: "bg-blue-400", next: "CONFIRMED", nextLabel: "Start Cooking" },
  CONFIRMED: { label: "On Grill", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30", dot: "bg-amber-400 animate-ping", next: "READY", nextLabel: "Mark Cooked & Pack" },
  READY: { label: "Packed / Ready", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400", next: "COMPLETED", nextLabel: "Hand Off to Rider" },
  COMPLETED: { label: "Delivered", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  CANCELLED: { label: "Cancelled", cls: "bg-stone-500/20 text-stone-400 border-stone-500/30", dot: "bg-stone-500" },
};

const FILTERS = [
  { key: "all", label: "All Active" },
  { key: "CONFIRMED", label: "🔥 On Grill" },
  { key: "PAID", label: "⏳ Queued" },
  { key: "READY", label: "✅ Ready" },
] as const;

const spiceName = (id: string | null) => (id ? SPICE_OPTIONS.find((s) => s.id === id)?.name ?? id : null);
const sidesNames = (ids: string | null) =>
  ids ? ids.split(",").map((i) => SIDE_OPTIONS.find((s) => s.id === i)?.name ?? i).join(", ") : null;

function ageLabel(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ${mins % 60}m ago`;
}

type RawOrder = {
  id: string;
  status: Status;
  totalKobo: number;
  createdAt: string | Date;
  address?: string | null;
  user?: { name?: string | null; phone?: string | null } | null;
  transaction?: { status?: string | null; reference?: string | null } | null;
  items?: { id: string; quantity: number; spice?: string | null; sides?: string | null; note?: string | null; dish?: { name: string } }[];
};

/** Normalize a raw Prisma order (from /api/orders?all=1) into a KitchenOrder. */
function normalizeOrder(o: RawOrder): KitchenOrder {
  return {
    id: o.id,
    reference: o.transaction?.reference ?? `LB-${o.id.slice(-4).toUpperCase()}`,
    status: o.status,
    customerName: o.user?.name ?? "Unknown",
    phone: o.user?.phone ?? null,
    address: o.address ?? null,
    paid: o.transaction?.status === "SUCCESS",
    totalKobo: o.totalKobo,
    createdAt: new Date(o.createdAt).toISOString(),
    items: (o.items ?? []).map((it) => ({
      id: it.id,
      quantity: it.quantity,
      name: it.dish?.name ?? "Item",
      spice: it.spice ?? null,
      sides: it.sides ?? null,
      note: it.note ?? null,
    })),
  };
}

export default function KitchenOrders({ orders: initial }: { orders: KitchenOrder[] }) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initial);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(initial.find((o) => ACTIVE.includes(o.status))?.id ?? initial[0]?.id ?? null);
  const [muted, setMuted] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [pending, startTransition] = useTransition();
  const [clock, setClock] = useState("--:--:--");
  const knownIds = useRef<Set<string>>(new Set(initial.map((o) => o.id)));
  const audioCtx = useRef<AudioContext | null>(null);

  // Live clock (client-only, seeded deterministically to avoid hydration mismatch).
  useEffect(() => {
    setClock(new Date().toLocaleTimeString("en-GB"));
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => clearInterval(t);
  }, []);

  const playChime = useCallback(() => {
    if (muted) return;
    try {
      audioCtx.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = now + i * 0.18;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    } catch {
      /* audio unavailable */
    }
  }, [muted]);

  // Poll for new orders (realtime SSE will replace this later).
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/orders?all=1");
        if (!res.ok) return;
        const data = (await res.json()) as { orders: RawOrder[] };
        const normalized = data.orders.map(normalizeOrder);
        const incoming = normalized.filter((o) => !knownIds.current.has(o.id));
        if (incoming.length > 0 && !muted) {
          playChime();
          setNewCount((c) => c + incoming.length);
        }
        knownIds.current = new Set(normalized.map((o) => o.id));
        setOrders(normalized);
      } catch {
        /* transient */
      }
    };
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, [playChime, muted]);

  const activeOrders = useMemo(() => orders.filter((o) => ACTIVE.includes(o.status)), [orders]);

  const filtered = useMemo(() => {
    if (filter === "all") return activeOrders;
    return activeOrders.filter((o) => o.status === filter);
  }, [activeOrders, filter]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  function advanceStatus(order: KitchenOrder) {
    const meta = STATUS_META[order.status];
    if (!meta.next) return;
    startTransition(async () => {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: meta.next }),
      });
      if (res.ok) {
        setNewCount(0);
        const fresh = (await fetch("/api/orders?all=1").then((r) => r.json())) as { orders: RawOrder[] };
        setOrders(fresh.orders.map(normalizeOrder));
      }
    });
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-stone-900 text-stone-100">
      {/* Top bar */}
      <header className="bg-stone-950 border-b border-stone-800 px-6 py-3 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <a href="/admin" className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-lg">local_fire_department</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-white tracking-tight leading-none">LIVE KITCHEN EXPEDITE</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Feed
                </span>
              </div>
              <span className="text-[11px] text-stone-400">High-Density Queue &amp; Chef Prep Station</span>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl">
          {FILTERS.map((f) => {
            const count =
              f.key === "all" ? activeOrders.length : activeOrders.filter((o) => o.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-label transition-all ${
                  filter === f.key ? "bg-brand-red text-white shadow-xs" : "text-stone-400 hover:text-white"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold font-label transition-colors"
          >
            <span className={`material-symbols-outlined text-base ${muted ? "text-stone-500" : "text-amber-400"}`}>
              {muted ? "volume_off" : "volume_up"}
            </span>
            <span>{muted ? "Muted" : "Chime On"}</span>
          </button>
          <div className="bg-black/60 border border-stone-800 px-3 py-1 rounded-xl font-mono text-xs font-bold text-amber-400">
            {clock}
          </div>
        </div>
      </header>

      {/* Master-detail */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Master list */}
        <div className="w-7/12 border-r border-stone-800 flex flex-col bg-stone-950/40">
          <div className="px-5 py-2.5 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between text-xs text-stone-400 font-medium shrink-0">
            <div className="flex items-center gap-2">
              <span>Active tickets: <strong className="text-white">{activeOrders.length}</strong></span>
              {newCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-red text-white font-bold">+{newCount} new</span>
              )}
            </div>
            <div className="text-[11px] text-stone-500 font-mono">Click row to inspect ticket →</div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-800/70">
            {filtered.length === 0 ? (
              <p className="p-10 text-center text-stone-500">No active orders in this stage.</p>
            ) : (
              filtered.map((o) => {
                const meta = STATUS_META[o.status];
                const first = o.items[0];
                const spice = spiceName(first?.spice ?? null);
                const shortRef = o.reference.replace("LB-", "#");
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={`p-4 hover:bg-stone-800/50 cursor-pointer transition-all border-l-4 flex items-center justify-between gap-4 ${
                      selectedId === o.id ? "border-brand-red bg-stone-800/40" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                     
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">{o.reference}</span>
                          <span className="text-xs text-stone-300 font-bold truncate">{o.customerName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-stone-500/20 text-stone-300">
                            {ageLabel(o.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          {spice ? ` • ${spice}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-label flex items-center gap-1 ${meta.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone-400">{formatNaira(o.totalKobo)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-5/12 flex flex-col bg-stone-900 p-6 overflow-y-auto">
          {selected ? (
            <div className="bg-stone-950 rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-stone-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-3xl font-black text-white">{selected.reference}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-label ${STATUS_META[selected.status].cls}`}>
                      {STATUS_META[selected.status].label.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {ageLabel(selected.createdAt)} • {selected.paid ? "Paid Online" : "Awaiting Payment"}
                  </div>
                </div>
                <span className="font-mono text-2xl font-black text-amber-400">{formatNaira(selected.totalKobo)}</span>
              </div>

              {/* Customer card */}
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-headline font-bold text-white text-sm">{selected.customerName}</div>
                  {selected.phone && <div className="text-stone-400">{selected.phone}</div>}
                  {selected.address && <div className="text-stone-500 mt-0.5">{selected.address}</div>}
                </div>
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">call</span>
                  </a>
                )}
              </div>

              {/* Items checklist */}
              <div className="space-y-3">
                <span className="text-label-sm font-label uppercase font-bold text-stone-400 tracking-wider block">
                  Dish Prep Checklist
                </span>
                <div className="space-y-2.5">
                  {selected.items.map((it) => {
                    const spice = spiceName(it.spice);
                    const sides = sidesNames(it.sides);
                    return (
                      <div key={it.id} className="bg-stone-900 p-4 rounded-2xl border border-stone-800/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-white">{it.quantity}x {it.name}</span>
                        </div>
                        <div className="text-xs space-y-1">
                          {spice && (
                            <div className="text-brand-red font-bold uppercase tracking-wide bg-red-950/60 p-1.5 rounded-lg border border-brand-red/30">
                              ⚡ SPICE: {spice}
                            </div>
                          )}
                          {sides && <div className="text-stone-300 font-medium pl-1">• {sides}</div>}
                        </div>
                        {it.note && (
                          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                            <span className="material-symbols-outlined text-base mt-0.5 shrink-0">notes</span>
                            <div>
                              <strong>Customer Prep Note:</strong>
                              <p className="mt-0.5">{it.note}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advance status button */}
              {STATUS_META[selected.status].next && (
                <div className="pt-2 border-t border-stone-800/80">
                  <button
                    onClick={() => advanceStatus(selected)}
                    disabled={pending}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-label text-label-md font-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <span>{pending ? "…" : STATUS_META[selected.status].nextLabel}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-stone-500 text-center p-10">Select an order to view its ticket.</p>
          )}
        </div>
      </div>
    </div>
  );
}
