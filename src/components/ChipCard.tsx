import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export interface ChipModule {
  path: string;
  code: string;
  title: string;
  desc: string;
  status: "online" | "idle" | "build" | "warn";
  progress: number; // 0..1
  accent: "mint" | "ice" | "cyan" | "emerald" | "amber" | "coral" | "violet";
  icon?: ReactNode;
}

const ACCENT: Record<ChipModule["accent"], string> = {
  mint: "var(--mint)",
  ice: "var(--ice)",
  cyan: "var(--cyan)",
  emerald: "var(--emerald)",
  amber: "var(--amber)",
  coral: "var(--coral)",
  violet: "var(--violet)",
};

const STATUS_LABEL: Record<ChipModule["status"], string> = {
  online: "Online",
  idle: "Idle",
  build: "Building",
  warn: "Attention",
};

export function ChipCard({ mod }: { mod: ChipModule }) {
  const c = ACCENT[mod.accent];
  const pct = Math.round(mod.progress * 100);
  const circumference = 2 * Math.PI * 26;
  const dash = circumference * mod.progress;

  return (
    <Link to={mod.path} className="group block">
      <article className="ceramic-card animate-chip-breathe relative overflow-hidden p-6 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-xl">
        <div className="flex items-start gap-5">
          {/* Chip */}
          <div className="relative shrink-0">
            <svg viewBox="0 0 72 72" className="h-16 w-16">
              <defs>
                <radialGradient id={`chip-${mod.code}`} cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="oklch(1 0 0)" />
                  <stop offset="55%" stopColor="oklch(0.96 0.005 240)" />
                  <stop offset="100%" stopColor="oklch(0.9 0.01 240)" />
                </radialGradient>
              </defs>
              <circle cx="36" cy="36" r="32" fill={`url(#chip-${mod.code})`} stroke="oklch(0.88 0.008 240)" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="oklch(0.92 0.006 240)" strokeWidth="0.5" />
              {/* activity ring */}
              <circle
                cx="36" cy="36" r="26"
                fill="none"
                stroke="oklch(0.94 0.006 240)"
                strokeWidth="3"
              />
              <circle
                cx="36" cy="36" r="26"
                fill="none"
                stroke={c}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.2,0.8,0.2,1)" }}
              />
              {/* pie */}
              <circle cx="36" cy="36" r="14" fill="oklch(1 0 0)" stroke="oklch(0.9 0.008 240)" />
              <path
                d={pieSlice(36, 36, 14, 0, mod.progress * 360)}
                fill={c}
                opacity={0.85}
              />
              <circle cx="36" cy="36" r="3" fill="oklch(0.99 0 0)" />
            </svg>
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
              style={{ background: c, boxShadow: `0 0 10px ${c}` }}
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{mod.code}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: c }}>
                {STATUS_LABEL[mod.status]}
              </span>
            </div>
            <h3 className="mt-2 truncate text-xl font-light tracking-tight text-foreground">
              {mod.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{mod.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[11px] tabular-nums text-foreground">{pct}%</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function pieSlice(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = ((startDeg - 90) * Math.PI) / 180;
  const e = ((endDeg - 90) * Math.PI) / 180;
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}
