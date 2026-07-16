import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawOrbital, drawHarmonic } from "@/lib/scanner/math";

export const Route = createFileRoute("/engine")({
  head: () => ({ meta: [{ title: "Engine Builder · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="ENG-10"
      title="Engine Builder"
      intro="Scene graph, entity inspector, component library, visual scripting, animation graph, scanner builder, runtime diagnostics, module library."
      primary={{ code: "SCN·SCN", title: "Scene Graph", label: "Live · 12 nodes", draw: (c, t) => drawOrbital(c, t, { bodies: 5, speed: 0.7, eccentricity: 0.3 }) }}
      secondary={{ code: "SCN·ANM", title: "Animation Graph", label: "Live · 18 tracks", draw: (c, t) => drawHarmonic(c, t, { bars: 18, tempo: 1.5, load: 0.8 }) }}
      readouts={[
        { label: "Entities", value: 214 },
        { label: "Components", value: 42 },
        { label: "Modules", value: 12 },
        { label: "Scripts", value: 87 },
        { label: "Tracks", value: 18 },
        { label: "Build", value: "OK", hint: "0 errors" },
      ]}
    />
  ),
});
