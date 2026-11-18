import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { toDayStart, lagosDayStart, lagosTodayStart, lagosTodayEnd } from "@/lib/date";

type PublishedDish = {
  dishId?: string; // publish an existing dish
  name?: string; // OR create a new dish with these fields
  description?: string | null;
  priceNaira?: number;
  imageUrl?: string | null;
  category?: string | null;
  prepTime?: string | null;
  spice?: string | null;
  portionsLeft?: number | null;
  available?: boolean;
};

/** List menus (admin). Optional ?from / ?to date range. */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const menus = await prisma.dayMenu.findMany({
      where: {
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: lagosDayStart(from) } : {}),
                ...(to
                  ? { lt: new Date(lagosDayStart(to).getTime() + 24 * 60 * 60 * 1000) }
                  : {}),
              },
            }
          : {}),
      },
      orderBy: { date: "asc" },
      include: {
        dayDishes: { orderBy: { createdAt: "asc" }, include: { dish: true } },
      },
    });

    return NextResponse.json({ menus });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/menu — publish dishes to a day's menu (admin).
 * Each entry either references an existing dishId, or creates a new Dish.
 * Upserts the DayMenu, and upserts DayDish rows (per-day portions/available).
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as {
      date: string;
      dishes: PublishedDish[];
      active?: boolean;
      dailyNote?: string;
    };

    if (!body.date || !Array.isArray(body.dishes) || body.dishes.length === 0) {
      return NextResponse.json(
        { error: "date and dishes[] are required" },
        { status: 400 },
      );
    }

    const date = toDayStart(body.date);

    // Resolve each entry to a Dish id — create if no dishId was given.
    const dishIds: string[] = [];
    for (const d of body.dishes) {
      if (d.dishId) {
        dishIds.push(d.dishId);
        continue;
      }
      if (!d.name) {
        return NextResponse.json(
          { error: "each dish needs dishId or name" },
          { status: 400 },
        );
      }
      const created = await prisma.dish.create({
        data: {
          name: d.name,
          description: d.description ?? null,
          priceKobo: d.priceNaira != null ? Math.round(d.priceNaira * 100) : 0,
          imageUrl: d.imageUrl ?? null,
          category: d.category ?? null,
          prepTime: d.prepTime ?? null,
          spice: d.spice ?? null,
        },
      });
      dishIds.push(created.id);
    }

    const menu = await prisma.$transaction(async (tx) => {
      const existing = await tx.dayMenu.findUnique({ where: { date } });
      const dayMenu = existing
        ? await tx.dayMenu.update({
            where: { date },
            data: { active: body.active ?? true, dailyNote: body.dailyNote },
          })
        : await tx.dayMenu.create({
            data: {
              date,
              active: body.active ?? true,
              dailyNote: body.dailyNote,
            },
          });

      await Promise.all(
        body.dishes.map((d, i) => {
          const dishId = dishIds[i];
          const data = {
            portionsLeft: d.portionsLeft ?? null,
            available: d.available ?? true,
          };
          return tx.dayDish.upsert({
            where: {
              dayMenuId_dishId: { dayMenuId: dayMenu.id, dishId },
            },
            create: { dayMenuId: dayMenu.id, dishId, ...data },
            update: data,
          });
        }),
      );

      return tx.dayMenu.findUniqueOrThrow({
        where: { id: dayMenu.id },
        include: {
          dayDishes: { orderBy: { createdAt: "asc" }, include: { dish: true } },
        },
      });
    });

    return NextResponse.json({ menu }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PATCH /api/menu — toggle today's menu active (open/close kitchen intake).
 */
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { active?: boolean };
    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "active (boolean) is required" }, { status: 400 });
    }

    const menu = await prisma.dayMenu.findFirst({
      where: { date: { gte: lagosTodayStart(), lt: lagosTodayEnd() } },
    });
    if (!menu) return handleApiError(new Error("NOT_FOUND"));

    const updated = await prisma.dayMenu.update({
      where: { id: menu.id },
      data: { active: body.active },
      include: {
        dayDishes: { orderBy: { createdAt: "asc" }, include: { dish: true } },
      },
    });

    return NextResponse.json({ menu: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
