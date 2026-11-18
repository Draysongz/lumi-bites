import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lagosTodayStart, lagosTodayEnd } from "@/lib/date";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Sidebar + light shell for the dashboard-scoped admin pages
 * (dashboard, menu controller, catering). The live kitchen orders console
 * lives outside this group and renders full-bleed.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const todayMenu = await prisma.dayMenu.findFirst({
    where: { date: { gte: lagosTodayStart(), lt: lagosTodayEnd() } },
    select: { active: true },
  });
  const menuActive = todayMenu?.active ?? false;

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <AdminSidebar name={user?.name ?? "Admin"} menuActive={menuActive} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
