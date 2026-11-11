import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

type SubscribeBody = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

/** POST /api/push/subscribe — save the browser's PushSubscription for this user. */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as SubscribeBody;

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return NextResponse.json(
        { error: "endpoint and keys are required" },
        { status: 400 },
      );
    }

    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      update: { p256dh: body.keys.p256dh, auth: body.keys.auth, userId: user.id },
      create: {
        userId: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
    });

    return NextResponse.json({ subscribed: true, id: sub.id });
  } catch (err) {
    return handleApiError(err);
  }
}

/** DELETE /api/push/subscribe — remove a subscription (e.g. on logout). */
export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json().catch(() => ({}))) as { endpoint?: string };

    if (body.endpoint) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: body.endpoint, userId: user.id },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
