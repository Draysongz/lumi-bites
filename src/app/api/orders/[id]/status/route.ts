import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { sendPushToUser } from "@/lib/push";
import type { OrderStatus } from "@prisma/client";

const VALID: OrderStatus[] = [
  "PENDING",
  "PAID",
  "CONFIRMED",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_MESSAGES: Partial<Record<OrderStatus, { title: string; body: string }>> = {
  CONFIRMED: { title: "Order confirmed", body: "Chef Lumi is prepping your order 🔥" },
  READY: { title: "Order ready!", body: "Your food is ready for pickup/delivery." },
  COMPLETED: { title: "Order delivered", body: "Bon appétit — enjoy your Lumi's Bites!" },
  CANCELLED: { title: "Order cancelled", body: "Your order has been cancelled." },
};

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/orders/[id]/status — admin advances an order's status. */
export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await req.json()) as { status?: string };

    const status = body.status as OrderStatus;
    if (!body.status || !VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Load the order to get the owner + previous status.
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return handleApiError(new Error("NOT_FOUND"));

    const message = STATUS_MESSAGES[status];

    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: true, transaction: true },
      });

      if (message && status !== existing.status) {
        await tx.notification.create({
          data: {
            userId: existing.userId,
            type: "ORDER",
            title: message.title,
            body: message.body,
            link: `/app/orders/${id}`,
          },
        });
      }

      return updated;
    });

    // Fire-and-forget push to the order owner's devices.
    if (message) {
      sendPushToUser(existing.userId, {
        title: message.title,
        body: message.body,
        url: `/app/orders/${id}`,
      }).catch(() => {});
    }

    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}

