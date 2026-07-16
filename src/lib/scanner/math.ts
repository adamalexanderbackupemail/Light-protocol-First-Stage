// Procedural scanner mathematics. Pure functions, parameter driven.
// Each renderer takes (ctx, t, params) where t is elapsed ms.

export type Ctx = CanvasRenderingContext2D;

const css = (name: string, fallback = "#7cd") => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const colors = {
  signal: () => css("--signal", "oklch(0.88 0.16 210)"),
  signalDim: () => css("--signal-dim", "oklch(0.55 0.09 210)"),
  grid: () => css("--grid-line", "rgba(120,150,180,0.4)"),
  fg: () => css("--foreground", "#eef"),
  warn: () => css("--warn", "#ec8"),
  hot: () => css("--hot", "#f75"),
};

// ---------- PULSE ----------
export interface PulseParams { amplitude: number; frequency: number; harmonics: number; intensity: number; }
export function drawPulse(ctx: Ctx, t: number, p: PulseParams) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  const mid = h / 2;
  ctx.lineWidth = 1;

  // baseline
  ctx.strokeStyle = colors.grid();
  ctx.beginPath();
  ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();

  // waveform
  ctx.strokeStyle = colors.signal();
  ctx.shadowColor = colors.signal();
  ctx.shadowBlur = 8 * p.intensity;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    let y = 0;
    for (let k = 1; k <= p.harmonics; k++) {
      y += Math.sin(x * 0.012 * p.frequency * k + t * 0.002 * k) / k;
    }
    y = mid + y * p.amplitude * h * 0.22;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// ---------- ORBITAL ----------
export interface OrbitalParams { bodies: number; speed: number; eccentricity: number; }
export function drawOrbital(ctx: Ctx, t: number, p: OrbitalParams) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  const rMax = Math.min(w, h) * 0.42;

  // star
  ctx.fillStyle = colors.signal();
  ctx.shadowColor = colors.signal();
  ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.lineWidth = 1;
  for (let i = 0; i < p.bodies; i++) {
    const a = rMax * ((i + 1) / (p.bodies + 1));
    const b = a * (1 - p.eccentricity * (0.3 + 0.5 * ((i * 37) % 7) / 7));
    const rot = (i * 0.6);

    // orbit path
    ctx.strokeStyle = colors.grid();
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, b, rot, 0, Math.PI * 2);
    ctx.stroke();

    // body
    const speed = p.speed * (0.6 + 0.4 / (i + 1));
    const theta = t * 0.0006 * speed + i * 1.7;
    const x0 = Math.cos(theta) * a, y0 = Math.sin(theta) * b;
    const x = cx + x0 * Math.cos(rot) - y0 * Math.sin(rot);
    const y = cy + x0 * Math.sin(rot) + y0 * Math.cos(rot);
    ctx.fillStyle = colors.signal();
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();

    // trail marker
    ctx.strokeStyle = colors.signalDim();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
  }
}

// ---------- HARMONIC ----------
export interface HarmonicParams { bars: number; tempo: number; load: number; }
export function drawHarmonic(ctx: Ctx, t: number, p: HarmonicParams) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  const gap = 4;
  const bw = (w - gap * (p.bars - 1)) / p.bars;
  for (let i = 0; i < p.bars; i++) {
    const phase = t * 0.003 * p.tempo + i * 0.4;
    const v = (0.5 + 0.5 * Math.sin(phase)) * p.load;
    const bh = h * (0.15 + 0.8 * v);
    const x = i * (bw + gap);
    const y = h - bh;
    ctx.fillStyle = colors.grid();
    ctx.fillRect(x, 0, bw, h);
    const grad = ctx.createLinearGradient(0, y, 0, h);
    grad.addColorStop(0, colors.signal());
    grad.addColorStop(1, colors.signalDim());
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, bw, bh);
  }
}

// ---------- NEURAL ----------
export interface NeuralParams { nodes: number; density: number; }
interface Node { x: number; y: number; vx: number; vy: number; }
const neuralCache = new WeakMap<HTMLCanvasElement, Node[]>();
export function drawNeural(ctx: Ctx, t: number, p: NeuralParams) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  let nodes = neuralCache.get(ctx.canvas);
  if (!nodes || nodes.length !== p.nodes) {
    nodes = Array.from({ length: p.nodes }, (_, i) => ({
      x: (Math.sin(i * 12.9898) * 43758.5453) % 1 * w,
      y: (Math.cos(i * 78.233) * 43758.5453) % 1 * h,
      vx: 0, vy: 0,
    })).map(n => ({ ...n, x: Math.abs(n.x) % w, y: Math.abs(n.y) % h }));
    neuralCache.set(ctx.canvas, nodes);
  }

  // gentle drift
  for (const n of nodes) {
    n.x += Math.sin(t * 0.0004 + n.y * 0.01) * 0.3;
    n.y += Math.cos(t * 0.0004 + n.x * 0.01) * 0.3;
    if (n.x < 0) n.x += w; if (n.x > w) n.x -= w;
    if (n.y < 0) n.y += h; if (n.y > h) n.y -= h;
  }

  const thresh = 40 + p.density * 120;
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < thresh) {
        const a = 1 - d / thresh;
        ctx.strokeStyle = `color-mix(in oklab, ${colors.signal()} ${Math.round(a * 70)}%, transparent)`;
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      }
    }
  }
  ctx.fillStyle = colors.signal();
  for (const n of nodes) {
    ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI * 2); ctx.fill();
  }
}

// Derived civilization mathematics
export function civStats(generation: number) {
  const g = Math.max(1, generation);
  const l = Math.log10(g);
  return {
    population: Math.round(1000 * Math.pow(g, 1.4)),
    ships: Math.round(2 + Math.pow(g, 0.75)),
    research: +(l * 12.4).toFixed(2),
    industry: +(l * 9.8 + 1).toFixed(2),
    aiTier: Math.min(12, Math.floor(l * 2)),
    compression: +((1 - 1 / (1 + l)) * 100).toFixed(1),
    knowledge: Math.round(Math.pow(g, 1.15) * 42),
    colonies: Math.round(Math.pow(g, 0.6)),
  };
}
