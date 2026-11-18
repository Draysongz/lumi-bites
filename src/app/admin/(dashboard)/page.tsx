import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatNaira } from "@/lib/format";
import { lookupDishImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";
import StatusAdvance from "./StatusAdvance";

export const dynamic = "force-dynamic";

const ACTIVE_STATUS = ["PENDING", "PAID", "CONFIRMED", "READY"];

const STATUS_PILL: Record<string, { label: string; cls: string; dot: string }> = {
  PENDING: { label: "Awaiting Payment", cls: "bg-stone-100 text-stone-700", dot: "bg-stone-500" },
  PAID: { label: "Paid — Queued", cls: "bg-amber-100 text-amber-900", dot: "bg-amber-600 animate-ping" },
  CONFIRMED: { label: "On Flame Grill", cls: "bg-amber-100 text-amber-900", dot: "bg-amber-600 animate-ping" },
  READY: { label: "Ready / Packed", cls: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-600" },
  COMPLETED: { label: "Delivered", cls: "bg-stone-100 text-stone-600", dot: "bg-stone-400" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

export default async function AdminDashboardPage() {
  const [orders, menu] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { dish: true } },
        transaction: true,
      },
    }),
    prisma.dayMenu.findFirst({
      where: { date: { gte: lagosTodayStart(), lt: lagosTodayEnd() }, active: true },
      include: { dayDishes: { include: { dish: true } } },
    }),
  ]);

  const todayStart = lagosTodayStart();
  const todayOrders = orders.filter((o) => o.createdAt >= todayStart);
  const paidToday = todayOrders.filter(
    (o) => o.transaction?.status === "SUCCESS" || o.status === "PAID" || o.status === "COMPLETED",
  );
  const revenueKobo = paidToday.reduce((sum, o) => sum + o.totalKobo, 0);
  const activeOrders = orders.filter((o) => ACTIVE_STATUS.includes(o.status));
  const queueByStage = {
    grilling: activeOrders.filter((o) => o.status === "CONFIRMED").length,
    ready: activeOrders.filter((o) => o.status === "READY").length,
  };
  const portionsLeft = menu?.dayDishes.reduce((sum, dd) => sum + (dd.portionsLeft ?? 0), 0) ?? 0;

  // Resolve dish images (presign Neon-bucket URLs) for the menu batch grid.
  const menuImages = new Map<string, string | null>();
  if (menu) {
    await Promise.all(
      menu.dayDishes.map(async (dd) => {
        menuImages.set(dd.id, await resolveImageUrl(dd.dish.imageUrl));
      }),
    );
  }

  return (
    <>
      {/* Top header */}
      <header className="bg-white border-b border-light-outline-variant/50 px-6 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-dark leading-tight">
            Kitchen Operations Dashboard
          </h1>
          <p className="text-xs text-light-outline font-medium">
            Lagos Live Batch Monitoring • {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-light-outline-variant hover:bg-stone-50 text-light-on-surface font-label text-label-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">storefront</span>
            <span className="hidden lg:inline">Customer App</span>
          </Link>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* KPI cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-label-sm font-label uppercase font-bold text-light-outline tracking-wider">
                Today&apos;s Paid Revenue
              </span>
              <div className="font-display text-2xl lg:text-3xl font-black text-brand-dark">
                {formatNaira(revenueKobo)}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-light-outline">
                <span>{paidToday.length} paid order{paidToday.length === 1 ? "" : "s"}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-label-sm font-label uppercase font-bold text-light-outline tracking-wider">
                Kitchen Queue
              </span>
              <div className="font-display text-2xl lg:text-3xl font-black text-brand-red">
                {activeOrders.length} Active
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                <span className="material-symbols-outlined text-sm">skillet</span>
                <span>
                  {queueByStage.grilling} grilling • {queueByStage.ready} ready
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center border border-red-100">
              <span className="material-symbols-outlined text-2xl">local_fire_department</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-light-outline-variant/60 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-label-sm font-label uppercase font-bold text-light-outline tracking-wider">
                Portions Left Today
              </span>
              <div className="font-display text-2xl lg:text-3xl font-black text-amber-600">
                {portionsLeft} Portions
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-light-outline">
                <span>{menu?.dayDishes.length ?? 0} dishes live</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
          </div>
        </section>

        {/* Live order queue */}
        <section className="bg-white rounded-3xl border border-light-outline-variant/60 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-light-outline-variant/40">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-headline-sm font-bold text-brand-dark">
                  Live Order Stream &amp; Kitchen Queue
                </h2>
                {activeOrders.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-red text-white text-xs font-label font-bold">
                    {activeOrders.length} Pending
                  </span>
                )}
              </div>
              <p className="text-body-sm text-light-outline mt-0.5">
                Orders received from online checkout
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-label-sm font-label font-bold text-brand-red hover:underline"
            >
              View all orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="text-label-sm font-label uppercase font-bold text-light-outline bg-stone-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Order &amp; Customer</th>
                  <th className="px-4 py-3">Dishes</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Amount &amp; Pay</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant/30 font-medium">
                {orders.slice(0, 8).map((o) => {
                  const pill = STATUS_PILL[o.status] ?? STATUS_PILL.PENDING;
                  const spice = o.items[0]?.spice ? ` • ${o.items[0].spice}` : "";
                  return (
                    <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-headline font-bold text-brand-dark">
                          #{o.transaction?.reference ?? `LB-${o.id.slice(-4).toUpperCase()}`}
                        </div>
                        <div className="text-xs text-light-outline">
                          {o.user?.name ?? "Unknown"} {o.user?.phone ? `• ${o.user.phone}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-brand-dark font-bold truncate max-w-[220px]">
                          {o.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(", ")}
                        </div>
                        {spice && <div className="text-xs text-brand-red font-semibold">{spice}</div>}
                      </td>
                      <td className="px-4 py-4 text-xs text-stone-700">
                        <div className="font-bold">{o.address?.split(",")[0] ?? "—"}</div>
                        {o.address && (
                          <div className="text-light-outline truncate max-w-[160px]">{o.address}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-brand-dark">{formatNaira(o.totalKobo)}</div>
                        <span
                          className={`text-[11px] font-bold ${
                            o.transaction?.status === "SUCCESS" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {o.transaction?.status === "SUCCESS" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${pill.cls}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />
                          {pill.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <StatusAdvance orderId={o.id} status={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="py-10 text-center text-light-outline">No orders yet.</p>
            )}
          </div>
        </section>

        {/* Today's menu batches */}
        <section className="bg-white rounded-3xl border border-light-outline-variant/60 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant/40">
            <div>
              <h3 className="font-headline text-headline-sm font-bold text-brand-dark">
                Today&apos;s Active Menu Batches
              </h3>
              <p className="text-body-sm text-light-outline">Update portions or pause a dish</p>
            </div>
            <Link
              href="/admin/menu"
              className="flex items-center gap-1 text-label-sm font-label font-bold text-brand-red hover:underline"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Manage Menu
            </Link>
          </div>

          {menu && menu.dayDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.dayDishes.map((dd) => {
                const dish = dd.dish;
                const portionsLeft = dd.portionsLeft;
                const low = (portionsLeft ?? 0) <= 4;
                const img = menuImages.get(dd.id) ?? lookupDishImage(dish.name);
                return (
                  <div
                    key={dd.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-light-outline-variant/60 flex items-start gap-3.5"
                  >
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-light-surface-container flex items-center justify-center shrink-0 text-light-outline-variant">
                        <span className="material-symbols-outlined text-3xl">restaurant</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-headline text-body-md font-bold text-brand-dark truncate">
                        {dish.name}
                      </h4>
                      <div className="text-xs text-light-outline">{formatNaira(dish.priceKobo)}</div>
                      <span
                        className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                          low
                            ? "text-red-700 bg-red-100/70"
                            : "text-emerald-700 bg-emerald-100/70"
                        }`}
                      >
                        {portionsLeft != null ? `${portionsLeft} portions left` : "No limit set"}
                        {low && " (Low)"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-light-outline">
              No active menu for today.{" "}
              <Link href="/admin/menu" className="text-brand-red font-bold hover:underline">
                Upload today&apos;s batch →
              </Link>
            </p>
          )}
        </section>
      </div>
    </>
  );
}
