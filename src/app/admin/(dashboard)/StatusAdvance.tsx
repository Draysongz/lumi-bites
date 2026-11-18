"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const NEXT: Record<string, { status: string; label: string }> = {
  PENDING: { status: "PAID", label: "Mark Paid" },
  PAID: { status: "CONFIRMED", label: "Start Cooking" },
  CONFIRMED: { status: "READY", label: "Mark Packed" },
  READY: { status: "COMPLETED", label: "Mark Delivered" },
};

export default function StatusAdvance({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const next = NEXT[status];

  if (!next) {
    // Terminal state — no further action.
    return <span className="text-xs text-light-outline">—</span>;
  }

  function advance() {
    startTransition(async () => {
      setError(null);
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next.status }),
      });
      if (!res.ok) {
        const e = (await res.json().catch(() => null)) as { error?: string };
        setError(e?.error ?? "Failed to update status");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={advance}
        disabled={pending}
        className="px-3 py-1.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-label text-label-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "…" : next.label}
      </button>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
