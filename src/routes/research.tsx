import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawNeural, drawPulse } from "@/lib/scanner/math";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="RES-05"
      title="Research"
      intro="Knowledge trees compress as they grow. Every concept is navigable — history, mechanics, implementation, verification."
      primary={{ code: "SCN·KNL", title: "Knowledge Graph", label: "Live · 46 concepts", draw: (c, t) => drawNeural(c, t, { nodes: 46, density: 0.5 }) }}
      secondary={{ code: "SCN·INS", title: "Insight Signal", label: "Live · Breakthrough envelope", draw: (c, t) => drawPulse(c, t, { amplitude: 1.1, frequency: 0.9, harmonics: 6, intensity: 1 }) }}
      readouts={[
        { label: "Nodes", value: 4287 },
        { label: "Concepts", value: 214 },
        { label: "Compression", value: "68%" },
        { label: "Active Depth", value: 9 },
        { label: "Breakthroughs", value: 4, hint: "this cycle" },
        { label: "Verified", value: "91%" },
      ]}
    />
  ),
});
