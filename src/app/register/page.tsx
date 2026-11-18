"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone.trim() || undefined,
          email,
          password,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string };
      if (!res.ok) {
        setError(data?.error || "Could not create account. Please try again.");
        setSubmitting(false);
        return;
      }

      // Auto sign-in with the just-created credentials.
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.error) {
        setError("Account created — please sign in.");
        setSubmitting(false);
        return;
      }
      router.push("/app");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-surface">
      {/* Desktop header (lg only) */}
      <header className="hidden lg:block bg-light-surface border-b border-light-outline-variant/50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-xs">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,15 C45,35 25,45 15,65 C10,75 18,90 35,90 C50,90 55,75 65,55 C72,40 85,30 70,15 Z" />
                <circle cx="80" cy="65" r="10" />
                <circle cx="20" cy="30" r="7" />
              </svg>
            </div>
            <div className="flex items-center">
              <span className="font-display font-extrabold text-2xl tracking-tight text-brand-red">
                LUMI&apos;S
              </span>
              <span className="font-display font-extrabold text-2xl tracking-wide text-brand-dark ml-1.5">
                BITES
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-body-sm">
            <span className="text-light-outline">Already a member?</span>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-light-surface-container hover:bg-light-surface-container-high text-brand-red font-label text-label-md font-bold transition-state-change"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile hero (below lg) */}
      <div className="lg:hidden relative bg-brand-dark text-white pt-8 pb-10 px-6 rounded-b-[36px] shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-food-doodle" />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-yellow/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="w-full flex items-center justify-between mb-2">
            <Link
              href="#"
              aria-label="Back to sign in"
              
            >
              {/* <span className="material-symbols-outlined text-xl">arrow_back</span> */}
            </Link>
            <span className="text-label-sm font-label text-amber-300 font-bold uppercase tracking-wider">
              Join The Foodies
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-xs">
              <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,15 C45,35 25,45 15,65 C10,75 18,90 35,90 C50,90 55,75 65,55 C72,40 85,30 70,15 Z" />
                <circle cx="80" cy="65" r="10" />
                <circle cx="20" cy="30" r="7" />
              </svg>
            </div>
            <div className="flex items-center text-2xl font-display font-black tracking-tight">
              <span className="text-brand-red">LUMI&apos;S</span>
              <span className="text-white ml-1">BITES</span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-extrabold text-white pt-1">
            Create Your Account
          </h1>
          <p className="text-body-sm text-stone-300 max-w-xs">
            Get instant access to daily fresh batch drops, easy re-ordering, and delivery tracking.
          </p>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-10 w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-12 rounded-3xl overflow-hidden border border-light-outline-variant/60 shadow-xl bg-light-surface">
          {/* Desktop left benefits panel (lg only) */}
          <div className="hidden lg:flex col-span-6 bg-brand-dark text-white p-12 flex-col justify-between relative overflow-hidden bg-food-doodle min-h-[640px]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-red/35 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-yellow/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 font-label text-label-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
                Join 1,200+ Lagos Foodies
              </div>

              <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight">
                Order Fresh, <br />
                Eat Authentic, <br />
                <span className="text-amber-400">Never Wait Again.</span>
              </h2>

              <p className="text-body-md text-stone-300 max-w-md leading-relaxed">
                Create an account in seconds to unlock faster one-tap checkout, saved delivery addresses across Lagos, and live kitchen dispatch notifications.
              </p>
            </div>

            <div className="relative z-10 space-y-3.5 my-6">
              {[
                "Instant notification when Chef Lumi opens daily orders",
                "Customizable spice level memory and favorite sides",
                "100% secure online payment with debit cards, USSD & OPay",
              ].map((line) => (
                <div key={line} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                    ✓
                  </div>
                  <span className="text-body-sm text-stone-200">{line}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-body-sm text-stone-400">
              <span>fast and yummy, good for your tummy</span>
              <span className="text-stone-300 font-bold">Lagos • Nigeria</span>
            </div>
          </div>

          {/* Right form column */}
          <div className="col-span-12 lg:col-span-6 p-6 lg:p-12 flex flex-col justify-center space-y-5">
            {/* Mobile intro */}
            <div className="lg:hidden">
              <h1 className="font-display text-2xl font-extrabold text-light-on-surface">
                Create Your Account
              </h1>
              <p className="text-body-md text-light-outline mt-1">
                Start ordering today&apos;s batch in under a minute.
              </p>
            </div>

            {/* Desktop intro */}
            <div className="hidden lg:block">
              <h1 className="font-display text-3xl font-extrabold text-light-on-surface">
                Create Your Account
              </h1>
              <p className="text-body-md text-light-outline mt-1">
                Start ordering today&apos;s batch in under a minute.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("Google sign-up isn't available yet — use email for now.")}
              className="w-full inline-flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-light-outline-variant bg-light-surface hover:bg-light-surface-container-low text-light-on-surface font-label text-label-md font-bold transition-state-change shadow-2xs"
            >
              <GoogleMark />
              <span>Sign up with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              {/* <div className="border-t border-light-outline-variant/60 w-full" /> */}
              <span className="bg-light-surface px-4 text-label-sm font-label text-light-outline uppercase">
                or with email &amp; phone
              </span>
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1">
                <span className="text-label-md font-label text-light-on-surface font-bold">
                  Full Name
                </span>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-light-outline text-xl pointer-events-none">
                    person
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amara Nnamdi"
                    required
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-body-md"
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <label className="flex flex-col gap-1">
                  <span className="text-label-md font-label text-light-on-surface font-bold">
                    Phone Number
                  </span>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-light-outline text-xl pointer-events-none">
                      phone
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0803 123 4567"
                      inputMode="tel"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-body-md"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-label-md font-label text-light-on-surface font-bold">
                    Email Address
                  </span>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-light-outline text-xl pointer-events-none">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amara@example.com"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-body-md"
                    />
                  </div>
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-label-md font-label text-light-on-surface font-bold">
                  Create Password
                </span>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-light-outline text-xl pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-light-outline-variant bg-light-surface text-light-on-surface placeholder:text-light-outline/70 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-body-md"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 text-light-outline hover:text-light-on-surface"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              <p className="text-body-sm text-light-outline leading-tight pt-1">
                By creating an account, you agree to Lumi&apos;s Bites{" "}
                <a href="#" className="text-brand-red font-bold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-brand-red font-bold hover:underline">
                  Privacy Policy
                </a>
                .
              </p>

              {error && <p className="text-body-sm text-error font-bold">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-red text-white font-label text-label-lg font-black hover:brightness-110 active:scale-98 transition-state-change shadow-md shadow-brand-red/25 text-base mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? "Creating account…" : "Create Account"}</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>

            <p className="text-center text-body-sm text-light-outline pt-1">
              Already registered?{" "}
              <Link href="/login" className="text-brand-red font-bold hover:underline ml-1">
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-outline-variant/40 py-6 lg:px-8 text-center text-body-sm text-light-outline">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="hidden sm:inline">
            © 2026 Lumi&apos;s Bites Online Restaurant. All rights reserved.
          </span>
          <span className="sm:hidden">Lumi&apos;s Bites • Lagos, Nigeria • Encrypted Checkout</span>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#" className="hover:text-light-on-surface">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-light-on-surface">
              Terms of Service
            </a>
            <a href="https://wa.me/" className="text-brand-red font-bold hover:underline">
              Kitchen Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
