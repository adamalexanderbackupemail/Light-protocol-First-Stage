import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawNeural, drawPulse } from "@/lib/scanner/math";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Runtime · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="AI-09"
      title="AI Runtime"
      intro="Tiered neural runtimes. Each tier composes lower tiers as substrate. Signal is thought made visible."
      primary={{ code: "SCN·NRL", title: "Cortex Mesh", label: "Live · Tier 7", draw: (c, t) => drawNeural(c, t, { nodes: 60, density: 0.72 }) }}
      secondary={{ code: "SCN·THT", title: "Thought Signal", label: "Live · Inference", draw: (c, t) => drawPulse(c, t, { amplitude: 1, frequency: 3.2, harmonics: 5, intensity: 1 }) }}
      readouts={[
        { label: "Tier", value: "T7", hint: "operational" },
        { label: "Params", value: "48.2", unit: "B" },
        { label: "Latency", value: "3.1", unit: "ms" },
        { label: "Confidence", value: "0.94" },
        { label: "Agents", value: 128 },
        { label: "Substrate", value: "quantum" },
      ]}
    />
  ),
});
