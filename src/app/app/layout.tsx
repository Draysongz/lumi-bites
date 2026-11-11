import type { Metadata } from "next";
import { TopBar, BottomNav, AppFooter } from "@/components/app/AppShell";
import AppPrompts from "@/components/pwa/AppPrompts";

export const metadata: Metadata = {
  title: "Lumi's Bites — Today's Menu",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <TopBar />
      <main className="flex-1 w-full">{children}</main>
      <AppFooter />
      <BottomNav />
      <AppPrompts />
    </div>
  );
}

