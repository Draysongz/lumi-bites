import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

/** POST /api/catering — submit a catering inquiry/booking. */
export async function POST(req: Request) {
  try {
    // Allow anonymous inquiries, but attach the user if signed in.
    const session = await requireUser().catch(() => null);

    const body = (await req.json()) as {
      eventDate: string;
      eventType: string;
      guestCount: number;
      name?: string;
      phone?: string;
      notes?: string;
    };

    if (!body.eventDate || !body.eventType || !body.guestCount) {
      return NextResponse.json(
        { error: "eventDate, eventType, and guestCount are required" },
        { status: 400 },
      );
    }

    const eventDate = new Date(body.eventDate);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: "Invalid eventDate" }, { status: 400 });
    }

    // Catering inquiries must be tied to a user record — require sign-in for now.
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to submit a catering request" },
        { status: 401 },
      );
    }

    const booking = await prisma.cateringBooking.create({
      data: {
        userId: session.id,
        eventDate,
        eventType: body.eventType,
        guestCount: Math.max(1, Math.floor(body.guestCount)),
        notes: body.notes,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

/** GET /api/catering — list my bookings (customer) or ?all=1 (admin). */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "1";
    const user = all ? await requireAdmin() : await requireUser();

    const bookings = await prisma.cateringBooking.findMany({
      where: all ? {} : { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: all
        ? { user: { select: { id: true, name: true, email: true, phone: true } } }
        : undefined,
    });

    return NextResponse.json({ bookings });
  } catch (err) {
    return handleApiError(err);
  }
}
