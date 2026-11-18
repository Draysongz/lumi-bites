import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TopBar, BottomNav, AppFooter } from "@/components/app/AppShell";
import AppPrompts from "@/components/pwa/AppPrompts";
import AppProviders from "@/components/app/AppProviders";

export const metadata: Metadata = {
  title: "Lumi's Bites — Today's Menu",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Auth guard: every customer /app/* route requires a signed-in user.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col pb-20 md:pb-0">
        <TopBar />
        <main className="flex-1 w-full">{children}</main>
        <AppFooter />
        <BottomNav />
        <AppPrompts />
      </div>
    </AppProviders>
  );
}

