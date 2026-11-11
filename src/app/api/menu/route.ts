import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { toDayStart, lagosDayStart } from "@/lib/date";

type MenuItemInput = {
  name: string;
  description?: string;
  priceNaira: number;
  imageUrl?: string | null;
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
                // `to` is inclusive: use the start of the *next* day, exclusive.
                ...(to
                  ? {
                      lt: new Date(lagosDayStart(to).getTime() + 24 * 60 * 60 * 1000),
                    }
                  : {}),
              },
            }
          : {}),
      },
      orderBy: { date: "asc" },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json({ menus });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Create a menu for a date (admin). Upserts if the date already has a menu. */
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as {
      date: string;
      items: MenuItemInput[];
      active?: boolean;
    };

    if (!body.date || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "date and items[] are required" },
        { status: 400 },
      );
    }

    const date = toDayStart(body.date);

    const menu = await prisma.$transaction(async (tx) => {
      const existing = await tx.dayMenu.findUnique({ where: { date } });

      if (existing) {
        // Soft-remove: mark all current items unavailable (preserve order history),
        // then reconcile the incoming list — update by name or create.
        await tx.menuItem.updateMany({
          where: { dayMenuId: existing.id },
          data: { available: false },
        });

        for (const it of body.items) {
          const data = {
            name: it.name,
            description: it.description,
            priceKobo: Math.round(it.priceNaira * 100),
            imageUrl: it.imageUrl,
            available: it.available ?? true,
          };
          const match = await tx.menuItem.findFirst({
            where: { dayMenuId: existing.id, name: it.name },
          });
          if (match) {
            await tx.menuItem.update({ where: { id: match.id }, data });
          } else {
            await tx.menuItem.create({ data: { ...data, dayMenuId: existing.id } });
          }
        }

        return tx.dayMenu.update({
          where: { date },
          data: { active: body.active ?? true },
          include: { items: { orderBy: { createdAt: "asc" } } },
        });
      }

      return tx.dayMenu.create({
        data: {
          date,
          active: body.active ?? true,
          items: {
            create: body.items.map((it) => ({
              name: it.name,
              description: it.description,
              priceKobo: Math.round(it.priceNaira * 100),
              imageUrl: it.imageUrl,
              available: it.available ?? true,
            })),
          },
        },
        include: { items: { orderBy: { createdAt: "asc" } } },
      });
    });

    return NextResponse.json({ menu }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
