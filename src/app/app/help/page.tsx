"use client";

import { useMemo, useState } from "react";

const FAQS = [
  {
    id: "delivery",
    icon: "local_shipping",
    iconClass: "bg-red-50 text-brand-red",
    q: "How fast is delivery and which areas in Lagos are covered?",
    a: "Average delivery time across Lekki, Ikoyi, Victoria Island and Ikeja GRA is 35–45 minutes from when the dish comes off the grill. You can track your dispatch rider in real time on the Live Tracking screen.",
  },
  {
    id: "payment",
    icon: "account_balance_wallet",
    iconClass: "bg-amber-50 text-amber-700",
    q: "My bank account was debited, but order is showing unconfirmed?",
    a: "Online transfers through Nigerian banking channels can occasionally delay webhook confirmation by 2–3 minutes. If your money left your account, paste your session ID / reference in the form or message WhatsApp, and our care desk will confirm your meal immediately.",
  },
  {
    id: "spice",
    icon: "restaurant",
    iconClass: "bg-orange-50 text-orange-700",
    q: "Can I alter the pepper heat or request extra fried plantains?",
    a: "Yes! You can choose Mild, Medium, or Lagos Fire when adding any dish to cart. If you placed the order already and need adjustments, call the kitchen hotline within 5 minutes so we can alert the head chef before boxing.",
  },
  {
    id: "catering",
    icon: "groups",
    iconClass: "bg-emerald-50 text-emerald-700",
    q: "How do bulk office catering and party orders work?",
    a: "For gatherings of 10 or more — large coolers of party jollof, bulk grilled catfish trays, and 50+ beef suya sticks — we ask for 24 hours advance notice. Contact our concierge desk for tailored corporate billing and delivery scheduling.",
  },
  {
    id: "refund",
    icon: "published_with_changes",
    iconClass: "bg-blue-50 text-blue-700",
    q: "What is your policy if an item arrives cold or spilled?",
    a: "Lumi's Bites guarantees every meal. If your food arrives spilled or incomplete, send a quick photo within 2 hours. We will immediately dispatch a replacement meal or credit your Lumi's wallet with zero hassle.",
  },
];

const CATEGORIES = [
  "Missing side dish or protein",
  "Delivery took longer than estimated",
  "Payment charged but order pending",
  "Damaged or spilled packaging",
  "Other customer inquiry",
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Report Order Issue");
  const [toast, setToast] = useState(false);

  // Desktop ticket form state.
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [details, setDetails] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [query]);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  }

  function openModal(title: string) {
    setModalTitle(title);
    setModalOpen(true);
  }

  function submitReport() {
    setModalOpen(false);
    setDetails("");
    showToast();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
      {/* Hero search banner */}
      <div className="relative bg-gradient-to-br from-brand-dark via-stone-900 to-black text-white rounded-3xl p-6 lg:p-10 shadow-lg overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-red/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-label text-label-sm font-bold uppercase tracking-wider">
            Lumi&apos;s Care Center
          </span>
          <h1 className="font-display text-3xl lg:text-5xl font-black text-white tracking-tight">
            How can we help with your meal today?
          </h1>
          <p className="text-body-md text-stone-300">
            Instant answers on delivery timing, spice customization, payments, and live order assistance.
          </p>
          <div className="relative pt-2 max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-2xl">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions (e.g. delivery time, spice levels, payment)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white text-stone-900 rounded-2xl placeholder-stone-400 font-body text-body-md focus:outline-none focus:ring-4 focus:ring-brand-red/40 shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Contact action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <span className="font-label font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
              ~2 min reply
            </span>
          </div>
          <div>
            <h3 className="font-headline text-headline-sm font-bold text-emerald-950">WhatsApp Concierge</h3>
            <p className="text-body-sm text-emerald-800/80 mt-1">
              Direct chat for quick photo reviews, missing items, or order updates.
            </p>
          </div>
          <div className="flex items-center gap-1 font-label text-label-sm font-bold text-emerald-700">
            Message on WhatsApp
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </a>

        <a
          href="tel:+2348000000000"
          className="p-6 rounded-3xl bg-light-surface-container-low hover:bg-light-surface-container border border-light-outline-variant/60 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
            </div>
            <span className="font-label font-bold text-light-on-surface bg-white px-2.5 py-1 rounded-full border border-light-outline-variant text-xs">
              Live Hotline
            </span>
          </div>
          <div>
            <h3 className="font-headline text-headline-sm font-bold text-light-on-surface">Kitchen Phone Line</h3>
            <p className="text-body-sm text-light-outline mt-1">
              Speak directly with dispatch or kitchen supervisors before food leaves the grill.
            </p>
          </div>
          <div className="flex items-center gap-1 font-label text-label-sm font-bold text-brand-red">
            +234 (0) 800 LUMI BITES
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              call
            </span>
          </div>
        </a>

        <a
          href="/app/orders"
          className="p-6 rounded-3xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">moped</span>
            </div>
            <span className="font-label font-bold text-amber-900 bg-white px-2.5 py-1 rounded-full border border-amber-200 text-xs">
              Active Order
            </span>
          </div>
          <div>
            <h3 className="font-headline text-headline-sm font-bold text-amber-950">Track Ongoing Order</h3>
            <p className="text-body-sm text-amber-900/80 mt-1">
              See your order status and direct contact milestone updates.
            </p>
          </div>
          <div className="flex items-center gap-1 font-label text-label-sm font-bold text-amber-800">
            Open Live Tracking
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </a>
      </div>

      {/* Two-column: FAQ + ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        {/* FAQ accordion */}
        <section className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="font-headline text-headline-sm font-bold text-light-on-surface">
              Frequently Asked Questions
            </h2>
            <p className="text-body-sm text-light-outline">
              {query ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "Instant solutions to common ordering questions"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6 rounded-2xl bg-light-surface border border-light-outline-variant/60 text-center text-light-outline">
              No FAQs match &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((f) => (
                <details
                  key={f.id}
                  open={query.trim().length > 0}
                  className="group bg-light-surface rounded-2xl border border-light-outline-variant/60 overflow-hidden shadow-xs"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none font-headline text-body-md font-bold text-light-on-surface">
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${f.iconClass}`}
                      >
                        <span className="material-symbols-outlined text-lg">{f.icon}</span>
                      </span>
                      <span>{f.q}</span>
                    </span>
                    <span className="material-symbols-outlined text-light-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-1 text-body-md text-light-outline leading-relaxed border-t border-light-outline-variant/30">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        {/* Ticket form */}
        <section className="lg:col-span-5 bg-light-surface rounded-3xl border border-light-outline-variant/60 p-6 shadow-sm space-y-5">
          <div>
            <div className="flex items-center gap-2 text-brand-red mb-1">
              <span className="material-symbols-outlined text-xl">report_problem</span>
              <span className="text-label-sm font-label font-bold uppercase tracking-wider">Quick Ticket</span>
            </div>
            <h3 className="font-headline text-headline-sm font-bold text-light-on-surface">
              Report an Issue with an Order
            </h3>
            <p className="text-body-sm text-light-outline mt-0.5">
              We review and respond directly to your phone/WhatsApp
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReport();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-label-sm font-label font-bold text-light-on-surface mb-1.5">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-light-surface-container-low border border-light-outline-variant rounded-xl px-3.5 py-2.5 text-body-sm text-light-on-surface focus:ring-2 focus:ring-brand-red focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-label-sm font-label font-bold text-light-on-surface mb-1.5">
                Details
              </label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Briefly describe what happened so the kitchen can resolve it quickly..."
                className="w-full bg-light-surface-container-low border border-light-outline-variant rounded-xl px-3.5 py-2.5 text-body-sm text-light-on-surface focus:ring-2 focus:ring-brand-red focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-label text-label-md font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">send</span>
              <span>Submit Ticket to Care Desk</span>
            </button>
          </form>
        </section>
      </div>

      {/* Footer info bar */}
      <div className="bg-light-surface-container-low rounded-2xl p-5 border border-light-outline-variant/60 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left mt-8">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-light-surface flex items-center justify-center text-brand-red shadow-xs">
            <span className="material-symbols-outlined text-xl">schedule</span>
          </span>
          <div>
            <h4 className="font-headline text-label-md font-bold text-light-on-surface">
              Kitchen Batch Hours
            </h4>
            <p className="text-body-sm text-light-outline">
              Mon – Sat: 11:00 AM – 7:00 PM • Closed on Sundays
            </p>
          </div>
        </div>
        <div className="text-body-sm text-light-outline">
          Lumi&apos;s Bites Lagos • fast and yummy, good for your tummy
        </div>
      </div>

      {/* Mobile report modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-light-surface w-full max-w-[390px] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 border border-light-outline-variant shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/40">
              <h3 className="font-headline text-headline-sm font-bold text-light-on-surface">
                {modalTitle}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-light-surface-container flex items-center justify-center text-light-outline hover:text-light-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-label-sm font-label font-bold text-light-on-surface mb-1">
                  Describe what went wrong
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us if a side was missing, spice was too hot, or rider took too long..."
                  className="w-full bg-light-surface-container-low border border-light-outline-variant rounded-xl p-2.5 text-body-sm text-light-on-surface focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-light-outline-variant text-label-md font-label font-bold text-light-outline hover:bg-light-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white text-label-md font-label font-bold shadow-xs transition-colors"
              >
                Submit to Care
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-4 right-4 z-50 max-w-[358px] mx-auto bg-brand-dark text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10">
          <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
          <span className="text-body-sm font-medium">Issue received! Support is reviewing on WhatsApp.</span>
        </div>
      )}
    </div>
  );
}
