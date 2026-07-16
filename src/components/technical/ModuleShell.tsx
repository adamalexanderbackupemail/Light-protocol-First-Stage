import type { ReactNode } from "react";
import { Scanner, type ScannerDraw } from "@/lib/scanner/Scanner";
import { TechnicalPanel, DataReadout, HoloLabel, Divider } from "@/components/technical/primitives";

interface Props {
  code: string;
  title: string;
  intro: string;
  primary: { code: string; title: string; label: string; draw: ScannerDraw };
  secondary: { code: string; title: string; label: string; draw: ScannerDraw };
  readouts: Array<{ label: string; value: ReactNode; unit?: string; hint?: string }>;
  detail?: ReactNode;
}

export function ModuleShell({ code, title, intro, primary, secondary, readouts, detail }: Props) {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <header>
        <HoloLabel>Module · {code}</HoloLabel>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{intro}</p>
      </header>
      <Divider label="Live Systems" />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <TechnicalPanel code={primary.code} title={primary.title}>
          <Scanner draw={primary.draw} className="aspect-[16/9] w-full" label={primary.label} />
        </TechnicalPanel>

        <TechnicalPanel code="SYS·IDX" title="Subsystem Readout">
          <div className="grid grid-cols-2 gap-5 p-5">
            {readouts.map((r) => (
              <DataReadout key={r.label} label={r.label} value={r.value} unit={r.unit} hint={r.hint} />
            ))}
          </div>
        </TechnicalPanel>

        <TechnicalPanel code={secondary.code} title={secondary.title} className="lg:col-span-2">
          <Scanner draw={secondary.draw} className="h-56 w-full" label={secondary.label} />
        </TechnicalPanel>
      </div>

      {detail && <div className="mt-8">{detail}</div>}
    </main>
  );
}
