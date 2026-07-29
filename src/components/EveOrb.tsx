import { useEffect, useState } from "react";

/**
 * EVE — always-present assistant orb.
 * Small floating ceramic disc, gentle breathing, expands on click.
 */
export function EveOrb() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open E.V.E. assistant"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full ceramic-card animate-chip-breathe transition-transform hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
      >
        <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12">
          <defs>
            <radialGradient id="eve-core" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="oklch(0.95 0.05 200)" />
              <stop offset="60%" stopColor="oklch(0.7 0.13 210)" />
              <stop offset="100%" stopColor="oklch(0.5 0.12 220)" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="22" fill="url(#eve-core)" />
          <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.8 0.06 210)" strokeWidth="0.5" />
          <circle cx="26" cy="26" r="6" fill="oklch(1 0 0 / 0.35)" />
        </svg>
        <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          E.V.E.
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-foreground/10 p-4 backdrop-blur-sm sm:p-8">
          <div
            className="glass-panel w-full max-w-md animate-fade-slide p-6"
            role="dialog"
            aria-label="E.V.E. assistant"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--mint)] animate-signal-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">E.V.E. · online</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:bg-muted">
                Close
              </button>
            </div>
            <h2 className="mt-4 text-2xl font-light tracking-tight">How can I help?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ask about any module. Search blueprints, run simulations, or open a module.</p>
            <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-plate px-4 py-3">
              <input
                autoFocus
                placeholder="Ask E.V.E. …"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">↵</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Conversation", "Engineering", "Search", "Blueprints", "Simulation", "Learning"].map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
