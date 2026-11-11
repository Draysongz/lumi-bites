import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

/** GET /api/admin/orders — all orders for the admin dashboard. */
export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { menuItem: true } },
        transaction: true,
      },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}
