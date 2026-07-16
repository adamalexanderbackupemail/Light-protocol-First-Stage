# LIGHT Protocol Genesis — Foundation Build (v1)

The full spec (Civilization, Fleet, FPS, Space, Industry, Research, Species, AI, Engine Builder, Knowledge Engine, all 10 scanner modes, procedural math libraries, runtime diagnostics) is far too large for a single generation pass and would produce shallow placeholder pages — the exact thing your spec forbids.

I'll build a **real, working foundation** you can extend module-by-module in follow-up prompts. Every page shipped will contain meaningful interactive content. Nothing stubbed.

## What ships in v1

### 1. Core Runtime & Design System
- Aerospace/industrial visual language: near-black background, brushed-titanium neutrals, thin white 1px technical lines, single cyan signal accent, large spacing, oversized mono/technical typography (JetBrains Mono + Inter Tight).
- Semantic tokens in `src/styles.css` (oklch): `--signal`, `--grid-line`, `--surface-plate`, `--hologram`, plus shadow/glow tokens. No hardcoded colors in components.
- Reusable primitives: `TechnicalPanel`, `DataReadout`, `GridBackdrop`, `HoloLabel`, `Reticle`.

### 2. Persistent Radial Control Wheel
- Fixed bottom-right, always visible across every route.
- 12 categories (Civilization, Fleet, Scanner, Industry, Research, FPS, Space, Species, AI, Engine, Runtime, Developer) arranged radially.
- Hover: gentle rotation + segment glow. Click: smooth expand → route navigation via TanStack Router `<Link>` (no reload).

### 3. Scanner Engine (real, not stubbed)
- Canvas 2D renderer with a parameter-driven animation loop (`requestAnimationFrame`, delta-time).
- Four working procedural math modules used across the app:
  - **Pulse** (energy/heat waveforms)
  - **Orbital** (Keplerian ellipses for ships/planets)
  - **Harmonic** (industrial rhythm bars)
  - **Neural** (force-directed node graph)
- Each exposes `(params, ctx, t) => void` so any page can mount any scanner.
- Two scanner modes wired to real UI: **Galactic** (orbital + neural overlay) and **Industrial** (harmonic + pulse).

### 4. Civilization Module (the flagship page)
- Generation slider: 1 → 1,000,000 (log scale).
- Live-derived stats: population, ships, research index, industry index, AI tier, knowledge compression — all computed from generation via pure functions.
- Scanner panel renders orbital + harmonic driven by current generation.
- Human-readability tabs on every entity: Overview / Diagram / Animation / Summary / Technical / Verification / Runtime.

### 5. Runtime Diagnostics page
- Live FPS, frame time, active animation count, module count, memory (where available), readability score, information density. All real measurements from the running app.

### 6. Route shell for remaining modules
- `/fleet`, `/fps`, `/space`, `/industry`, `/research`, `/species`, `/ai`, `/engine`, `/knowledge`, `/developer` each get a real landing panel with the appropriate scanner mounted and 2–3 interactive readouts driven by shared math — not lorem ipsum. Deeper gameplay (weapons lineage, galaxy map routing, engine builder scene graph, knowledge graph navigation) is scoped for follow-up prompts.

## Explicitly deferred to future prompts
- WebGL/WebGPU renderer (v1 uses Canvas 2D — hits the "fast, minimal deps, mobile-friendly" bar; WebGPU is a later swap behind the same scanner API)
- Full Engine Builder (scene graph, visual scripting, animation graph)
- Full Knowledge Engine graph navigation
- FPS weapons lineage / Space galaxy routing / Industry manufacturing chains as deep systems
- Fractal + Stream math modules
- Module hot-loading system (v1 uses static TanStack routes; loader abstraction is in place)

## Technical notes
- TanStack Start file-based routes under `src/routes/`.
- Scanner math lives in `src/lib/scanner/` as pure functions; renderer in `src/lib/scanner/renderer.ts`.
- Radial wheel is a single SVG component in `__root.tsx` chrome, so it persists across navigation.
- No backend needed for v1 — everything runs client-side. Lovable Cloud can be added later for persistence (save civilizations, share seeds).

Approve and I'll build it, or tell me which modules to swap in/out of v1 scope.
