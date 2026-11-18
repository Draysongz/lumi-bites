import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatNaira } from "@/lib/format";
import { SPICE_OPTIONS, SIDE_OPTIONS } from "@/lib/menu-options";
import StatusPoller from "./StatusPoller";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const spiceName = (id: string | null) =>
  id ? SPICE_OPTIONS.find((s) => s.id === id)?.name ?? id : null;
const sidesNames = (ids: string | null) =>
  ids
    ? ids
        .split(",")
        .map((i) => SIDE_OPTIONS.find((s) => s.id === i)?.name ?? i)
        .join(", ")
    : null;

const STEPS = [
  { key: "placed", icon: "done", label: "Order Placed & Paid Online" },
  { key: "kitchen", icon: "skillet", label: "In the Kitchen & Sizzling" },
  { key: "dispatch", icon: "two_wheeler", label: "Rider Pickup & Thermal Packing" },
  { key: "delivered", icon: "home_pin", label: "Delivered to Your Door" },
] as const;

/** Derive the active timeline step (0-based index of the current/next step). */
function progressIndex(status: string, paid: boolean): number {
  if (status === "COMPLETED") return 4;
  if (status === "READY") return 3;
  if (status === "CONFIRMED") return 2;
  if (paid || status === "PAID") return 1;
  return 0;
}

export default async function OrderTrackingPage({ params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { dish: true } }, transaction: true },
  });
  if (!order) notFound();
  if (order.userId !== user.id && user.role !== "ADMIN") redirect("/app");

  const paid = order.transaction?.status === "SUCCESS";
  const active = progressIndex(order.status, paid);
  const reference = order.transaction?.reference ?? `LB-${order.id.slice(-4).toUpperCase()}`;

  const passed = paid || order.status === "PAID" || order.status === "CONFIRMED" || order.status === "READY" || order.status === "COMPLETED";

  const itemsTotal = order.totalKobo;
  const isActive = order.status !== "COMPLETED" && order.status !== "CANCELLED";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
      <StatusPoller active={isActive} />
      {/* Order ID strip (desktop) */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-light-surface-container border border-light-outline-variant/60">
          <span className="font-headline text-label-md font-bold text-light-on-surface">
            Order #{reference}
          </span>
          <span className="text-light-outline">•</span>
          <span className="inline-flex items-center gap-1.5 text-label-sm font-label font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {paid ? "Paid Online via Flutterwave" : "Awaiting Payment"}
          </span>
        </div>
        <Link
          href="/app"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-light-surface-container hover:bg-light-surface-container-high text-light-on-surface font-label text-label-md font-bold transition-state-change"
        >
          <span className="material-symbols-outlined text-lg">restaurant_menu</span>
          Order More Food
        </Link>
      </div>

      {/* Mobile order-id strip */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="font-headline text-headline-sm text-light-on-surface">
            Order #{reference}
          </span>
          <span className="text-label-sm text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {paid ? "Paid via Flutterwave" : "Awaiting Payment"}
          </span>
        </div>
      </div>

      {/* Hero banner */}
      <div className="rounded-3xl overflow-hidden bg-brand-dark text-white p-6 lg:p-8 relative shadow-md">
        <div className="absolute inset-0 bg-food-doodle" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-brand-red/35 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-brand-yellow/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-red text-white text-label-sm font-label font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">skillet</span>
              {active >= 2 ? "On The Road to You" : "In The Kitchen & Sizzling"}
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-black text-amber-400">
              {order.status === "COMPLETED"
                ? "Delivered — Enjoy!"
                : active >= 2
                  ? "Your Rider is En Route"
                  : "Estimated 25 - 35 mins"}
            </h1>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-red h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, active * 25)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2-column workspace */}
      <div className="grid grid-cols-12 gap-8 items-start mt-8">
        {/* Left: milestones + rider */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-light-surface p-5 lg:p-7 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-4">
              <h2 className="font-headline text-headline-sm text-light-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-red text-2xl">timeline</span>
                Live Kitchen &amp; Dispatch Milestones
              </h2>
            </div>

            <div className="space-y-6 relative pl-8 before:content-[''] before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-light-outline-variant/60">
              {STEPS.map((step, i) => {
                const done = i < active;
                const isActive = i === active;
                const upcoming = i > active;
                return (
                  <div key={step.key} className={`relative ${upcoming ? "opacity-60" : ""}`}>
                    <span
                      className={`absolute -left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-sm ring-4 ring-light-surface ${
                        done
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isActive
                            ? "bg-brand-red text-white shadow-xs animate-bounce"
                            : "bg-light-surface-container text-light-outline border border-light-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {done ? "done" : step.icon}
                      </span>
                    </span>
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-headline text-label-lg font-bold ${
                          isActive ? "text-brand-red" : "text-light-on-surface"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-brand-red font-label text-label-sm font-bold">
                          Active Now
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider card (only once dispatched) */}
          {order.status === "READY" || order.status === "COMPLETED" ? (
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-dark text-white flex items-center justify-center border-2 border-brand-yellow shrink-0">
                  <span className="material-symbols-outlined text-3xl text-brand-yellow">
                    sports_motorsports
                  </span>
                </div>
                <div>
                  <span className="text-label-sm font-label text-brand-red font-bold uppercase tracking-wider">
                    Assigned Dispatcher
                  </span>
                  <h3 className="font-headline text-xl text-light-on-surface font-bold">
                    Lumi Express Rider
                  </h3>
                  <div className="flex items-center gap-2 text-body-sm text-light-outline mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      4.9 Rating
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label text-label-md font-bold transition-state-change shadow-xs"
              >
                <span className="material-symbols-outlined text-xl">call</span>
                Contact
              </a>
            </div>
          ) : (
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-dark text-white flex items-center justify-center border-2 border-brand-yellow shrink-0">
                  <span className="material-symbols-outlined text-3xl text-brand-yellow">skillet</span>
                </div>
                <div>
                  <span className="text-label-sm font-label text-brand-red font-bold uppercase tracking-wider">
                    In The Kitchen
                  </span>
                  <h3 className="font-headline text-xl text-light-on-surface font-bold">
                    Chef Lumi is cooking to order
                  </h3>
                  <p className="text-body-sm text-light-outline">
                    Freshly prepared per order — no reheat, no microwaves.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: map + receipt */}
        <div className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Decorative map simulation */}
          <div className="bg-light-surface rounded-3xl border border-light-outline-variant/60 shadow-xs overflow-hidden">
            <div className="relative w-full h-56 bg-stone-200">
              <div
                className="absolute inset-0 bg-stone-100 opacity-90"
                style={{
                  backgroundImage: "radial-gradient(#d6cec6 1.5px, transparent 1.5px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 224"
                preserveAspectRatio="none"
              >
                <path
                  d="M60,160 Q180,60 380,80"
                  fill="none"
                  stroke="#E61E14"
                  strokeWidth="4"
                  strokeDasharray="6,6"
                />
              </svg>

              {/* Kitchen origin pin */}
              <div className="absolute bottom-6 left-10 flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-md bg-brand-dark text-white text-xs font-bold shadow-sm mb-1">
                  Lumi&apos;s Kitchen
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-base">skillet</span>
                </div>
              </div>

              {/* Destination pin */}
              <div className="absolute top-10 right-16 flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-md bg-brand-red text-white text-xs font-bold shadow-sm mb-1">
                  Lekki Phase 1
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse">
                  <span className="material-symbols-outlined text-base">home</span>
                </div>
              </div>

              {/* Rider moving icon */}
              <div className="absolute top-20 left-44 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-brand-dark text-brand-yellow flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-lg">sports_motorsports</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-brand-dark text-[10px] font-bold shadow-xs mt-1">
                  Rider Ready
                </span>
              </div>
            </div>

            <div className="p-4 bg-light-surface-container flex items-center justify-between text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-red text-xl">location_on</span>
                <span className="font-bold text-light-on-surface">
                  {order.address ?? "18 Admiralty Way, Lekki Phase 1"}
                </span>
              </div>
              <span className="text-xs text-light-outline">Distance: ~ 4.2 km</span>
            </div>
          </div>

          {/* Receipt */}
          <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-light-outline-variant/50 pb-3">
              <h3 className="font-headline text-headline-sm text-light-on-surface font-bold">
                Order Receipt
              </h3>
              <span
                className={`text-label-sm font-label px-2.5 py-0.5 rounded-md font-bold ${
                  paid ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                }`}
              >
                {paid ? "Paid in Full" : "Payment Pending"}
              </span>
            </div>

            <div className="space-y-3 text-body-sm">
              {order.items.map((it) => {
                const spice = spiceName(it.spice);
                const sides = sidesNames(it.sides);
                return (
                  <div key={it.id} className="flex justify-between items-start gap-3">
                    <div>
                      <span className="font-bold text-light-on-surface block">
                        {it.quantity}x {it.dish.name}
                      </span>
                      {(spice || sides) && (
                        <span className="text-xs text-light-outline">
                          {[spice, sides].filter(Boolean).join(" • ")}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-light-on-surface shrink-0">
                      {formatNaira(it.unitKobo * it.quantity)}
                    </span>
                  </div>
                );
              })}

              <div className="border-t border-light-outline-variant/60 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-light-on-surface">Total Amount</span>
                <span className="font-display text-2xl text-brand-red">
                  {formatNaira(itemsTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment instructions when not yet paid */}
          {!paid && order.transaction?.accountNumber && (
            <div className="bg-light-surface p-6 rounded-3xl border border-light-outline-variant/60 shadow-xs space-y-3">
              <h3 className="font-headline text-headline-sm text-light-on-surface font-bold">
                Pay via Bank Transfer
              </h3>
              <div className="p-4 rounded-2xl bg-light-surface-container-low border border-light-outline-variant/50 space-y-2 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-light-outline">Account Number</span>
                  <span className="font-bold text-light-on-surface tracking-wider">
                    {order.transaction.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-outline">Amount</span>
                  <span className="font-bold text-light-on-surface">
                    {formatNaira(order.totalKobo)}
                  </span>
                </div>
              </div>
              <p className="text-body-sm text-light-outline">
                Transfer the exact amount above — your order confirms automatically once received.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
