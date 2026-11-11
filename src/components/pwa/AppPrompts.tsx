"use client";

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64url = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64url);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Renders:
 * 1. a "enable notifications" prompt when permission is still "default",
 * 2. an "install the app" prompt when the beforeinstallprompt fires.
 * Both are dismissible; dismissal is remembered in localStorage per site.
 */
export default function AppPrompts() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    // --- Notification prompt logic ---
    if (!("Notification" in window)) return;
    const dismissed = localStorage.getItem("lumis-notif-dismissed") === "1";
    if (Notification.permission === "default" && !dismissed) {
      setShowNotifications(true);
    }
  }, []);

  useEffect(() => {
    // --- Install prompt logic (beforeinstallprompt) ---
    function onInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
      const dismissed = localStorage.getItem("lumis-install-dismissed") === "1";
      if (!dismissed) setShowInstall(true);
    }
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, []);

  async function enableNotifications() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("Missing VAPID public key");

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const json = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        }),
      });
    } catch {
      /* non-fatal — user can retry */
    } finally {
      setShowNotifications(false);
    }
  }

  function dismissNotifications() {
    localStorage.setItem("lumis-notif-dismissed", "1");
    setShowNotifications(false);
  }

  async function installApp() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setShowInstall(false);
  }

  function dismissInstall() {
    localStorage.setItem("lumis-install-dismissed", "1");
    setShowInstall(false);
  }

  return (
    <>
      {showNotifications && (
        <PromptCard
          icon="notifications_active"
          title="Never miss your order"
          body="Get a push when your food is ready or out for delivery."
          ctaLabel="Enable Notifications"
          onCta={enableNotifications}
          onDismiss={dismissNotifications}
        />
      )}
      {showInstall && (
        <PromptCard
          icon="download"
          title="Install Lumi's Bites"
          body="Add the app to your home screen for the fastest ordering experience."
          ctaLabel="Install App"
          onCta={installApp}
          onDismiss={dismissInstall}
        />
      )}
    </>
  );
}
