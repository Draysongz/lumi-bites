import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

/** GET /api/orders/[id] — a single order (owner or admin sees status). */
export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } }, transaction: true },
    });

    if (!order) return handleApiError(new Error("NOT_FOUND"));
    if (order.userId !== user.id && user.role !== "ADMIN") {
      return handleApiError(new Error("FORBIDDEN"));
    }

    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
