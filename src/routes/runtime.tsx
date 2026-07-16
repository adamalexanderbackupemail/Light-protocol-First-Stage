import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { subscribeRuntime, type RuntimeSnapshot } from "@/lib/scanner/runtime";
import { Scanner } from "@/lib/scanner/Scanner";
import { drawPulse, drawHarmonic } from "@/lib/scanner/math";
import { TechnicalPanel, DataReadout, HoloLabel, Divider } from "@/components/technical/primitives";

export const Route = createFileRoute("/runtime")({
  head: () => ({ meta: [{ title: "Runtime Diagnostics · LIGHT Protocol" }] }),
  component: RuntimePage,
});

function RuntimePage() {
  const [snap, setSnap] = useState<RuntimeSnapshot | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  useEffect(() => subscribeRuntime((s) => {
    setSnap(s);
    setHistory((h) => [...h.slice(-59), s.fps]);
  }), []);

  if (!snap) return null;

  const density = Math.min(100, snap.scanners * 12 + snap.fps * 0.4);
  const readability = Math.round(100 - Math.min(80, snap.frameMs * 2));

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header>
        <HoloLabel>Module · RUN-11</HoloLabel>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Runtime Diagnostics</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">Live telemetry from the LIGHT runtime. Every measurement is real — sampled from the running browser process.</p>
      </header>

      <Divider label="Live Sample" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <TechnicalPanel><div className="p-4"><DataReadout label="FPS" value={snap.fps} unit="hz" /></div></TechnicalPanel>
        <TechnicalPanel><div className="p-4"><DataReadout label="Frame" value={snap.frameMs} unit="ms" /></div></TechnicalPanel>
        <TechnicalPanel><div className="p-4"><DataReadout label="Scanners" value={snap.scanners} unit="active" /></div></TechnicalPanel>
        <TechnicalPanel><div className="p-4"><DataReadout label="Memory" value={snap.memoryMB ?? "—"} unit={snap.memoryMB ? "MB" : ""} /></div></TechnicalPanel>
        <TechnicalPanel><div className="p-4"><DataReadout label="Uptime" value={snap.uptimeSec} unit="s" /></div></TechnicalPanel>
        <TechnicalPanel><div className="p-4"><DataReadout label="Modules" value={12} /></div></TechnicalPanel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TechnicalPanel code="RUN·FPS" title="Frame Rate History">
          <div className="p-4">
            <svg viewBox="0 0 300 100" className="h-40 w-full">
              <polyline
                fill="none" stroke="var(--signal)" strokeWidth="1.2"
                points={history.map((v, i) => `${(i / 59) * 300},${100 - Math.min(100, v * 1.5)}`).join(" ")}
              />
              <line x1="0" y1={100 - 60 * 1.5} x2="300" y2={100 - 60 * 1.5} stroke="var(--grid-line)" strokeDasharray="2 3" />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>60s window</span><span className="text-signal">60hz target</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel code="RUN·PLS" title="Signal Pulse">
          <Scanner draw={(c, t) => drawPulse(c, t, { amplitude: 1, frequency: 1.2, harmonics: 3, intensity: 1 })} className="h-48 w-full" />
        </TechnicalPanel>

        <TechnicalPanel code="RUN·DEN" title="Information Density">
          <div className="p-6">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-4xl tabular-nums text-signal">{density.toFixed(0)}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4 h-2 w-full rounded bg-plate-raised">
              <div className="h-2 rounded bg-signal" style={{ width: `${density}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Derived from live scanner count and frame rate.</p>
          </div>
        </TechnicalPanel>

        <TechnicalPanel code="RUN·RDB" title="Human Readability">
          <div className="p-6">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-4xl tabular-nums text-signal">{readability}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4 h-2 w-full rounded bg-plate-raised">
              <div className="h-2 rounded bg-signal" style={{ width: `${readability}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Inverse of average frame time. Higher is better.</p>
          </div>
        </TechnicalPanel>

        <TechnicalPanel code="RUN·HRM" title="Compression Harmonic" className="lg:col-span-2">
          <Scanner draw={(c, t) => drawHarmonic(c, t, { bars: 36, tempo: 1.1, load: 0.7 })} className="h-40 w-full" />
        </TechnicalPanel>
      </div>
    </main>
  );
}
