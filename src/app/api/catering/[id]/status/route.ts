import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import type { BookingStatus } from "@prisma/client";

const VALID: BookingStatus[] = [
  "INQUIRY",
  "QUOTED",
  "DEPOSIT_PAID",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/catering/[id]/status — admin updates a booking (status, quote, deposit). */
export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await req.json()) as {
      status?: string;
      quoteNaira?: number;
      depositNaira?: number;
    };

    const data: {
      status?: BookingStatus;
      quoteKobo?: number;
      depositKobo?: number;
    } = {};

    if (body.status) {
      if (!VALID.includes(body.status as BookingStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = body.status as BookingStatus;
    }
    if (body.quoteNaira != null) data.quoteKobo = Math.round(body.quoteNaira * 100);
    if (body.depositNaira != null) {
      data.depositKobo = Math.round(body.depositNaira * 100);
    }

    const booking = await prisma.cateringBooking.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}
