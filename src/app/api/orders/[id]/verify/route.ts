import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { verifyTransaction } from "@/lib/flutterwave";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/orders/[id]/verify — actively check Flutterwave whether this order's
 * transfer has landed, and settle locally if so (webhook fallback).
 * Returns { paid: boolean }.
 */
export async function POST(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { transaction: true },
    });
    if (!order) return handleApiError(new Error("NOT_FOUND"));
    if (order.userId !== user.id && user.role !== "ADMIN") {
      return handleApiError(new Error("FORBIDDEN"));
    }

    // Already settled — short-circuit.
    if (order.transaction?.status === "SUCCESS" || order.status === "PAID") {
      return NextResponse.json({ paid: true });
    }

    const reference = order.transaction?.reference;
    if (!reference) {
      return NextResponse.json({ paid: false });
    }

    // Ask Flutterwave (pull-based, webhook-independent).
    const status = await verifyTransaction(reference);

    if (status?.status === "successful") {
      // Settle exactly like the webhook does.
      await prisma.$transaction([
        prisma.transaction.update({
          where: { reference },
          data: {
            status: "SUCCESS",
            channel: status.payment_type,
            paidAt: new Date(),
          },
        }),
        prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
      ]);
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false });
  } catch (err) {
    return handleApiError(err);
  }
}
