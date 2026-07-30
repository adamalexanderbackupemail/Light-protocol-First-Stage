import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  VERSIONS,
  SYSTEM_TREE,
  flattenTree,
  computeAt,
  frameCapacity,
  COMPUTE_GROWTH,
  type SystemNode,
} from "@/lib/hierarchy/versions";
import { TechnicalPanel, DataReadout, HoloLabel, Divider } from "@/components/technical/primitives";

export const Route = createFileRoute("/hierarchy")({
  head: () => ({
    meta: [
      { title: "LIGHT Ω Hierarchy · Ten-Version Upgrade Path" },
      {
        name: "description",
        content:
          "The LIGHT Ω system hierarchy across ten annual versions: story stage, render stack, frame budget and 50/30/20 subsystem descriptors under compounding compute growth.",
      },
      { property: "og:title", content: "LIGHT Ω Hierarchy · Ten-Version Upgrade Path" },
      {
        property: "og:description",
        content:
          "Canvas to continuous rendering across ten releases, with every subsystem described structurally, functionally and per-frame.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HierarchyPage,
});

function HierarchyPage() {
  const [v, setV] = useState(3);
  const spec = VERSIONS[v - 1];
  const flat = useMemo(() => flattenTree(SYSTEM_TREE), []);
  const online = flat.filter((n) => n.since <= v).length;

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header>
        <HoloLabel>System · Hierarchy Ω</HoloLabel>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
          LIGHT as an upgradable computer
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ten annual releases. Compute compounds at {COMPUTE_GROWTH}× per year, and every version spends
          the surplus on two things only: how much story the world can hold, and how honestly it can be
          rendered. Each subsystem is described structurally (50), functionally (30) and per-frame (20).
        </p>
      </header>

      <Divider label="Version Ladder" />

      <TechnicalPanel code="VER·SEL" title={`${spec.code} · ${spec.name}`}>
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {VERSIONS.map((s) => (
              <button
                key={s.v}
                onClick={() => setV(s.v)}
                aria-pressed={s.v === v}
                className={
                  "flex-1 min-w-[52px] rounded border px-2 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors " +
                  (s.v === v
                    ? "border-signal text-signal"
                    : s.v < v
                      ? "border-border text-foreground hover:border-signal/60"
                      : "border-border/50 text-muted-foreground hover:border-signal/40")
                }
              >
                v{s.v}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
            aria-label="Select LIGHT version"
            className="mt-5 w-full accent-[color:var(--signal)]"
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DataReadout label="Year" value={spec.year} hint={`v${spec.v} of 10`} />
            <DataReadout
              label="Compute"
              value={computeAt(spec.v).toFixed(2)}
              unit="× v1"
              hint={`${COMPUTE_GROWTH}× per year`}
            />
            <DataReadout
              label="Frame capacity"
              value={frameCapacity(spec.v).toFixed(1)}
              unit="× v1"
              hint="compute × parallelism"
            />
            <DataReadout label="Render stack" value={spec.stack} hint={spec.budget.frame} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Story stage
              </div>
              <div className="mt-1.5 text-sm font-medium">{spec.storyStage}</div>
              <p className="mt-2 text-sm text-muted-foreground">{spec.storyBeat}</p>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Rendering leap
              </div>
              <div className="mt-1.5 text-sm font-medium">{spec.stack}</div>
              <p className="mt-2 text-sm text-muted-foreground">{spec.renderLeap}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              Unlocked at this version
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {spec.unlocks.map((u) => (
                <span
                  key={u}
                  className="rounded border border-signal/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-signal"
                >
                  {u}
                </span>
              ))}
            </div>
          </div>

          <HierarchyTriplet h={spec.hierarchy} className="mt-6" />
        </div>
      </TechnicalPanel>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <TechnicalPanel code="CMP·CRV" title="Compounding compute · v1 → v10">
          <ComputeCurve current={v} onPick={setV} />
        </TechnicalPanel>

        <TechnicalPanel code="BGT·FRM" title="Frame budget">
          <dl className="divide-y divide-border">
            {(
              [
                ["Triangles", spec.budget.triangles],
                ["Draw calls", spec.budget.drawCalls],
                ["Dynamic lights", spec.budget.lights],
                ["Particles", spec.budget.particles],
                ["Resolution", spec.budget.resolution],
                ["Frame target", spec.budget.frame],
              ] as const
            ).map(([k, val]) => (
              <div key={k} className="flex items-baseline justify-between px-4 py-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="font-mono text-sm tabular-nums text-foreground">{val}</dd>
              </div>
            ))}
          </dl>
        </TechnicalPanel>
      </div>

      <Divider label={`Subsystem Hierarchy · ${online}/${flat.length} online at v${v}`} />

      <div className="grid gap-4 lg:grid-cols-2">
        {SYSTEM_TREE.map((node) => (
          <TreeBranch key={node.id} node={node} v={v} />
        ))}
      </div>

      <Divider label="Full Release Timeline" />

      <TechnicalPanel code="TML·Ω" title="Ten versions, one machine">
        <div className="divide-y divide-border">
          {VERSIONS.map((s) => (
            <button
              key={s.v}
              onClick={() => setV(s.v)}
              className={
                "block w-full px-4 py-3 text-left transition-colors hover:bg-plate-raised/40 " +
                (s.v === v ? "bg-plate-raised/30" : "")
              }
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
                  {s.code}
                </span>
                <span className="text-sm font-medium">{s.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.year} · {computeAt(s.v).toFixed(2)}× · {s.stack}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.storyStage}</p>
            </button>
          ))}
        </div>
      </TechnicalPanel>
    </main>
  );
}

function HierarchyTriplet({
  h,
  className,
}: {
  h: { "50": string; "30": string; "20": string };
  className?: string;
}) {
  const rows = [
    ["50", "Structural identity", h["50"]],
    ["30", "Functional behaviour", h["30"]],
    ["20", "Micro instruction", h["20"]],
  ] as const;
  return (
    <div className={"grid gap-3 sm:grid-cols-3 " + (className ?? "")}>
      {rows.map(([n, title, body]) => (
        <div key={n} className="border-l border-border pl-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-signal">{n}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              {title}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}

function TreeBranch({ node, v }: { node: SystemNode; v: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const live = node.since <= v;
  return (
    <TechnicalPanel
      code={node.code}
      title={node.label}
      className={live ? "" : "opacity-55"}
      actions={
        <span
          className={
            "font-mono text-[9px] uppercase tracking-[0.25em] " +
            (live ? "text-[color:var(--mint)]" : "text-muted-foreground")
          }
        >
          {live ? "online" : `unlocks v${node.since}`}
        </span>
      }
    >
      <div className="p-4">
        <HierarchyTriplet h={node.hierarchy} />
        {node.children && (
          <ul className="mt-4 space-y-1.5 border-l border-border pl-3">
            {node.children.map((c) => {
              const cLive = c.since <= v;
              const isOpen = open === c.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : c.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline gap-2 text-left"
                  >
                    <span className="font-mono text-[10px] text-signal">{isOpen ? "−" : "+"}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {c.code}
                    </span>
                    <span className={"text-sm " + (cLive ? "text-foreground" : "text-muted-foreground")}>
                      {c.label}
                    </span>
                    <span
                      className={
                        "ml-auto font-mono text-[9px] uppercase tracking-[0.25em] " +
                        (cLive ? "text-[color:var(--mint)]" : "text-muted-foreground")
                      }
                    >
                      {cLive ? "online" : `v${c.since}`}
                    </span>
                  </button>
                  {isOpen && <HierarchyTriplet h={c.hierarchy} className="mb-3 mt-2" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </TechnicalPanel>
  );
}

function ComputeCurve({ current, onPick }: { current: number; onPick: (v: number) => void }) {
  const w = 640;
  const h = 220;
  const pad = 28;
  const max = frameCapacity(10);
  const pts = VERSIONS.map((s) => {
    const x = pad + ((s.v - 1) / 9) * (w - pad * 2);
    const y = h - pad - (frameCapacity(s.v) / max) * (h - pad * 2);
    const yc = h - pad - (computeAt(s.v) / max) * (h - pad * 2);
    return { v: s.v, x, y, yc };
  });
  const line = (key: "y" | "yc") => pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p[key]}`).join(" ");

  return (
    <div className="p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Compute growth across ten versions">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={w - pad}
            y1={h - pad - f * (h - pad * 2)}
            y2={h - pad - f * (h - pad * 2)}
            stroke="currentColor"
            className="text-border"
            strokeWidth={1}
          />
        ))}
        <path d={line("y")} fill="none" stroke="currentColor" className="text-signal" strokeWidth={2} />
        <path
          d={line("yc")}
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        {pts.map((p) => (
          <g key={p.v} onClick={() => onPick(p.v)} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r={p.v === current ? 5 : 3} fill="currentColor" className="text-signal" />
            <text
              x={p.x}
              y={h - 8}
              textAnchor="middle"
              className={p.v === current ? "fill-signal" : "fill-muted-foreground"}
              style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)" }}
            >
              v{p.v}
            </text>
            <rect x={p.x - 14} y={pad - 12} width={28} height={h - pad * 2 + 24} fill="transparent" />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex gap-4 px-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
        <span className="text-signal">— effective frame capacity</span>
        <span>-- raw compute (1.33^n)</span>
      </div>
    </div>
  );
}
