import type { ReactNode } from "react";

export default function PromptCard({
  icon,
  title,
  body,
  ctaLabel,
  onCta,
  onDismiss,
}: {
  icon: string;
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:bottom-4 sm:w-96">
      <div className="rounded-2xl border border-light-outline-variant/60 bg-light-surface shadow-2xl shadow-black/20 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-headline-sm text-light-on-surface leading-tight">
              {title}
            </p>
            <p className="text-body-sm text-light-outline mt-0.5">{body}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="w-7 h-7 rounded-full text-light-outline hover:bg-light-surface-container hover:text-light-on-surface flex items-center justify-center shrink-0 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onCta}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red text-white font-label text-label-lg font-bold hover:brightness-110 active:scale-98 transition-state-change"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
