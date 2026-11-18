"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";

type PayInfo = {
  orderId: string;
  reference: string;
  accountNumber: string;
  bankName: string;
  amountKobo: number;
};

const POLL_MS = 4000;

export default function PayModal({ pay, onClose }: { pay: PayInfo; onClose: () => void }) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(30 * 60);
  const [stillWaiting, setStillWaiting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Authoritative check: ask the server to verify with Flutterwave.
  async function checkPaid() {
    try {
      const res = await fetch(`/api/orders/${pay.orderId}/verify`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as { paid: boolean };
        if (data.paid) setConfirmed(true);
      }
    } catch {
      // transient — keep polling
    }
  }

  // Poll Flutterwave for confirmation while open + unpaid.
  useEffect(() => {
    if (confirmed) return;
    checkPaid();
    const t = setInterval(checkPaid, POLL_MS);
    pollRef.current = t;
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed, pay.orderId]);

  // Auto-advance to tracking shortly after confirmation.
  useEffect(() => {
    if (!confirmed) return;
    const t = setTimeout(() => router.push(`/app/orders/${pay.orderId}`), 1200);
    return () => clearTimeout(t);
  }, [confirmed, pay.orderId, router]);

  // 30-minute countdown (UI only; Flutterwave dynamic accounts are short-lived).
  useEffect(() => {
    if (confirmed) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [confirmed]);

  function copyAccount() {
    const raw = pay.accountNumber.replace(/\s/g, "");
    navigator.clipboard?.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");
  const spacedAccount = pay.accountNumber.replace(/(.{3})(?=.)/g, "$1 ");

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[460px] max-h-[90vh] rounded-3xl border border-light-outline-variant shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-brand-dark text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-xl">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-base text-white tracking-tight leading-none">
                  LUMI&apos;S PAY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Auto-Verify
                </span>
              </div>
              <span className="text-[11px] text-stone-400">Order Reference: {pay.reference}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Amount */}
          <div className="text-center space-y-1 py-1">
            <span className="font-label uppercase font-bold text-light-outline tracking-wider block text-xs">
              Amount to Pay
            </span>
            <div className="font-display text-4xl font-black text-brand-dark mt-1">
              {formatNaira(pay.amountKobo)}
            </div>
            <p className="text-xs text-stone-600">
              Transfer exact amount to ensure instant kitchen confirmation
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ animation: "spin 4s linear infinite" }}
                >
                  timelapse
                </span>
              </div>
              <div>
                <span className="text-[11px] font-label font-bold text-amber-900 uppercase block">
                  Account Expires In
                </span>
                <span className="text-xs text-amber-950 font-medium">
                  Virtual account allocated for this batch
                </span>
              </div>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300/80 shadow-xs">
              <span className="font-mono text-base font-black text-amber-700">
                {countdown > 0 ? `${mm}:${ss}` : "EXPIRED"}
              </span>
            </div>
          </div>

          {/* Bank account details */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-light-outline-variant/70 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-light-outline-variant/40">
              <span className="font-label text-light-outline">Destination Bank</span>
              <span className="font-headline font-bold text-brand-dark text-sm">
                {pay.bankName}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-label font-bold text-light-outline uppercase tracking-wider">
                  Dynamic Account Number
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  Dedicated to this order
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border-2 border-brand-red/30 shadow-xs hover:border-brand-red transition-all">
                <span className="font-mono text-xl sm:text-2xl font-black text-brand-dark tracking-wider break-all">
                  {spacedAccount}
                </span>
                <button
                  onClick={copyAccount}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-label text-xs font-bold transition-all shadow-xs active:scale-95 ${
                    copied ? "bg-emerald-600" : "bg-brand-red hover:bg-red-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? "check" : "content_copy"}
                  </span>
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-label text-light-outline">Beneficiary Name</span>
              <span className="font-headline font-bold text-brand-dark text-sm">Lumi&apos;s Bites</span>
            </div>
          </div>

          {/* Auto-verify status */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
            <div className="relative flex items-center justify-center w-7 h-7">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-emerald-600 relative" />
            </div>
            <div className="text-xs text-emerald-950 font-medium">
              <strong>Listening for bank transfer...</strong> Auto-confirms once your transfer lands.
            </div>
          </div>

          {stillWaiting && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
              Still waiting for your bank to settle. This usually takes under a minute — we&apos;ll confirm automatically.
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={async () => {
                await checkPaid();
                setStillWaiting(true);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-red hover:bg-red-700 active:scale-98 text-white font-label text-label-md font-bold shadow-md shadow-brand-red/25 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <span>I Have Made This Transfer</span>
            </button>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl border border-light-outline-variant hover:bg-stone-50 text-stone-700 font-label text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-emerald-600">chat</span>
              <span>Need help or experiencing a bank network delay?</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-light-outline-variant/60 flex items-center justify-between text-[11px] text-light-outline">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-stone-400">lock</span>
            <span>Secure 256-bit automated reconciliation</span>
          </div>
          <span className="font-bold text-brand-dark">Lumi&apos;s Bites Lagos</span>
        </div>
      </div>

      {/* Success overlay */}
      {confirmed && (
        <div className="fixed inset-0 z-[60] bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-light-outline-variant">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl font-black">check</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-label uppercase font-bold text-emerald-700 tracking-wider">
                Payment Verified!
              </span>
              <h3 className="font-display text-2xl font-black text-brand-dark">
                {formatNaira(pay.amountKobo)} Received
              </h3>
              <p className="text-xs text-light-outline">
                Your order is now with Chef Lumi. Taking you to live tracking…
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
