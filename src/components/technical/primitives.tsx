import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TechnicalPanel({
  title, code, children, className, actions,
}: { title?: string; code?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn("technical-panel relative", className)}>
      {(title || code || actions) && (
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-baseline gap-3">
            {code && <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">{code}</span>}
            {title && <h3 className="text-sm font-medium tracking-tight">{title}</h3>}
          </div>
          {actions}
        </header>
      )}
      <div>{children}</div>
      <CornerBrackets />
    </section>
  );
}

export function CornerBrackets() {
  const base = "pointer-events-none absolute h-3 w-3 border-signal";
  return (
    <>
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </>
  );
}

export function DataReadout({
  label, value, unit, hint,
}: { label: string; value: ReactNode; unit?: string; hint?: string }) {
  return (
    <div className="border-l border-border pl-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl tabular-nums text-foreground">{value}</span>
        {unit && <span className="font-mono text-[10px] uppercase text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className="mt-1 font-mono text-[10px] text-signal-dim">{hint}</div>}
    </div>
  );
}

export function HoloLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
      {children}
    </span>
  );
}

export function Reticle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("text-signal", className)} fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="46" strokeOpacity="0.4" />
      <circle cx="50" cy="50" r="30" strokeOpacity="0.6" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      <line x1="0" y1="50" x2="20" y2="50" />
      <line x1="80" y1="50" x2="100" y2="50" />
      <line x1="50" y1="0" x2="50" y2="20" />
      <line x1="50" y1="80" x2="50" y2="100" />
    </svg>
  );
}

export function GridBackdrop({ className }: { className?: string }) {
  return <div className={cn("grid-backdrop absolute inset-0 opacity-30", className)} />;
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="h-px flex-1 bg-border" />
      {label && <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
