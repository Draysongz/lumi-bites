import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/flutterwave";

type FlwEvent = {
  event: string; // e.g. "charge.completed"
  data: {
    tx_ref?: string;
    status?: string; // "successful"
    amount?: number;
    payment_type?: string;
    flw_ref?: string;
    created_at?: string;
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const verifHash = req.headers.get("verif-hash") ?? "";

  // Flutterwave verifies via a static secret hash header (compare to FLW_SECRET_HASH).
  if (!verifyWebhookSignature(raw, verifHash)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: FlwEvent;
  try {
    event = JSON.parse(raw) as FlwEvent;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Only settle successful charges.
  if (event.event !== "charge.completed" || event.data.status !== "successful") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.tx_ref;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  // Idempotent settlement: only transition PENDING → SUCCESS.
  const tx = await prisma.transaction.findUnique({ where: { reference } });
  if (!tx) {
    return NextResponse.json({ received: true });
  }

  if (tx.status === "PENDING") {
    await prisma.$transaction([
      prisma.transaction.update({
        where: { reference },
        data: {
          status: "SUCCESS",
          channel: event.data.payment_type,
          paidAt: event.data.created_at ? new Date(event.data.created_at) : new Date(),
          paystackEvent: raw,
        },
      }),
      prisma.order.update({
        where: { id: tx.orderId },
        data: { status: "PAID" },
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
