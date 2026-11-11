import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { SIDE_OPTIONS } from "@/lib/menu-options";

const SIDE_PRICE = new Map(SIDE_OPTIONS.map((s) => [s.id, s.priceKobo]));

/** Compute unit price (kobo) = base dish + selected sides. */
function unitKoboFor(baseKobo: number, sideIds: string[]): number {
  let total = baseKobo;
  for (const id of sideIds) total += SIDE_PRICE.get(id) ?? 0;
  return total;
}

const itemInclude = { menuItem: true } as const;

/** GET /api/cart — the signed-in customer's cart with line items. */
export async function GET() {
  try {
    const user = await requireUser();
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: itemInclude, orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ items: cart?.items ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

type AddBody = {
  menuItemId: string;
  quantity?: number;
  spice?: string;
  sides?: string[];
  note?: string;
};

/** POST /api/cart — add an item (or increment qty if same config already in cart). */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as AddBody;

    if (!body.menuItemId) {
      return NextResponse.json({ error: "menuItemId is required" }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.findUnique({ where: { id: body.menuItemId } });
    if (!menuItem) return handleApiError(new Error("NOT_FOUND"));
    if (!menuItem.available) throw new Error("MenuItem unavailable");

    const sides = Array.isArray(body.sides) ? body.sides : [];
    const spice = body.spice || null;
    const note = body.note || null;
    const quantity = Math.max(1, Math.floor(body.quantity || 1));
    const sidesKey = [...sides].sort().join(",") || null;

    // Upsert the cart, then find-or-increment a matching line item.
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId: menuItem.id,
        spice: spice,
        sides: sidesKey,
        note: note,
      },
    });

    const unitKobo = unitKoboFor(menuItem.priceKobo, sides);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity, unitKobo },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: menuItem.id,
          quantity,
          unitKobo,
          spice,
          sides: sidesKey,
          note,
        },
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: itemInclude, orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ items: updated?.items ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

type UpdateBody = {
  cartItemId: string;
  quantity?: number; // 0 = remove
};

/** PATCH /api/cart — update quantity (or remove when quantity is 0). */
export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as UpdateBody;

    if (!body.cartItemId) {
      return NextResponse.json({ error: "cartItemId is required" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) return handleApiError(new Error("NOT_FOUND"));

    const item = await prisma.cartItem.findFirst({
      where: { id: body.cartItemId, cartId: cart.id },
    });
    if (!item) return handleApiError(new Error("NOT_FOUND"));

    const quantity = typeof body.quantity === "number" ? Math.floor(body.quantity) : item.quantity;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: itemInclude, orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ items: updated?.items ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

/** DELETE /api/cart — clear the whole cart. */
export async function DELETE() {
  try {
    const user = await requireUser();
    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return NextResponse.json({ items: [] });
  } catch (err) {
    return handleApiError(err);
  }
}
