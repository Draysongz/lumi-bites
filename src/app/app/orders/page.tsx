import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { lookupDishImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";
import OrdersView from "./OrdersView";

export const dynamic = "force-dynamic";

export type OrderRow = {
  id: string;
  reference: string;
  status: "PENDING" | "PAID" | "CONFIRMED" | "READY" | "COMPLETED" | "CANCELLED";
  totalKobo: number;
  paid: boolean;
  createdAt: string;
  address: string | null;
  items: {
    id: string;
    quantity: number;
    dishId: string;
    name: string;
    image: string | null;
    spice: string | null;
    sides: string | null;
  }[];
};

const ACTIVE_STATUSES = new Set(["PENDING", "PAID", "CONFIRMED", "READY"]);

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { dish: true } }, transaction: true },
  });

  const rows: OrderRow[] = await Promise.all(
    orders.map(async (o) => ({
      id: o.id,
      reference: o.transaction?.reference ?? `LB-${o.id.slice(-4).toUpperCase()}`,
      status: o.status,
      totalKobo: o.totalKobo,
      paid: o.transaction?.status === "SUCCESS",
      createdAt: o.createdAt.toISOString(),
      address: o.address,
      items: await Promise.all(
        o.items.map(async (it) => ({
          id: it.id,
          quantity: it.quantity,
          dishId: it.dish.id,
          name: it.dish.name,
          image: (await resolveImageUrl(it.dish.imageUrl)) ?? lookupDishImage(it.dish.name),
          spice: it.spice,
          sides: it.sides,
        })),
      ),
    })),
  );

  const active = rows.filter((r) => ACTIVE_STATUSES.has(r.status));
  const completed = rows.filter((r) => !ACTIVE_STATUSES.has(r.status));

  return <OrdersView active={active} completed={completed} />;
}
