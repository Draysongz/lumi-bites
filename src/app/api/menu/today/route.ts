import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";

/** Today's active menu with its live dishes (DayDish joined to Dish). Public. */
export async function GET() {
  try {
    const menu = await prisma.dayMenu.findFirst({
      where: {
        date: { gte: lagosTodayStart(), lt: lagosTodayEnd() },
        active: true,
      },
      include: {
        dayDishes: {
          where: { available: true },
          orderBy: { createdAt: "asc" },
          include: { dish: true },
        },
      },
    });

    if (!menu) return NextResponse.json({ menu: null, dishes: [] });

    // Flatten to a customer-friendly shape: dish fields + per-day stock.
    const dishes = menu.dayDishes.map((dd) => ({
      id: dd.dish.id,
      name: dd.dish.name,
      description: dd.dish.description,
      priceKobo: dd.dish.priceKobo,
      imageUrl: dd.dish.imageUrl,
      rating: dd.dish.rating,
      category: dd.dish.category,
      prepTime: dd.dish.prepTime,
      spice: dd.dish.spice,
      portionsLeft: dd.portionsLeft,
    }));

    return NextResponse.json({ menu, dishes });
  } catch (err) {
    return handleApiError(err);
  }
}
