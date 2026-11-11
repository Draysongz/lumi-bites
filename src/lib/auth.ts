import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AuthedUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "CUSTOMER" | "ADMIN";
};

/** Return the signed-in user from the JWT session, or null. */
export async function getCurrentUser(): Promise<AuthedUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    role: session.user.role ?? "CUSTOMER",
  };
}

/** Throw if unauthenticated; return the user. For customer+ routes. */
export async function requireUser(): Promise<AuthedUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/** Throw unless the user is an ADMIN. */
export async function requireAdmin(): Promise<AuthedUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

/** Ensure a Customer record exists for a user (used before virtual-account/order ops). */
export async function ensureCustomer(userId: string) {
  const existing = await prisma.customer.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.customer.create({ data: { userId } });
}
