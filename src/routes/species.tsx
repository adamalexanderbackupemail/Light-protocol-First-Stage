import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawOrbital, drawNeural } from "@/lib/scanner/math";

export const Route = createFileRoute("/species")({
  head: () => ({ meta: [{ title: "Species · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="SPS-08"
      title="Species"
      intro="Lineage across generations. Adaptation is measured as orbital distance from ancestral form."
      primary={{ code: "SCN·LNG", title: "Lineage Orbits", label: "Live · 8 branches", draw: (c, t) => drawOrbital(c, t, { bodies: 8, speed: 0.4, eccentricity: 0.55 }) }}
      secondary={{ code: "SCN·GNM", title: "Genome Mesh", label: "Live · Adaptive graph", draw: (c, t) => drawNeural(c, t, { nodes: 30, density: 0.7 }) }}
      readouts={[
        { label: "Species", value: 42 },
        { label: "Extinct", value: 6 },
        { label: "Hybrid", value: 12 },
        { label: "Divergence", value: "0.34" },
        { label: "Traits", value: 1284 },
        { label: "Uplifted", value: 3 },
      ]}
    />
  ),
});
