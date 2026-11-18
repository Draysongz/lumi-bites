"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Polls the order for status changes and re-renders the (server) tracking page.
 * Stops automatically once the order reaches a terminal state.
 */
export default function StatusPoller({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(t);
  }, [active, router]);

  return null;
}
