import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawHarmonic, drawNeural } from "@/lib/scanner/math";

export const Route = createFileRoute("/developer")({
  head: () => ({ meta: [{ title: "Developer Console · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="DEV-12"
      title="Developer Console"
      intro="Introspection, module registry, runtime hooks. Every LIGHT subsystem exposes itself to the developer surface."
      primary={{ code: "SCN·REG", title: "Module Registry", label: "Live · 12 modules", draw: (c, t) => drawHarmonic(c, t, { bars: 12, tempo: 0.9, load: 0.6 }) }}
      secondary={{ code: "SCN·CAL", title: "Call Graph", label: "Live · Runtime hooks", draw: (c, t) => drawNeural(c, t, { nodes: 26, density: 0.7 }) }}
      readouts={[
        { label: "Modules", value: 12 },
        { label: "Hooks", value: 84 },
        { label: "Warnings", value: 0, hint: "clean" },
        { label: "Errors", value: 0 },
        { label: "Coverage", value: "82%" },
        { label: "Build", value: "green" },
      ]}
    />
  ),
});
