import { createFileRoute } from "@tanstack/react-router";
import { ModuleShell } from "@/components/technical/ModuleShell";
import { drawOrbital, drawPulse } from "@/lib/scanner/math";

export const Route = createFileRoute("/fleet")({
  head: () => ({ meta: [{ title: "Fleet · LIGHT Protocol" }] }),
  component: () => (
    <ModuleShell
      code="FLT-02"
      title="Fleet"
      intro="Ship lineage, engine history, orbital deployment. Every hull carries a full generation record from foundry to service."
      primary={{ code: "SCN·FLT", title: "Orbital Deployment", label: "Live · 9 hulls", draw: (c, t) => drawOrbital(c, t, { bodies: 9, speed: 1.1, eccentricity: 0.32 }) }}
      secondary={{ code: "SCN·ENR", title: "Engine Pulse", label: "Live · Thrust Envelope", draw: (c, t) => drawPulse(c, t, { amplitude: 1, frequency: 1.6, harmonics: 3, intensity: 1 }) }}
      readouts={[
        { label: "Active Hulls", value: 128 },
        { label: "In Orbit", value: 47, hint: "3 systems" },
        { label: "Engine Gen", value: "VII", unit: "series" },
        { label: "Fleet Readiness", value: "94%" },
        { label: "Fuel Reserve", value: "2.3", unit: "M t" },
        { label: "Lineage Depth", value: 12 },
      ]}
    />
  ),
});
