import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Scanner } from "@/lib/scanner/Scanner";
import { drawOrbital, drawHarmonic, drawNeural, civStats } from "@/lib/scanner/math";
import { TechnicalPanel, DataReadout, HoloLabel, Divider } from "@/components/technical/primitives";

export const Route = createFileRoute("/civilization")({
  head: () => ({ meta: [{ title: "Civilization · LIGHT Protocol Genesis" }, { name: "description", content: "Generation-driven civilization simulator: population, ships, industry, research and AI evolve together." }] }),
  component: Civilization,
});

const TABS = ["Overview", "Diagram", "Animation", "Summary", "Technical", "Verification", "Runtime"] as const;
type Tab = typeof TABS[number];

const GENS = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];

function Civilization() {
  const [genIdx, setGenIdx] = useState(3);
  const [tab, setTab] = useState<Tab>("Overview");
  const generation = GENS[genIdx];
  const s = useMemo(() => civStats(generation), [generation]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <HoloLabel>Module · CIV-01</HoloLabel>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Civilization</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Every upgrade cascades. Ships, engines, humans, AI, research, industry, terraforming and knowledge evolve together as one process indexed by generation.
          </p>
        </div>
        <div className="rounded border border-border bg-plate-raised px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span className="text-muted-foreground">Generation</span>
          <div className="mt-1 text-2xl text-signal">{generation.toLocaleString()}</div>
        </div>
      </header>

      <Divider label="Generation Index" />

      <TechnicalPanel code="CIV·GEN" title="Evolution Slider">
        <div className="p-5">
          <input
            type="range" min={0} max={GENS.length - 1} value={genIdx}
            onChange={(e) => setGenIdx(Number(e.target.value))}
            className="w-full accent-signal"
          />
          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {GENS.map((g, i) => (
              <button key={g} onClick={() => setGenIdx(i)} className={i === genIdx ? "text-signal" : "hover:text-foreground"}>
                {g >= 1000 ? `${g / 1000}k` : g}
              </button>
            ))}
          </div>
        </div>
      </TechnicalPanel>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TechnicalPanel code="SCN·ORB" title="Orbital Solution">
          <Scanner
            draw={(c, t) => drawOrbital(c, t, {
              bodies: Math.min(12, 3 + Math.floor(Math.log10(generation) * 1.5)),
              speed: 0.6 + Math.log10(generation) * 0.15,
              eccentricity: 0.25 + (Math.log10(generation) % 1) * 0.2,
            })}
            className="aspect-[16/10] w-full"
            label={`Live · ${s.colonies} colonies`}
          />
        </TechnicalPanel>

        <TechnicalPanel code="CIV·IDX" title="Cascade Readout">
          <div className="grid grid-cols-2 gap-5 p-5">
            <DataReadout label="Population" value={s.population.toLocaleString()} unit="entities" />
            <DataReadout label="Ships" value={s.ships.toLocaleString()} unit="hulls" />
            <DataReadout label="Research" value={s.research} unit="idx" />
            <DataReadout label="Industry" value={s.industry} unit="idx" />
            <DataReadout label="AI Tier" value={`T${s.aiTier}`} hint={s.aiTier >= 6 ? "post-runtime" : "operational"} />
            <DataReadout label="Compression" value={`${s.compression}%`} unit="knowledge" />
            <DataReadout label="Colonies" value={s.colonies} />
            <DataReadout label="Knowledge" value={s.knowledge.toLocaleString()} unit="nodes" />
          </div>
        </TechnicalPanel>

        <TechnicalPanel code="SCN·HRM" title="Industrial Harmonic">
          <Scanner
            draw={(c, t) => drawHarmonic(c, t, {
              bars: 24,
              tempo: 0.8 + Math.log10(generation) * 0.2,
              load: Math.min(1, 0.3 + Math.log10(generation) * 0.12),
            })}
            className="h-56 w-full"
            label="Live · Manufacturing"
          />
        </TechnicalPanel>
        <TechnicalPanel code="SCN·NRL" title="Neural Runtime">
          <Scanner
            draw={(c, t) => drawNeural(c, t, {
              nodes: Math.min(48, 12 + Math.floor(Math.log10(generation) * 5)),
              density: Math.min(1, 0.3 + Math.log10(generation) * 0.1),
            })}
            className="h-56 w-full"
            label={`Live · Tier ${s.aiTier}`}
          />
        </TechnicalPanel>
      </div>

      <div className="mt-8">
        <HoloLabel>Human Readability · Universal Structure</HoloLabel>
        <div className="mt-3 flex flex-wrap gap-1 border-b border-border">
          {TABS.map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={
                "border-b-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors " +
                (tab === label ? "border-signal text-signal" : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >{label}</button>
          ))}
        </div>
        <div className="mt-4">
          <TabPanel tab={tab} s={s} generation={generation} />
        </div>
      </div>
    </main>
  );
}

function TabPanel({ tab, s, generation }: { tab: Tab; s: ReturnType<typeof civStats>; generation: number }) {
  const body: Record<Tab, JSX.Element> = {
    Overview: (
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        A civilization of generation <span className="text-signal">{generation.toLocaleString()}</span> sustains{" "}
        <span className="text-signal">{s.population.toLocaleString()}</span> entities across{" "}
        <span className="text-signal">{s.colonies}</span> colonies, operating a fleet of{" "}
        <span className="text-signal">{s.ships}</span> ships under a Tier-{s.aiTier} neural runtime.
      </p>
    ),
    Diagram: (
      <pre className="overflow-auto rounded border border-border bg-plate p-4 font-mono text-[11px] leading-relaxed text-signal">
{`Generation ${generation}
   ├─ Population   ${s.population.toLocaleString()}
   │   └─ Species  adaptive
   ├─ Fleet        ${s.ships} hulls
   │   ├─ Engines  gen-${Math.max(1, s.aiTier)}
   │   └─ Weapons  lineage-${s.aiTier + 2}
   ├─ Industry     idx ${s.industry}
   ├─ Research     idx ${s.research}
   ├─ AI           tier ${s.aiTier}
   └─ Knowledge    ${s.knowledge.toLocaleString()} nodes  (${s.compression}% compressed)`}
      </pre>
    ),
    Animation: <p className="text-sm text-muted-foreground">All scanner panels above animate live against this generation's parameters. Move the slider to observe cascade.</p>,
    Summary: <p className="text-sm text-muted-foreground">Civilization is defined as the composed evolution of eleven subsystems. Advancing generation multiplies each subsystem by its own function of log-generation, then couples them through shared industrial and neural indices.</p>,
    Technical: (
      <pre className="overflow-auto rounded border border-border bg-plate p-4 font-mono text-[11px] leading-relaxed text-foreground">
{`population   = 1000 * gen^1.4
ships        = 2 + gen^0.75
research     = log10(gen) * 12.4
industry     = log10(gen) * 9.8 + 1
aiTier       = min(12, floor(log10(gen) * 2))
compression  = (1 - 1 / (1 + log10(gen))) * 100
knowledge    = gen^1.15 * 42
colonies     = gen^0.6`}
      </pre>
    ),
    Verification: (
      <ul className="grid gap-2 text-sm">
        <li><span className="text-signal">✓</span> Population monotone increasing in generation.</li>
        <li><span className="text-signal">✓</span> AI Tier bounded to [0, 12].</li>
        <li><span className="text-signal">✓</span> Compression asymptotic to 100%.</li>
        <li><span className="text-signal">✓</span> All indices computed pure — no side effects.</li>
      </ul>
    ),
    Runtime: (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <DataReadout label="Scanners" value="3" />
        <DataReadout label="Math calls / frame" value="~120" />
        <DataReadout label="Module" value="CIV-01" />
        <DataReadout label="State" value="Nominal" />
      </div>
    ),
  };
  return body[tab];
}
