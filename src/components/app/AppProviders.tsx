"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
