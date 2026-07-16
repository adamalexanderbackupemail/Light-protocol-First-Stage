import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawOrbital, drawNeural } from "@/lib/scanner/math";

export const Route = createFileRoute("/space")({
  head: () => ({ meta: [{ title: "Space · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="SPC-07"
      title="Space"
      intro="Galaxy map, fleet routing, colonization, orbital combat, exploration. Every ship displays generation, engine history, compression and runtime."
      primary={{ code: "SCN·GAL", title: "Galactic Chart", label: "Live · 11 orbits", draw: (c, t) => drawOrbital(c, t, { bodies: 11, speed: 0.6, eccentricity: 0.5 }) }}
      secondary={{ code: "SCN·JMP", title: "Jump Lattice", label: "Live · Route mesh", draw: (c, t) => drawNeural(c, t, { nodes: 40, density: 0.55 }) }}
      readouts={[
        { label: "Systems", value: 214 },
        { label: "Colonized", value: 37 },
        { label: "Contested", value: 4, hint: "orbital combat" },
        { label: "Jump Range", value: "48", unit: "ly" },
        { label: "Charted", value: "62%" },
        { label: "Anomalies", value: 12 },
      ]}
    />
  ),
});
