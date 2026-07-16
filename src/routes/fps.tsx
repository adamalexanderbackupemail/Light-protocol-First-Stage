import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawNeural, drawHarmonic } from "@/lib/scanner/math";

export const Route = createFileRoute("/fps")({
  head: () => ({ meta: [{ title: "FPS · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="FPS-06"
      title="Mission Command"
      intro="Armor, weapons, deployment, exosuits, gundams. Every asset displays generation, lineage, manufacturing, research, compression and diagnostics."
      primary={{ code: "SCN·MSN", title: "Squad Neural Net", label: "Live · 6-agent squad", draw: (c, t) => drawNeural(c, t, { nodes: 18, density: 0.75 }) }}
      secondary={{ code: "SCN·WPN", title: "Weapon Cadence", label: "Live · Cycle rate", draw: (c, t) => drawHarmonic(c, t, { bars: 20, tempo: 2.4, load: 0.9 }) }}
      readouts={[
        { label: "Loadout", value: "MK-VII" },
        { label: "Armor Class", value: "Ω-3" },
        { label: "Exosuit", value: "GND-4", hint: "gundam class" },
        { label: "Ammo", value: "740", unit: "rnd" },
        { label: "Squad", value: 6 },
        { label: "Threat", value: "elevated", hint: "sector 7" },
      ]}
    />
  ),
});
