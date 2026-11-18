import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/storage";
import KitchenOrders from "./KitchenOrders";

export const dynamic = "force-dynamic";

export type KitchenOrder = {
  id: string;
  reference: string;
  status: "PENDING" | "PAID" | "CONFIRMED" | "READY" | "COMPLETED" | "CANCELLED";
  customerName: string;
  phone: string | null;
  address: string | null;
  paid: boolean;
  totalKobo: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    name: string;
    spice: string | null;
    sides: string | null;
    note: string | null;
  }[];
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, phone: true } },
      items: { include: { dish: { select: { name: true } } } },
      transaction: true,
    },
  });

  const rows: KitchenOrder[] = orders.map((o) => ({
    id: o.id,
    reference: o.transaction?.reference ?? `LB-${o.id.slice(-4).toUpperCase()}`,
    status: o.status,
    customerName: o.user?.name ?? "Unknown",
    phone: o.user?.phone ?? null,
    address: o.address,
    paid: o.transaction?.status === "SUCCESS",
    totalKobo: o.totalKobo,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      name: it.dish.name,
      spice: it.spice,
      sides: it.sides,
      note: it.note,
    })),
  }));

  return <KitchenOrders orders={rows} />;
}
