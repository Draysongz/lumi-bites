import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

/** POST /api/notifications/read — mark one (id) or all (no id) notifications read. */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json().catch(() => ({}))) as { id?: string };

    if (body.id) {
      // Ensure ownership before marking.
      const updated = await prisma.notification.updateMany({
        where: { id: body.id, userId: user.id, readAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ updated: updated.count });
    }

    const updated = await prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ updated: updated.count });
  } catch (err) {
    return handleApiError(err);
  }
}
