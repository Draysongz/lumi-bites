"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Notif = {
  id: string;
  type: "ORDER" | "PAYMENT" | "CATERING" | "SYSTEM";
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

const TYPE_STYLE: Record<Notif["type"], { icon: string; iconClass: string; metaClass: string }> = {
  ORDER: { icon: "skillet", iconClass: "bg-brand-red text-white", metaClass: "text-brand-red" },
  PAYMENT: {
    icon: "account_balance_wallet",
    iconClass: "bg-amber-500 text-white",
    metaClass: "text-amber-700",
  },
  CATERING: {
    icon: "groups",
    iconClass: "bg-emerald-100 text-emerald-800",
    metaClass: "text-emerald-700",
  },
  SYSTEM: {
    icon: "campaign",
    iconClass: "bg-light-surface-container text-amber-600",
    metaClass: "text-amber-700",
  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = (await res.json()) as { notifications: Notif[]; unreadCount: number };
        setNotifs(data.notifications);
        setUnread(data.unreadCount);
      }
    } catch {
      // ignore; keep last-known notifications
    }
  }, []);

  // Load on open + poll while open.
  useEffect(() => {
    if (!open) return;
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [open, load]);

  // Close on outside click / escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifs((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    setUnread(0);
  }

  return (
    <div className="relative" ref={ref}>
      {/* Toggle button */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-light-surface-container flex items-center justify-center text-light-on-surface hover:bg-light-surface-container-high transition-state-change relative"
      >
        <span className="material-symbols-outlined text-xl">notifications</span>
        {unread > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-yellow ring-2 ring-light-surface" />
        )}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-[400px] bg-light-surface rounded-3xl border border-light-outline-variant/60 shadow-2xl overflow-hidden">
          {/* Caret */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-light-surface border-t border-l border-light-outline-variant/60 rotate-45" />

          {/* Header */}
          <div className="p-4 bg-light-surface border-b border-light-outline-variant/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-headline-sm text-light-on-surface font-bold">
                Notifications
              </h3>
              {unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-red text-white text-xs font-label font-bold">
                  {unread} New
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-label-sm font-label text-brand-red font-bold hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          {notifs.length === 0 ? (
            <div className="p-6 text-center text-body-sm text-light-outline space-y-2">
              <span className="material-symbols-outlined text-3xl text-light-outline-variant">
                notifications_off
              </span>
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-light-outline-variant/40 max-h-[420px] overflow-y-auto">
              {notifs.map((n) => {
                const isUnread = !n.readAt;
                const style = TYPE_STYLE[n.type] ?? TYPE_STYLE.SYSTEM;
                const inner = (
                  <>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${style.iconClass}`}
                    >
                      <span className="material-symbols-outlined text-xl">{style.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-headline text-body-md font-bold text-light-on-surface truncate">
                          {n.title}
                        </h4>
                        {isUnread ? (
                          <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                        ) : (
                          <span className="text-xs text-light-outline shrink-0">
                            {timeAgo(n.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm text-light-outline line-clamp-2">{n.body}</p>
                      {n.link && (
                        <span className={`text-xs font-label font-bold block pt-0.5 ${style.metaClass}`}>
                          View →
                        </span>
                      )}
                    </div>
                  </>
                );
                const baseClass = `p-4 flex gap-3.5 transition-colors block cursor-pointer ${
                  isUnread
                    ? "bg-light-primary-container/20 hover:bg-light-primary-container/30"
                    : "hover:bg-light-surface-container-low"
                }`;
                return n.link ? (
                  <Link key={n.id} href={n.link} className={baseClass} onClick={() => setOpen(false)}>
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id} className={baseClass}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
