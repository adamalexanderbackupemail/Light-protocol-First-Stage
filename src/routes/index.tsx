import { createFileRoute, Link } from "@tanstack/react-router";
import { Scanner } from "@/lib/scanner/Scanner";
import { drawOrbital, drawNeural, drawPulse } from "@/lib/scanner/math";
import { TechnicalPanel, DataReadout, HoloLabel, GridBackdrop, Reticle, Divider } from "@/components/technical/primitives";

export const Route = createFileRoute("/")({
  component: Genesis,
});

const MODULES = [
  { path: "/civilization", code: "CIV-01", title: "Civilization", desc: "Generation-driven evolution of species, industry and knowledge." },
  { path: "/fleet",        code: "FLT-02", title: "Fleet",        desc: "Ship lineage, engine history, orbital deployment." },
  { path: "/scanner",      code: "SCN-03", title: "Scanner",      desc: "Procedural graphics engine across ten modes." },
  { path: "/industry",     code: "IND-04", title: "Industry",     desc: "Harmonic manufacturing and production graphs." },
  { path: "/research",     code: "RES-05", title: "Research",     desc: "Fractal knowledge trees and compression." },
  { path: "/fps",          code: "FPS-06", title: "FPS",          desc: "Mission command, armor, exosuits, gundams." },
  { path: "/space",        code: "SPC-07", title: "Space",        desc: "Galaxy map, orbital combat, colonization." },
  { path: "/species",      code: "SPS-08", title: "Species",      desc: "Evolutionary lineage and adaptation." },
  { path: "/ai",           code: "AI-09",  title: "AI",           desc: "Neural runtime and tier progression." },
  { path: "/engine",       code: "ENG-10", title: "Engine",       desc: "Scene graph, animation graph, module library." },
  { path: "/runtime",      code: "RUN-11", title: "Runtime",      desc: "Live diagnostics: FPS, memory, animation load." },
  { path: "/developer",    code: "DEV-12", title: "Developer",    desc: "Introspection tools and module registry." },
] as const;

function Genesis() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-signal/5 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]">
            <Scanner draw={(c, t) => drawOrbital(c, t, { bodies: 6, speed: 0.9, eccentricity: 0.35 })} className="h-full w-full" />
          </div>
        </div>

        <div className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex items-center gap-3">
            <Reticle className="h-4 w-4" />
            <HoloLabel>Genesis · Foundation Release · Signal Lock</HoloLabel>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            The browser-native civilization<br />operating system.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            LIGHT Protocol is a modular runtime. Every module — from FPS combat to orbital logistics — renders through a single procedural scanner engine and shares one universal structure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/civilization" className="rounded border border-signal bg-signal/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-signal hover:bg-signal hover:text-background">
              Initiate Civilization →
            </Link>
            <Link to="/scanner" className="rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:bg-plate-raised">
              Open Scanner
            </Link>
            <Link to="/runtime" className="rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:bg-plate-raised">
              Runtime Diagnostics
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <DataReadout label="Modules" value="12" hint="foundation set" />
            <DataReadout label="Scanner Modes" value="10" hint="procedural" />
            <DataReadout label="Math Engines" value="4" unit="active" />
            <DataReadout label="Runtime" value="Browser" unit="native" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="flex items-baseline justify-between">
          <div>
            <HoloLabel>Manifest · Modules</HoloLabel>
            <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">Modules resolve as independent runtimes.</h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">12 / 12 online</div>
        </div>
        <Divider label="Registry" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link key={m.path} to={m.path} className="group">
              <TechnicalPanel code={m.code} title={m.title} className="h-full transition-colors group-hover:border-signal">
                <div className="grid gap-3 p-4">
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal-dim group-hover:text-signal">Enter →</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">online</span>
                  </div>
                </div>
              </TechnicalPanel>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-24 pt-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <TechnicalPanel code="SCN·GAL" title="Galactic Scanner" className="lg:col-span-2">
            <Scanner
              draw={(c, t) => drawOrbital(c, t, { bodies: 7, speed: 1.0, eccentricity: 0.4 })}
              className="aspect-[16/9] w-full"
              label="Live · Orbital Solution"
            />
          </TechnicalPanel>
          <TechnicalPanel code="SCN·NRL" title="Neural Runtime">
            <Scanner
              draw={(c, t) => drawNeural(c, t, { nodes: 24, density: 0.6 })}
              className="aspect-square w-full"
              label="Live · Neural"
            />
          </TechnicalPanel>
          <TechnicalPanel code="SCN·ENR" title="Energy Pulse" className="lg:col-span-3">
            <Scanner
              draw={(c, t) => drawPulse(c, t, { amplitude: 1, frequency: 1.4, harmonics: 4, intensity: 1 })}
              className="h-40 w-full"
              label="Live · Pulse"
            />
          </TechnicalPanel>
        </div>
      </section>
    </main>
  );
}
