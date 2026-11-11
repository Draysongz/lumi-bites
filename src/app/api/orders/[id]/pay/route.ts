import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { createDynamicAccount } from "@/lib/flutterwave";
import { generateReference } from "@/lib/reference";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/orders/[id]/pay — create a dynamic (per-transaction) virtual account
 * for this order and return the bank-transfer instructions to the customer.
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
    if (order.userId !== user.id) return handleApiError(new Error("FORBIDDEN"));
    if (order.status === "PAID" || order.status === "COMPLETED") {
      return NextResponse.json({ error: "Order already paid" }, { status: 409 });
    }

    // Reuse the existing transaction's reference (created at order time) for idempotency.
    const reference = order.transaction?.reference ?? generateReference();

    // If we already minted a dynamic account for this transaction, return it.
    if (order.transaction?.accountNumber) {
      return NextResponse.json({
        accountNumber: order.transaction.accountNumber,
        amountNaira: Math.round(order.totalKobo / 100),
        reference,
      });
    }

    const email = user.email ?? `${user.id}@lumis.bites`;
    const amountNaira = Math.round(order.totalKobo / 100);

    const account = await createDynamicAccount({ email, txRef: reference, amountNaira });

    await prisma.transaction.upsert({
      where: { orderId: order.id },
      update: { accountNumber: account.account_number, reference },
      create: {
        orderId: order.id,
        reference,
        amountKobo: order.totalKobo,
        status: "PENDING",
        accountNumber: account.account_number,
      },
    });

    return NextResponse.json({
      accountNumber: account.account_number,
      bankName: account.bank_name,
      amountNaira,
      reference,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
