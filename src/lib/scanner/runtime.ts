// Runtime telemetry: shared registry tracked by every mounted Scanner.
type Listener = (s: RuntimeSnapshot) => void;

export interface RuntimeSnapshot {
  fps: number;
  frameMs: number;
  scanners: number;
  memoryMB: number | null;
  uptimeSec: number;
}

let active = 0;
let frames = 0;
let lastSample = typeof performance !== "undefined" ? performance.now() : 0;
let lastFrameMs = 16;
let fps = 60;
const start = lastSample;
const listeners = new Set<Listener>();

export function reportFrame(dtMs: number) {
  frames++;
  lastFrameMs = dtMs;
  const now = performance.now();
  if (now - lastSample >= 500) {
    fps = (frames * 1000) / (now - lastSample);
    frames = 0;
    lastSample = now;
    emit();
  }
}
export function registerScanner() { active++; emit(); return () => { active = Math.max(0, active - 1); emit(); }; }

function snapshot(): RuntimeSnapshot {
  const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
  return {
    fps: +fps.toFixed(1),
    frameMs: +lastFrameMs.toFixed(2),
    scanners: active,
    memoryMB: mem ? +(mem.usedJSHeapSize / 1048576).toFixed(1) : null,
    uptimeSec: Math.round((performance.now() - start) / 1000),
  };
}
function emit() { const s = snapshot(); listeners.forEach(l => l(s)); }
export function subscribeRuntime(l: Listener) {
  listeners.add(l);
  l(snapshot());
  return () => { listeners.delete(l); };
}
export function getRuntime() { return snapshot(); }
