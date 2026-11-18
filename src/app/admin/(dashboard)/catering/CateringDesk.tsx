"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";
import type { CateringRow } from "./page";

type BookingStatus = CateringRow["status"];

const STATUS_META: Record<BookingStatus, { label: string; cls: string; tab: "new" | "quoted" | "confirmed" | "done" }> = {
  INQUIRY: { label: "New Request", cls: "bg-red-100 text-brand-red", tab: "new" },
  QUOTED: { label: "Quote Sent", cls: "bg-amber-100 text-amber-800", tab: "quoted" },
  DEPOSIT_PAID: { label: "Deposit Paid", cls: "bg-emerald-100 text-emerald-800", tab: "confirmed" },
  CONFIRMED: { label: "Confirmed & Paid", cls: "bg-emerald-100 text-emerald-800", tab: "confirmed" },
  COMPLETED: { label: "Completed", cls: "bg-stone-100 text-stone-600", tab: "done" },
  CANCELLED: { label: "Cancelled", cls: "bg-stone-100 text-stone-500", tab: "done" },
};

const TABS = [
  { key: "all", label: "All Inquiries" },
  { key: "new", label: "New Requests" },
  { key: "quoted", label: "Quote Sent" },
  { key: "confirmed", label: "Confirmed & Paid" },
] as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

export default function CateringDesk({ bookings }: { bookings: CateringRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(bookings[0]?.id ?? null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let list = bookings;
    if (tab === "new") list = list.filter((b) => b.status === "INQUIRY");
    if (tab === "quoted") list = list.filter((b) => b.status === "QUOTED");
    if (tab === "confirmed") list = list.filter((b) => b.status === "DEPOSIT_PAID" || b.status === "CONFIRMED");
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((b) =>
        [b.eventType, b.clientName, b.company, b.venue].filter(Boolean).join(" ").toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, tab, query]);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  function setStatus(booking: CateringRow, status: BookingStatus) {
    startTransition(async () => {
      const res = await fetch(`/api/catering/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-dark leading-tight">
            Catering &amp; Event Requests
          </h1>
          <p className="text-xs text-light-outline font-medium">
            Lagos corporate &amp; party orders — review, quote, and confirm.
          </p>
        </div>
        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-light-outline-variant hover:bg-stone-50 text-light-on-surface font-label text-label-sm font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-lg text-emerald-600">chat</span>
          Open Catering WhatsApp
        </a>
      </div>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Pending Review"
          value={`${bookings.filter((b) => b.status === "INQUIRY").length} Requests`}
          sub="Needs quote in 24 hrs"
          accent="bg-red-50 text-brand-red"
          icon="mark_email_unread"
        />
        <MetricCard
          label="Confirmed"
          value={`${bookings.filter((b) => b.status === "DEPOSIT_PAID" || b.status === "CONFIRMED").length} Events`}
          sub="Deposits cleared"
          accent="bg-emerald-50 text-emerald-600"
          icon="event_available"
        />
        <MetricCard
          label="Quote Sent"
          value={`${bookings.filter((b) => b.status === "QUOTED").length} Requests`}
          sub="Awaiting deposit"
          accent="bg-amber-50 text-amber-700"
          icon="payments"
        />
      </section>

      {/* Filter tabs + search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-light-outline-variant/40">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-label-sm font-label font-bold shrink-0 transition-all ${
                tab === t.key ? "bg-brand-red text-white shadow-xs" : "bg-white border border-light-outline-variant text-stone-700 hover:bg-stone-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client, company, or event..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-light-outline-variant/70 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
          />
        </div>
      </div>

      {/* Master-detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List */}
        <div className="lg:col-span-7 space-y-4">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-light-outline">No catering requests here.</p>
          ) : (
            filtered.map((b) => {
              const meta = STATUS_META[b.status];
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`bg-white p-5 rounded-3xl shadow-xs cursor-pointer transition-all relative overflow-hidden ${
                    selectedId === b.id ? "border-2 border-brand-red" : "border border-light-outline-variant/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-label text-[10px] font-black uppercase tracking-wider ${meta.cls}`}>
                          {meta.label}
                        </span>
                        <span className="text-xs font-mono text-stone-400">#{b.reference}</span>
                      </div>
                      <h3 className="font-display text-lg font-black text-brand-dark mt-1">{b.eventType}</h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {[b.venue, b.address].filter(Boolean).join(" • ") || "Venue TBD"} • {b.guestCount} Guests
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-label font-bold text-stone-400 uppercase block">Quote</span>
                      <span className="font-display text-xl font-black text-brand-dark">
                        {b.quoteKobo ? formatNaira(b.quoteKobo) : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-sm text-brand-red">calendar_month</span> {fmtDate(b.eventDate)}
                    </span>
                    {b.menuItems && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-stone-400">local_fire_department</span> {b.menuItems.slice(0, 60)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-stone-500">
                    <span className="font-bold text-stone-700">{b.clientName}</span>
                    {b.clientPhone && <span className="text-stone-400">• {b.clientPhone}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {selected ? (
            <div className="bg-white rounded-3xl p-6 lg:p-7 border border-light-outline-variant/60 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-light-outline-variant/40">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full font-label text-xs font-black uppercase tracking-wide ${STATUS_META[selected.status].cls}`}>
                    {STATUS_META[selected.status].label}
                  </span>
                  <h2 className="font-display text-2xl font-black text-brand-dark mt-2">{selected.eventType}</h2>
                  <p className="text-xs text-stone-500 mt-1">#{selected.reference} • {fmtDate(selected.eventDate)}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-stone-50 rounded-2xl p-4 space-y-3 border border-stone-200/60">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-label font-bold text-stone-400 uppercase block">Organizer</span>
                    <span className="font-bold text-stone-800">{selected.clientName}</span>
                    {selected.company && <span className="text-[11px] text-stone-500 block">{selected.company}</span>}
                  </div>
                  <div>
                    <span className="text-[10px] font-label font-bold text-stone-400 uppercase block">Direct Line</span>
                    {selected.clientPhone && (
                      <a href={`tel:${selected.clientPhone}`} className="font-bold text-brand-red hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">call</span> {selected.clientPhone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-200/60 text-xs">
                  <span className="text-[10px] font-label font-bold text-stone-400 uppercase block">Event Details</span>
                  <span className="font-bold text-stone-800">{selected.venue ?? "Venue TBD"}</span>
                  <span className="text-[11px] text-stone-500 block">{selected.guestCount} guests{selected.address ? ` • ${selected.address}` : ""}</span>
                </div>
              </div>

              {/* Requested menu + note */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-label-md font-bold text-brand-dark">Requested Menu</span>
                  <span className="text-xs font-bold text-brand-red">{selected.guestCount} Portions</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/50 text-xs text-stone-700">
                  {selected.menuItems?.split("\n").map((line, i) => <div key={i}>• {line}</div>) || "No menu detail provided."}
                </div>
                {selected.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-700">comment</span> Client Note:
                    </span>
                    <p className="text-amber-800 text-[11px] leading-relaxed italic">{selected.notes}</p>
                  </div>
                )}
              </div>

              {/* Quote summary */}
              <div className="pt-3 border-t border-light-outline-variant/50 space-y-2">
                <div className="flex items-center justify-between text-base font-extrabold text-brand-dark">
                  <span>Total Quote</span>
                  <span className="font-display text-2xl font-black text-brand-red">
                    {selected.quoteKobo ? formatNaira(selected.quoteKobo) : "—"}
                  </span>
                </div>
                {selected.quoteKobo && (
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>70% Commitment Deposit</span>
                    <span className="font-mono font-bold text-stone-700">{formatNaira(Math.round(selected.quoteKobo * 0.7))}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {selected.status === "INQUIRY" && (
                  <button
                    onClick={() => setStatus(selected, "QUOTED")}
                    disabled={pending}
                    className="w-full py-3 rounded-2xl bg-brand-red hover:bg-red-700 text-white font-headline text-label-md font-bold shadow-md shadow-brand-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    Mark Quote Sent
                  </button>
                )}
                {selected.status === "QUOTED" && (
                  <button
                    onClick={() => setStatus(selected, "DEPOSIT_PAID")}
                    disabled={pending}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-headline text-label-md font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                    Mark 70% Deposit Paid
                  </button>
                )}
                {(selected.status === "DEPOSIT_PAID" || selected.status === "CONFIRMED") && (
                  <button
                    onClick={() => setStatus(selected, "CONFIRMED")}
                    disabled={pending}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-headline text-label-md font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">event_available</span>
                    Confirm &amp; Reserve Kitchen Slot
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-stone-500 text-center p-10">Select a request to view its dossier.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, accent, icon }: { label: string; value: string; sub: string; accent: string; icon: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between">
      <div>
        <span className="text-xs font-label font-bold text-stone-500 uppercase tracking-wider block">{label}</span>
        <span className="font-display text-3xl font-black text-brand-dark mt-1 block">{value}</span>
        <span className="text-[11px] text-stone-500 font-semibold mt-1 block">{sub}</span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );
}
