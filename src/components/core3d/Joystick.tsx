import { useRef, useState, type PointerEvent as RPointerEvent } from "react";

interface Props {
  onMove: (v: { x: number; y: number }) => void;
}

export function Joystick({ onMove }: Props) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const idRef = useRef<number | null>(null);

  const update = (e: RPointerEvent<HTMLDivElement>) => {
    const el = baseRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = r.width / 2;
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob({ x: dx, y: dy });
    onMove({ x: dx / max, y: -dy / max });
  };

  const end = () => {
    idRef.current = null;
    setKnob({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => {
        idRef.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => {
        if (idRef.current === e.pointerId) update(e);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      className="pointer-events-auto relative h-32 w-32 touch-none rounded-full border border-signal/40 bg-background/30 backdrop-blur-sm"
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-signal/70 bg-signal/25"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
