import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawNeural, drawPulse } from "@/lib/scanner/math";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Engine · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="KNL-13"
      title="Knowledge Engine"
      intro="Every concept navigable: history, research, mechanics, implementation, source modules, verification. The platform documents itself."
      primary={{ code: "SCN·KNL", title: "Concept Mesh", label: "Live · 52 concepts", draw: (c, t) => drawNeural(c, t, { nodes: 52, density: 0.6 }) }}
      secondary={{ code: "SCN·CMP", title: "Compression Signal", label: "Live · Encoding", draw: (c, t) => drawPulse(c, t, { amplitude: 0.9, frequency: 1.4, harmonics: 5, intensity: 1 }) }}
      readouts={[
        { label: "Concepts", value: 428 },
        { label: "Cross-links", value: 3812 },
        { label: "Depth", value: 11 },
        { label: "Verified", value: "88%" },
        { label: "Sources", value: 96 },
        { label: "Compression", value: "71%" },
      ]}
    />
  ),
});
