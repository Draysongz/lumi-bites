import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Lumi's Bites — Kitchen Admin",
};

/**
 * Guard-only admin layout. Applies the requireAdmin guard to ALL /admin/* routes,
 * but renders no chrome — pages opt into the sidebar (via (dashboard)/layout) or
 * render full-bleed (e.g. the live kitchen orders console).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/app");

  return <>{children}</>;
}
