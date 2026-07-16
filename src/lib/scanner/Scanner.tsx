import { useEffect, useRef } from "react";
import { reportFrame, registerScanner } from "./runtime";
import type { Ctx } from "./math";

export type ScannerDraw = (ctx: Ctx, t: number) => void;

interface Props {
  draw: ScannerDraw;
  className?: string;
  label?: string;
}

export function Scanner({ draw, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const unregister = registerScanner();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      reportFrame(dt);
      drawRef.current(ctx, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); unregister(); };
  }, []);

  return (
    <div className={"relative overflow-hidden " + (className ?? "")}>
      <canvas ref={ref} className="block h-full w-full" />
      {label && (
        <div className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-signal-pulse mr-2 align-middle" />
          {label}
        </div>
      )}
    </div>
  );
}
