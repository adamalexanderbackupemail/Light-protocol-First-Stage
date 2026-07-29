import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { Joystick } from "@/components/core3d/Joystick";
import { STATIONS, CORE_STATION, type Station } from "@/lib/core3d/zones";

const CoreScene = lazy(() => import("@/components/core3d/CoreScene"));

export const Route = createFileRoute("/core")({
  head: () => ({
    meta: [
      { title: "LIGHT Core · First-Person Intelligence Environment" },
      { name: "description", content: "Enter the LIGHT Ω intelligence core: a first-person 3D facility with vision, simulation, knowledge and creation stations." },
      { property: "og:title", content: "LIGHT Core · First-Person Intelligence Environment" },
      { property: "og:description", content: "Walk the LIGHT Ω facility. Approach stations, activate holographic modules, inhabit the operating system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CorePage,
});

const ALL: Station[] = [...STATIONS, CORE_STATION];
const QUALITIES = ["low", "medium", "high"] as const;

function CorePage() {
  return (
    <div className="fixed inset-0 z-40 bg-background">
      <ClientOnly fallback={<Boot label="Preparing renderer" />}>
        <Suspense fallback={<Boot label="Loading engine" />}>
          <CoreExperience />
        </Suspense>
      </ClientOnly>
    </div>
  );
}

function Boot({ label }: { label: string }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-signal/30 border-t-signal" />
        <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-signal">{label}</div>
      </div>
    </div>
  );
}

function CoreExperience() {
  const [ready, setReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [nearId, setNearId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("high");
  const [settings, setSettings] = useState(false);

  const moveRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });
  const touchRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const near = ALL.find((s) => s.id === nearId) ?? null;
  const active = ALL.find((s) => s.id === activeId) ?? null;

  const onActivate = useCallback((id: string) => {
    setActiveId(id);
    document.exitPointerLock?.();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <CoreScene
        quality={quality}
        paused={!!activeId || settings}
        onReady={() => setReady(true)}
        onFps={setFps}
        onNear={setNearId}
        onActivate={onActivate}
        moveRef={moveRef}
        lookRef={lookRef}
      />

      {/* touch look layer */}
      <div
        className="absolute inset-0 touch-none md:hidden"
        onPointerDown={(e) => {
          if (e.clientX < window.innerWidth * 0.4) return;
          touchRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          const t = touchRef.current;
          if (!t || t.id !== e.pointerId) return;
          lookRef.current.x += e.clientX - t.x;
          lookRef.current.y += e.clientY - t.y;
          touchRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (touchRef.current = null)}
        onPointerCancel={() => (touchRef.current = null)}
      />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto rounded border border-border/60 bg-background/50 px-3 py-2 backdrop-blur-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">LIGHT Ω · Core Facility</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {fps} fps · {quality} · {ALL.length} stations
            </div>
          </div>
          <div className="pointer-events-auto flex gap-2">
            <button
              onClick={() => setSettings((s) => !s)}
              className="rounded border border-border/60 bg-background/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur-md hover:border-signal hover:text-signal"
            >
              Settings
            </button>
            <Link
              to="/"
              className="rounded border border-border/60 bg-background/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur-md hover:border-signal hover:text-signal"
            >
              Exit
            </Link>
          </div>
        </div>

        {/* crosshair */}
        <div className="mx-auto flex flex-col items-center gap-3">
          <div className="h-4 w-4 rounded-full border border-signal/60">
            <div className="mx-auto mt-[6px] h-1 w-1 rounded-full bg-signal" />
          </div>
          {near && !active && (
            <div className="rounded border border-signal/50 bg-background/60 px-4 py-2 text-center backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">{near.code} · {near.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="hidden md:inline">Press E to activate</span>
                <button
                  onClick={() => onActivate(near.id)}
                  className="pointer-events-auto md:hidden"
                >
                  Tap to activate
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="md:hidden">
            <Joystick onMove={(v) => (moveRef.current = v)} />
          </div>
          <div className="hidden rounded border border-border/60 bg-background/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-md md:block">
            WASD move · Shift sprint · Mouse look · E activate
          </div>
          <div className="rounded border border-border/60 bg-background/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-md">
            {near ? "In range" : "Traversing"}
          </div>
        </div>
      </div>

      {/* station panel */}
      {active && (
        <div className="absolute inset-0 grid place-items-center bg-background/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded border border-signal/40 bg-plate/80 p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">{active.code}</div>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">{active.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{active.summary}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {active.readouts.map(([k, v]) => (
                <div key={k}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{k}</div>
                  <div className="mt-1 font-mono text-lg text-foreground">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {active.actions.map((a) => (
                <span key={a} className="rounded border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {a} · queued
                </span>
              ))}
            </div>
            <button
              onClick={() => setActiveId(null)}
              className="mt-6 w-full rounded border border-signal px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-signal hover:bg-signal hover:text-background"
            >
              Disengage
            </button>
          </div>
        </div>
      )}

      {/* settings */}
      {settings && (
        <div className="absolute inset-0 grid place-items-center bg-background/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded border border-border bg-plate/80 p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">Runtime Settings</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Graphics quality</div>
            <div className="mt-2 flex gap-2">
              {QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={
                    "flex-1 rounded border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] " +
                    (q === quality ? "border-signal text-signal" : "border-border text-muted-foreground hover:border-signal/60")
                  }
                >
                  {q}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSettings(false)}
              className="mt-6 w-full rounded border border-signal px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-signal hover:bg-signal hover:text-background"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {!ready && <div className="absolute inset-0 bg-background"><Boot label="Initializing core" /></div>}
    </div>
  );
}
