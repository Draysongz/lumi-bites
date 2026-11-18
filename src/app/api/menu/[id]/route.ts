import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/menu/[id] — update a dish (admin).
 * Catalog fields (name/description/priceKobo/category/prepTime/spice/imageUrl) go to Dish.
 * Per-day fields (portionsLeft/available) go to today's DayDish (auto-creating
 * today's DayMenu + DayDish if they don't exist yet).
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = (await req.json()) as {
      name?: string;
      description?: string | null;
      priceKobo?: number;
      imageUrl?: string | null;
      category?: string | null;
      prepTime?: string | null;
      spice?: string | null;
      portionsLeft?: number | null;
      available?: boolean;
    };

    // 1. Catalog fields on Dish.
    const dishData: Record<string, unknown> = {};
    if (body.name !== undefined) dishData.name = body.name;
    if (body.description !== undefined) dishData.description = body.description;
    if (typeof body.priceKobo === "number") dishData.priceKobo = Math.max(0, Math.round(body.priceKobo));
    if (body.imageUrl !== undefined) dishData.imageUrl = body.imageUrl;
    if (body.category !== undefined) dishData.category = body.category;
    if (body.prepTime !== undefined) dishData.prepTime = body.prepTime;
    if (body.spice !== undefined) dishData.spice = body.spice;

    if (Object.keys(dishData).length > 0) {
      await prisma.dish.update({ where: { id }, data: dishData });
    }

    // 2. Per-day fields on today's DayDish.
    const wantsStock = "portionsLeft" in body || typeof body.available === "boolean";
    if (wantsStock) {
      // Ensure today's DayMenu exists (auto-create).
      let dayMenu = await prisma.dayMenu.findFirst({
        where: { date: { gte: lagosTodayStart(), lt: lagosTodayEnd() } },
      });
      if (!dayMenu) {
        dayMenu = await prisma.dayMenu.create({
          data: { date: lagosTodayStart(), active: true },
        });
      }

      const stockData: Record<string, unknown> = {};
      if ("portionsLeft" in body) stockData.portionsLeft = body.portionsLeft ?? null;
      if (typeof body.available === "boolean") stockData.available = body.available;

      await prisma.dayDish.upsert({
        where: { dayMenuId_dishId: { dayMenuId: dayMenu.id, dishId: id } },
        create: { dayMenuId: dayMenu.id, dishId: id, ...stockData },
        update: stockData,
      });
    }

    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        dayDishes: { where: { available: true }, orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ item: dish });
  } catch (err) {
    return handleApiError(err);
  }
}
