import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { generateReference } from "@/lib/reference";
import { SIDE_OPTIONS } from "@/lib/menu-options";

const SIDE_PRICE = new Map(SIDE_OPTIONS.map((s) => [s.id, s.priceKobo]));

type OrderItemInput = {
  dishId: string;
  quantity: number;
  spice?: string;
  sides?: string[];
  note?: string;
};

/** GET /api/orders — own orders (customer), or ?all=1 for admin. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "1";

    const user = all ? await requireAdmin() : await requireUser();

    const where = all ? {} : { userId: user.id };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        items: { include: { dish: true } },
        transaction: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}

/** POST /api/orders — place a pre-order. Public-required (customer). */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as {
      items: OrderItemInput[];
      pickupDate?: string;
      recipientName?: string;
      recipientPhone?: string;
      address?: string;
      landmark?: string;
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items[] is required" }, { status: 400 });
    }

    // Load dishes to compute totals.
    const ids = body.items.map((i) => i.dishId);
    const dishes = await prisma.dish.findMany({ where: { id: { in: ids } } });

    const byId = new Map(dishes.map((m) => [m.id, m]));
    let totalKobo = 0;
    const itemsData = body.items.map((it) => {
      const dish = byId.get(it.dishId);
      if (!dish) throw new Error("NOT_FOUND");
      const quantity = Math.max(1, Math.floor(it.quantity || 1));
      const sides = Array.isArray(it.sides) ? it.sides : [];
      let unitKobo = dish.priceKobo;
      for (const id of sides) unitKobo += SIDE_PRICE.get(id) ?? 0;
      totalKobo += unitKobo * quantity;
      return {
        dishId: dish.id,
        quantity,
        unitKobo,
        spice: it.spice || null,
        sides: [...sides].sort().join(",") || null,
        note: it.note || null,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalKobo,
        pickupDate: body.pickupDate ? new Date(body.pickupDate) : undefined,
        recipientName: body.recipientName || null,
        recipientPhone: body.recipientPhone || null,
        address: body.address || null,
        landmark: body.landmark || null,
        items: { create: itemsData },
        transaction: {
          create: {
            reference: generateReference(),
            amountKobo: totalKobo,
            status: "PENDING",
          },
        },
      },
      include: { items: { include: { dish: true } }, transaction: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
