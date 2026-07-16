import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scanner } from "@/lib/scanner/Scanner";
import { drawOrbital, drawNeural, drawHarmonic, drawPulse } from "@/lib/scanner/math";
import { TechnicalPanel, HoloLabel, Divider } from "@/components/technical/primitives";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Scanner Engine · LIGHT Protocol" }] }),
  component: ScannerPage,
});

const MODES = [
  { code: "GAL", name: "Galactic",  desc: "Keplerian orbits, fleet routing.", draw: (c: CanvasRenderingContext2D, t: number) => drawOrbital(c, t, { bodies: 9, speed: 0.9, eccentricity: 0.4 }) },
  { code: "FLT", name: "Fleet",     desc: "Compact orbital deployment.",       draw: (c: CanvasRenderingContext2D, t: number) => drawOrbital(c, t, { bodies: 5, speed: 1.4, eccentricity: 0.2 }) },
  { code: "PLN", name: "Planetary", desc: "Surface pulse envelope.",           draw: (c: CanvasRenderingContext2D, t: number) => drawPulse(c, t, { amplitude: 0.7, frequency: 0.8, harmonics: 6, intensity: 0.9 }) },
  { code: "IND", name: "Industrial",desc: "Production harmonic.",              draw: (c: CanvasRenderingContext2D, t: number) => drawHarmonic(c, t, { bars: 28, tempo: 1.4, load: 0.85 }) },
  { code: "CKT", name: "Circuit",   desc: "Dense harmonic lattice.",           draw: (c: CanvasRenderingContext2D, t: number) => drawHarmonic(c, t, { bars: 64, tempo: 2.4, load: 0.7 }) },
  { code: "NRG", name: "Energy",    desc: "Amplified pulse signature.",        draw: (c: CanvasRenderingContext2D, t: number) => drawPulse(c, t, { amplitude: 1.2, frequency: 1.6, harmonics: 4, intensity: 1.2 }) },
  { code: "KNL", name: "Knowledge", desc: "Concept mesh.",                     draw: (c: CanvasRenderingContext2D, t: number) => drawNeural(c, t, { nodes: 44, density: 0.5 }) },
  { code: "AI",  name: "AI",        desc: "Dense cortex.",                     draw: (c: CanvasRenderingContext2D, t: number) => drawNeural(c, t, { nodes: 60, density: 0.75 }) },
  { code: "RUN", name: "Runtime",   desc: "Signal integrity waveform.",        draw: (c: CanvasRenderingContext2D, t: number) => drawPulse(c, t, { amplitude: 1, frequency: 2.4, harmonics: 3, intensity: 1 }) },
  { code: "HET", name: "Heat",      desc: "Thermal envelope.",                 draw: (c: CanvasRenderingContext2D, t: number) => drawPulse(c, t, { amplitude: 0.8, frequency: 0.4, harmonics: 8, intensity: 0.7 }) },
];

function ScannerPage() {
  const [mode, setMode] = useState(0);
  const m = MODES[mode];
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header>
        <HoloLabel>Module · SCN-03</HoloLabel>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Scanner Engine</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          The scanner is the graphics engine. Everything visible in LIGHT comes from scanner mathematics. Ten modes, four procedural math libraries, one runtime loop.
        </p>
      </header>
      <Divider label="Mode Registry" />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1">
          {MODES.map((mm, i) => (
            <button
              key={mm.code}
              onClick={() => setMode(i)}
              className={
                "flex items-baseline justify-between rounded border px-3 py-2 text-left transition-colors " +
                (i === mode ? "border-signal bg-signal/10 text-signal" : "border-border hover:border-signal/60")
              }
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.25em]">{mm.code}</span>
              <span className="text-sm">{mm.name}</span>
            </button>
          ))}
        </div>
        <TechnicalPanel code={`SCN·${m.code}`} title={m.name + " Scanner"}>
          <Scanner draw={m.draw} className="aspect-[16/9] w-full" label={`Live · ${m.name}`} />
          <div className="border-t border-border p-4 font-mono text-[11px] text-muted-foreground">{m.desc}</div>
        </TechnicalPanel>
      </div>
    </main>
  );
}
