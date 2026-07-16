import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawHarmonic, drawPulse } from "@/lib/scanner/math";

export const Route = createFileRoute("/industry")({
  head: () => ({ meta: [{ title: "Industry · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="IND-04"
      title="Industry"
      intro="Harmonic manufacturing. Production lines synchronize through shared cadence — each bar is one foundry line, each phase one throughput cycle."
      primary={{ code: "SCN·HRM", title: "Foundry Harmonic", label: "Live · 32 lines", draw: (c, t) => drawHarmonic(c, t, { bars: 32, tempo: 1.3, load: 0.85 }) }}
      secondary={{ code: "SCN·HET", title: "Thermal Pulse", label: "Live · Heat envelope", draw: (c, t) => drawPulse(c, t, { amplitude: 0.9, frequency: 2.1, harmonics: 5, intensity: 0.9 }) }}
      readouts={[
        { label: "Output", value: "8.4", unit: "M u/hr" },
        { label: "Lines", value: 32 },
        { label: "Uptime", value: "99.2%" },
        { label: "Heat", value: "412", unit: "K" },
        { label: "Yield", value: "97.8%" },
        { label: "Backlog", value: "1.1", unit: "d" },
      ]}
    />
  ),
});
