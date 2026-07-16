import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const NODES = [
  { path: "/civilization", label: "CIV", full: "Civilization" },
  { path: "/fleet", label: "FLT", full: "Fleet" },
  { path: "/scanner", label: "SCN", full: "Scanner" },
  { path: "/industry", label: "IND", full: "Industry" },
  { path: "/research", label: "RES", full: "Research" },
  { path: "/fps", label: "FPS", full: "FPS" },
  { path: "/space", label: "SPC", full: "Space" },
  { path: "/species", label: "SPS", full: "Species" },
  { path: "/ai", label: "AI", full: "AI" },
  { path: "/engine", label: "ENG", full: "Engine" },
  { path: "/runtime", label: "RUN", full: "Runtime" },
  { path: "/developer", label: "DEV", full: "Developer" },
] as const;

export function RadialWheel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const R = 96;      // outer ring radius
  const rInner = 34;
  const N = NODES.length;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div
        className="pointer-events-auto relative transition-transform duration-500"
        style={{ width: R * 2 + 20, height: R * 2 + 20, transform: open ? "scale(1)" : "scale(0.72)" }}
      >
        <svg viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`} className="h-full w-full">
          {/* outer ring */}
          <circle r={R} className="text-border" stroke="currentColor" fill="none" />
          <circle r={R - 8} className="text-border/50" stroke="currentColor" fill="none" />
          <circle r={rInner} className="fill-plate stroke-border" />
          <g className="animate-wheel-slow" style={{ transformOrigin: "center" }}>
            {Array.from({ length: 48 }).map((_, i) => {
              const a = (i / 48) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * (R - 4)} y1={Math.sin(a) * (R - 4)}
                  x2={Math.cos(a) * (R - 1)} y2={Math.sin(a) * (R - 1)}
                  className="text-signal-dim" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.4 : 0.6}
                />
              );
            })}
          </g>

          {NODES.map((n, i) => {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            const r = open ? R - 22 : rInner + 8;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            const active = pathname === n.path;
            const isHover = hover === i;
            return (
              <g
                key={n.path}
                style={{ transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                transform={`translate(${x} ${y})`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => { void navigate({ to: n.path }); }}
                className="cursor-pointer"
              >
                <circle
                  r={13}
                  className={
                    (active ? "fill-signal " : isHover ? "fill-plate-raised " : "fill-plate ") +
                    "stroke-signal transition-all"
                  }
                  strokeWidth={active ? 1.5 : 0.8}
                  style={{ filter: (active || isHover) ? "drop-shadow(0 0 6px var(--signal))" : undefined }}
                />
                <text
                  textAnchor="middle" dominantBaseline="central"
                  className={"font-mono " + (active ? "fill-background" : "fill-foreground")}
                  style={{ fontSize: 8, letterSpacing: 1 }}
                >{n.label}</text>
              </g>
            );
          })}

          {/* center button */}
          <g onClick={() => setOpen(o => !o)} className="cursor-pointer pointer-events-auto">
            <circle r={rInner - 4} className="fill-plate-raised stroke-signal" strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="central" className="fill-signal font-mono" style={{ fontSize: 9, letterSpacing: 2 }}>
              LIGHT
            </text>
            <text textAnchor="middle" dominantBaseline="central" y={11} className="fill-muted-foreground font-mono" style={{ fontSize: 6, letterSpacing: 2 }}>
              {open ? "COLLAPSE" : "EXPAND"}
            </text>
          </g>
        </svg>

        {hover !== null && open && (
          <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-plate-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
            {NODES[hover].full}
          </div>
        )}
      </div>
    </div>
  );
}
