"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/format";
import { SPICE_OPTIONS, SIDE_OPTIONS } from "@/lib/menu-options";
import type { OrderRow } from "./page";

const STATUS_LABEL: Record<OrderRow["status"], string> = {
  PENDING: "Awaiting Payment",
  PAID: "Payment Received",
  CONFIRMED: "In the Kitchen",
  READY: "Out for Delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

function spiceLabel(id: string | null) {
  return id ? SPICE_OPTIONS.find((s) => s.id === id)?.name ?? id : null;
}
function sidesLabel(ids: string | null) {
  return ids
    ? ids
        .split(",")
        .map((i) => SIDE_OPTIONS.find((s) => s.id === i)?.name ?? i)
        .join(", ")
    : null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersView({
  active,
  completed,
}: {
  active: OrderRow[];
  completed: OrderRow[];
}) {
  const [tab, setTab] = useState<"active" | "past">(active.length ? "active" : "past");
  const [query, setQuery] = useState("");

  const source = tab === "active" ? active : completed;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (o) =>
        o.reference.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [source, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
      {/* Header + stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-light-outline-variant/50 pb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-light-on-surface">
            My Orders &amp; Culinary History
          </h1>
          <p className="text-body-md text-light-outline">
            Track your active deliveries and easily re-order your favorites.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-light-surface-container border border-light-outline-variant/50 text-center">
            <span className="text-xs text-light-outline font-label uppercase block font-bold">
              Total Orders
            </span>
            <span className="font-display text-xl font-extrabold text-light-on-surface">
              {active.length + completed.length} Bites
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-label uppercase block font-bold">
              Completed
            </span>
            <span className="font-display text-xl font-extrabold text-emerald-700">
              {completed.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs (mobile + desktop filter) */}
      <div className="flex rounded-xl bg-light-surface-container p-1 text-label-md font-label font-bold mb-6 mt-4 lg:mt-6">
        <button
          onClick={() => setTab("active")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            tab === "active"
              ? "bg-light-surface text-light-primary shadow-xs"
              : "text-light-outline hover:text-light-on-surface"
          }`}
        >
          <span>Active ({active.length})</span>
          {active.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setTab("past")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-colors ${
            tab === "past"
              ? "bg-light-surface text-light-primary shadow-xs"
              : "text-light-outline hover:text-light-on-surface"
          }`}
        >
          Past Orders ({completed.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs mb-6">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-light-outline text-lg pointer-events-none">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID or dish..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <span className="material-symbols-outlined text-6xl text-light-outline-variant">
            receipt_long
          </span>
          <p className="font-headline text-headline-sm text-light-on-surface">
            {query ? "No orders match your search" : "No orders here yet"}
          </p>
          {!query && (
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110"
            >
              Browse Today&apos;s Menu
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  const isActive = order.status !== "COMPLETED" && order.status !== "CANCELLED";
  const firstItem = order.items[0];
  const spice = firstItem ? spiceLabel(firstItem.spice) : null;
  const sides = firstItem ? sidesLabel(firstItem.sides) : null;
  const customization = [spice, sides].filter(Boolean).join(" • ");

  return (
    <div
      className={`bg-light-surface rounded-2xl lg:rounded-3xl p-4 lg:p-6 space-y-4 border ${
        isActive ? "border-2 border-brand-red shadow-sm" : "border border-light-outline-variant/60"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headline text-label-lg font-bold text-light-on-surface">
              #{order.reference}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-label-sm font-label font-bold ${
                isActive
                  ? "bg-red-100 text-brand-red"
                  : order.status === "CANCELLED"
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse mr-1" />
              )}
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <span className="text-body-sm text-light-outline block mt-0.5">
            {fmtDate(order.createdAt)} • {order.paid ? "Paid" : "Unpaid"}{" "}
            {formatNaira(order.totalKobo)}
          </span>
        </div>

        {isActive && (
          <Link
            href={`/app/orders/${order.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-brand-red text-white text-label-sm font-label font-bold flex items-center gap-1 shrink-0"
          >
            Track
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}
      </div>

      {/* Items line */}
      <div className="flex items-center gap-3 py-2 border-t border-light-outline-variant/40">
        {firstItem?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstItem.image}
            alt={firstItem.name}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-headline text-body-md font-bold text-light-on-surface truncate">
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </h4>
          {customization && (
            <span className="text-body-sm text-light-outline truncate block">
              {customization}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href={`/app/orders/${order.id}`}
          className="text-label-sm font-label text-amber-600 font-bold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">receipt</span>
          {isActive ? "View Details" : "View Receipt"}
        </Link>
        {firstItem && (
          <Link
            href={`/app/dish/${firstItem.dishId}`}
            className="px-3.5 py-1.5 rounded-lg bg-light-surface-container border border-light-outline-variant text-light-on-surface text-label-sm font-label font-bold hover:bg-light-surface-container-high transition-colors"
          >
            Re-order
          </Link>
        )}
      </div>
    </div>
  );
}
