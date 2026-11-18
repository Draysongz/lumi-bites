"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function IntakeToggle({ menuActive }: { menuActive: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(menuActive);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !active;
    setActive(next); // optimistic
    startTransition(async () => {
      try {
        await fetch("/api/menu", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: next }),
        });
        router.refresh();
      } catch {
        setActive(!next); // roll back on failure
      }
    });
  }

  return (
    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
      <div>
        <span className="text-[11px] font-label font-bold text-stone-400 uppercase block">
          Kitchen Intake
        </span>
        <span
          className={`text-xs font-bold ${active ? "text-emerald-400" : "text-amber-400"}`}
        >
          {active ? "Taking Orders" : "Intake Paused"}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label="Toggle kitchen intake"
        onClick={toggle}
        disabled={pending}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors disabled:opacity-60 ${
          active ? "bg-emerald-500" : "bg-stone-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            active ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
