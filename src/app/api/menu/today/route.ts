import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";

/** Today's active menu with items. Public. */
export async function GET() {
  try {
    const menu = await prisma.dayMenu.findFirst({
      where: {
        date: { gte: lagosTodayStart(), lt: lagosTodayEnd() },
        active: true,
      },
      include: {
        items: { where: { available: true }, orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ menu });
  } catch (err) {
    return handleApiError(err);
  }
}
