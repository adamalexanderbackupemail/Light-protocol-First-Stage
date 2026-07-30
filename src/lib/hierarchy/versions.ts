// ============================================================
// LIGHT Ω — Upgradable Computer Hierarchy
// Version ladder v1 → v10, one release per year, with a
// ~1.33x compute increase compounding each year.
// Hierarchy descriptors use the LPX 50/30/20 model:
//   50 = structural identity (what the thing IS)
//   30 = functional behaviour (what it DOES)
//   20 = micro instruction   (how it EXECUTES per frame)
// ============================================================

export const COMPUTE_GROWTH = 1.33; // a third more processing power per year
export const BASE_YEAR = 2026;

export type RenderStack =
  | "CANVAS2D"
  | "WEBGL1"
  | "WEBGL2"
  | "WEBGL2+POST"
  | "WEBGPU"
  | "WEBGPU+CLUSTER"
  | "WEBGPU+RT"
  | "WEBGPU+RT+ML"
  | "NEURAL-HYBRID"
  | "CONTINUOUS";

export interface Hierarchy503020 {
  "50": string;
  "30": string;
  "20": string;
}

export interface RenderBudget {
  triangles: string;
  drawCalls: string;
  lights: string;
  particles: string;
  resolution: string;
  frame: string; // frame budget target
}

export interface VersionSpec {
  v: number;
  code: string;
  name: string;
  year: number;
  compute: number; // relative to v1 = 1.00
  stack: RenderStack;
  storyStage: string;
  storyBeat: string;
  renderLeap: string;
  budget: RenderBudget;
  unlocks: string[];
  hierarchy: Hierarchy503020;
}

const budget = (
  triangles: string,
  drawCalls: string,
  lights: string,
  particles: string,
  resolution: string,
  frame: string,
): RenderBudget => ({ triangles, drawCalls, lights, particles, resolution, frame });

export const VERSIONS: VersionSpec[] = [
  {
    v: 1,
    code: "Ω·I",
    name: "Genesis Shell",
    year: BASE_YEAR,
    compute: 1,
    stack: "CANVAS2D",
    storyStage: "The instrument is switched on",
    storyBeat:
      "LIGHT exists only as a readout. An operator reads telemetry from a facility they cannot yet enter. Every module is a panel, every panel a promise.",
    renderLeap: "2D immediate-mode scanners, deterministic math, no GPU dependency.",
    budget: budget("—", "—", "0", "2 k", "1x CSS px", "16.6 ms"),
    unlocks: ["Scanner math library", "Module shells", "Runtime diagnostics"],
    hierarchy: {
      "50": "A flat instrument panel — surfaces, dividers, readouts.",
      "30": "Pure functions map a parameter set to a canvas draw call.",
      "20": "requestAnimationFrame → delta time → path stroke → present.",
    },
  },
  {
    v: 2,
    code: "Ω·II",
    name: "Core Chamber",
    year: BASE_YEAR + 1,
    compute: 1.33,
    stack: "WEBGL1",
    storyStage: "The operator steps inside",
    storyBeat:
      "The readout becomes a room. A nucleus is instantiated at the centre of the facility and the operator is given a body, a stride and a line of sight.",
    renderLeap: "Real-time 3D, forward shading, emissive nucleus, first-person camera.",
    budget: budget("120 k", "180", "4", "6 k", "1.0x DPR", "16.6 ms"),
    unlocks: ["First-person locomotion", "Station proximity", "Holographic panels"],
    hierarchy: {
      "50": "A cylindrical chamber with a nucleus and five gateways.",
      "30": "Proximity resolves the nearest station and arms an activation.",
      "20": "Per-frame: input vector → collide → integrate → cull → draw.",
    },
  },
  {
    v: 3,
    code: "Ω·III",
    name: "Living Facility",
    year: BASE_YEAR + 2,
    compute: 1.77,
    stack: "WEBGL2",
    storyStage: "The facility starts breathing",
    storyBeat:
      "Conduits carry charge between the nucleus and the gateways. Telemetry walls animate on their own schedule. The building behaves as if it is running something.",
    renderLeap: "Instanced geometry, floor reflections, bloom, tone-mapped HDR.",
    budget: budget("450 k", "320", "12", "20 k", "1.25x DPR", "16.6 ms"),
    unlocks: ["Energy conduits", "Reflective plate floor", "Ambient particle drift", "Quality tiers"],
    hierarchy: {
      "50": "A power topology: source, conduits, five sinks, one return path.",
      "30": "Charge is produced at the nucleus and consumed by station demand.",
      "20": "Instanced transform buffer updated once, drawn in a single call.",
    },
  },
  {
    v: 4,
    code: "Ω·IV",
    name: "Resident Systems",
    year: BASE_YEAR + 3,
    compute: 2.35,
    stack: "WEBGL2+POST",
    storyStage: "The rooms gain purpose",
    storyBeat:
      "Each gateway opens into a working chamber. Vision resolves fragments into geometry. Simulation runs a physics envelope. Knowledge is walkable. Creation emits a plan.",
    renderLeap: "Deferred-style post chain: SSAO, motion blur, depth-of-field, colour grading.",
    budget: budget("1.2 M", "600", "32", "60 k", "1.5x DPR", "16.6 ms"),
    unlocks: ["Interior chambers", "Persistent station state", "Object manipulation", "Save slots"],
    hierarchy: {
      "50": "Five subsystems, each with its own volume, dataset and rules.",
      "30": "A station consumes an input artifact and returns a derived artifact.",
      "20": "Job queue → worker tick → artifact diff → scene patch.",
    },
  },
  {
    v: 5,
    code: "Ω·V",
    name: "Compute Substrate",
    year: BASE_YEAR + 4,
    compute: 3.13,
    stack: "WEBGPU",
    storyStage: "The machine gets its own hands",
    storyBeat:
      "The facility stops asking the CPU for permission. Simulation, particles and knowledge layout are solved on the GPU while the operator watches it happen.",
    renderLeap: "WebGPU compute passes, GPU particles, GPU-driven layout, persistent buffers.",
    budget: budget("4 M", "1.2 k", "128", "500 k", "1.75x DPR", "11.1 ms · 90 fps"),
    unlocks: ["Compute shaders", "GPU physics", "Force-directed knowledge graph at scale"],
    hierarchy: {
      "50": "A substrate: buffers that outlive frames and belong to no single view.",
      "30": "State advances on the device; the CPU only issues intent.",
      "20": "dispatchWorkgroups → storage buffer swap → indirect draw.",
    },
  },
  {
    v: 6,
    code: "Ω·VI",
    name: "Clustered World",
    year: BASE_YEAR + 5,
    compute: 4.16,
    stack: "WEBGPU+CLUSTER",
    storyStage: "The facility becomes a district",
    storyBeat:
      "Beyond the core chamber there are corridors, foundries, archives and launch bays. The map no longer fits in view and streaming becomes part of the story.",
    renderLeap: "Cluster/meshlet culling, virtual geometry, streaming LOD, occlusion queries.",
    budget: budget("40 M (virtual)", "indirect", "1 k", "2 M", "2x DPR", "11.1 ms"),
    unlocks: ["Streamed districts", "Virtual geometry", "Seamless interior/exterior", "Fast travel"],
    hierarchy: {
      "50": "A district graph of volumes connected by traversable seams.",
      "30": "Volumes page in and out against a residency budget, never a load screen.",
      "20": "Visibility buffer → meshlet cull → material pass → resolve.",
    },
  },
  {
    v: 7,
    code: "Ω·VII",
    name: "Traced Light",
    year: BASE_YEAR + 6,
    compute: 5.54,
    stack: "WEBGPU+RT",
    storyStage: "Light stops being decoration",
    storyBeat:
      "The nucleus lights the room truthfully. Holograms cast real bounce onto plate steel, and reading a surface tells you what the facility is doing.",
    renderLeap: "Hardware ray queries: reflections, soft shadows, one-bounce global illumination.",
    budget: budget("60 M (virtual)", "indirect", "unbounded", "4 M", "2x DPR + upscale", "8.3 ms · 120 fps"),
    unlocks: ["Ray-traced reflections", "Dynamic global illumination", "Volumetric atmosphere"],
    hierarchy: {
      "50": "An acceleration structure that mirrors the district every frame.",
      "30": "Rays sample the same world the physics solver uses — one truth.",
      "20": "BLAS refit → TLAS build → ray query → temporal denoise → accumulate.",
    },
  },
  {
    v: 8,
    code: "Ω·VIII",
    name: "Learned Frame",
    year: BASE_YEAR + 7,
    compute: 7.36,
    stack: "WEBGPU+RT+ML",
    storyStage: "The system predicts the operator",
    storyBeat:
      "The facility renders what you are about to look at. Stations pre-solve the artifact you were going to ask for, and the latency between intent and result collapses.",
    renderLeap: "On-device inference: neural upscaling, frame extrapolation, learned denoise.",
    budget: budget("120 M (virtual)", "indirect", "unbounded", "12 M", "4K reconstructed", "6.9 ms · 144 fps"),
    unlocks: ["Neural upscaling", "Predictive prefetch", "Agentic station operators", "Voice intent"],
    hierarchy: {
      "50": "A model sitting between the world state and the framebuffer.",
      "30": "Prediction fills the gap the renderer has no time to compute.",
      "20": "History reproject → inference pass → confidence blend → present.",
    },
  },
  {
    v: 9,
    code: "Ω·IX",
    name: "Shared Continuum",
    year: BASE_YEAR + 8,
    compute: 9.79,
    stack: "NEURAL-HYBRID",
    storyStage: "Other operators arrive",
    storyBeat:
      "LIGHT becomes a place with a population. Artifacts made in one facility appear in another, forked and improved. Civilisation index becomes a live number.",
    renderLeap: "Hybrid local/remote rendering, authoritative world state, deterministic replay.",
    budget: budget("unbounded (streamed)", "indirect", "unbounded", "40 M", "adaptive 4K–8K", "6.9 ms"),
    unlocks: ["Multi-operator presence", "Artifact exchange", "Forking and lineage", "Persistent civilisation"],
    hierarchy: {
      "50": "A continuum: one world, many viewpoints, one authoritative timeline.",
      "30": "Local prediction reconciles against a shared authoritative tick.",
      "20": "Snapshot delta → rollback → resimulate → reconcile → render.",
    },
  },
  {
    v: 10,
    code: "Ω·X",
    name: "Continuous LIGHT",
    year: BASE_YEAR + 9,
    compute: 13.03,
    stack: "CONTINUOUS",
    storyStage: "The instrument disappears",
    storyBeat:
      "There is no longer a version to load. LIGHT runs continuously, compiles its own modules, and the operator's request becomes a fabricable artifact in the real world.",
    renderLeap: "Resolution-independent continuous rendering; the frame is a query, not a build.",
    budget: budget("resolution-independent", "resolved", "physical", "continuous", "device-native", "sub-frame"),
    unlocks: ["Self-authoring modules", "Real-world fabrication output", "Always-on world", "Full knowledge compression"],
    hierarchy: {
      "50": "A system whose structure is data, editable while it runs.",
      "30": "The world rewrites its own module graph in response to demand.",
      "20": "Intent → module synthesis → hot-swap → verify → continue.",
    },
  },
];

// ------------------------------------------------------------
// Subsystem hierarchy — every branch carries the version it
// becomes real in, so the tree reads as an upgrade path.
// ------------------------------------------------------------

export interface SystemNode {
  id: string;
  code: string;
  label: string;
  since: number; // version it lands in
  hierarchy: Hierarchy503020;
  children?: SystemNode[];
}

export const SYSTEM_TREE: SystemNode[] = [
  {
    id: "core",
    code: "COR·Ω",
    label: "Intelligence Core",
    since: 2,
    hierarchy: {
      "50": "The central energy structure. Everything draws substrate from here.",
      "30": "Produces compute, compresses returning knowledge, sets the tick rate.",
      "20": "pulse(t) → distribute(demand) → absorb(artifacts) → coherence check.",
    },
    children: [
      {
        id: "core.nucleus",
        code: "NUC·01",
        label: "Nucleus",
        since: 2,
        hierarchy: {
          "50": "Emissive icosahedral mass inside three wireframe containment shells.",
          "30": "Brightness tracks live load; shells counter-rotate with throughput.",
          "20": "scale = 1 + 0.04·sin(2πft); emissive = base + load·gain.",
        },
      },
      {
        id: "core.conduits",
        code: "CND·02",
        label: "Energy Conduits",
        since: 3,
        hierarchy: {
          "50": "Curved tubes binding the nucleus to every gateway platform.",
          "30": "Carry charge outward and artifacts inward along the same spline.",
          "20": "u += speed·dt; sample curve; write instance matrix.",
        },
      },
      {
        id: "core.substrate",
        code: "SUB·03",
        label: "Compute Substrate",
        since: 5,
        hierarchy: {
          "50": "Device-resident buffers that persist between frames and views.",
          "30": "Holds simulation, particle and layout state without CPU round-trips.",
          "20": "dispatch → ping-pong storage buffers → indirect draw args.",
        },
      },
      {
        id: "core.model",
        code: "MDL·04",
        label: "Predictive Model",
        since: 8,
        hierarchy: {
          "50": "An inference layer between world state and presented frame.",
          "30": "Extrapolates frames and pre-solves the operator's next request.",
          "20": "reproject history → infer → blend on confidence → present.",
        },
      },
    ],
  },
  {
    id: "vision",
    code: "VIS·01",
    label: "Vision Laboratory",
    since: 4,
    hierarchy: {
      "50": "The chamber that converts unclear concepts into structured designs.",
      "30": "Takes a fragment, returns geometry, lineage and a manufacturing route.",
      "20": "parse fragment → resolve constraints → emit mesh + lineage record.",
    },
    children: [
      {
        id: "vision.resolver",
        code: "VIS·R",
        label: "Concept Resolver",
        since: 4,
        hierarchy: {
          "50": "A constraint solver over an ambiguous description.",
          "30": "Raises resolution score until the design is unambiguous.",
          "20": "score = satisfied / total; iterate until Δscore < ε.",
        },
      },
      {
        id: "vision.lineage",
        code: "VIS·L",
        label: "Design Lineage",
        since: 6,
        hierarchy: {
          "50": "A directed history of every version a design has ever had.",
          "30": "Any artifact can be traced back to the fragment that started it.",
          "20": "append(parentHash, diff) → recompute content hash.",
        },
      },
    ],
  },
  {
    id: "simulation",
    code: "SIM·02",
    label: "Simulation Chamber",
    since: 4,
    hierarchy: {
      "50": "A physics envelope large enough to walk inside while it runs.",
      "30": "Launches prototypes and streams the run back as a living environment.",
      "20": "substep(4 ms) → solve constraints → integrate → publish state.",
    },
    children: [
      {
        id: "simulation.solvers",
        code: "SIM·S",
        label: "Solver Bank",
        since: 4,
        hierarchy: {
          "50": "Twelve independent solvers sharing one timestep.",
          "30": "Rigid, soft, fluid and thermal domains advance in lockstep.",
          "20": "for each solver: prepare → iterate(n) → write to shared state.",
        },
      },
      {
        id: "simulation.gpu",
        code: "SIM·G",
        label: "GPU Physics",
        since: 5,
        hierarchy: {
          "50": "The solver bank relocated onto the compute substrate.",
          "30": "Particle and body counts scale with device, not with CPU cores.",
          "20": "compute pass per domain → barrier → read back only summaries.",
        },
      },
    ],
  },
  {
    id: "knowledge",
    code: "KNW·03",
    label: "Knowledge Archive",
    since: 4,
    hierarchy: {
      "50": "A three-dimensional graph of every concept the system holds.",
      "30": "Each node exposes history, research, mechanics and verification.",
      "20": "layout force step → cull by depth → draw instanced nodes + edges.",
    },
    children: [
      {
        id: "knowledge.graph",
        code: "KNW·G",
        label: "Graph Layout",
        since: 5,
        hierarchy: {
          "50": "Force-directed positions for hundreds of thousands of nodes.",
          "30": "Relationships find their own geometry; clusters emerge, not authored.",
          "20": "repulse (Barnes-Hut) + attract (edges) + damp → integrate.",
        },
      },
      {
        id: "knowledge.compression",
        code: "KNW·C",
        label: "Compression",
        since: 9,
        hierarchy: {
          "50": "The ratio between what is stored and what can be regenerated.",
          "30": "Repeated structure is replaced by the rule that produces it.",
          "20": "detect motif → replace with generator → verify reconstruction.",
        },
      },
    ],
  },
  {
    id: "creation",
    code: "CRT·04",
    label: "Creation Workshop",
    since: 4,
    hierarchy: {
      "50": "Where concepts become build plans with tolerances and an order.",
      "30": "Emits bill of materials, fabrication order and verification checklist.",
      "20": "resolve design → cost materials → order operations → sign artifact.",
    },
    children: [
      {
        id: "creation.plan",
        code: "CRT·P",
        label: "Build Plan Emitter",
        since: 4,
        hierarchy: {
          "50": "One artifact containing everything needed to make the thing.",
          "30": "Nothing ships without a checklist that can fail the build.",
          "20": "for each op: emit(step, tolerance, verify) → hash → seal.",
        },
      },
      {
        id: "creation.fab",
        code: "CRT·F",
        label: "Fabrication Bridge",
        since: 10,
        hierarchy: {
          "50": "The seam between the simulated facility and physical machines.",
          "30": "A verified plan leaves the system as machine instructions.",
          "20": "plan → post-process → queue → telemetry return → close loop.",
        },
      },
    ],
  },
  {
    id: "renderer",
    code: "RND·Ω",
    label: "Render Pipeline",
    since: 1,
    hierarchy: {
      "50": "The path from world state to the pixels the operator sees.",
      "30": "Swaps backend per version without any module rewriting itself.",
      "20": "cull → shade → post → present, inside the frame budget.",
    },
    children: [
      {
        id: "renderer.raster",
        code: "RND·R",
        label: "Raster Path",
        since: 2,
        hierarchy: {
          "50": "Triangles, instancing and a reflective ground plane.",
          "30": "Carries the whole image until ray queries are affordable.",
          "20": "frustum cull → sort by material → instanced draw.",
        },
      },
      {
        id: "renderer.post",
        code: "RND·P",
        label: "Post Chain",
        since: 3,
        hierarchy: {
          "50": "Bloom, occlusion, grading and tone mapping over the raster result.",
          "30": "Gives the nucleus its glow and the plate steel its depth.",
          "20": "downsample → blur pyramid → composite → ACES → output.",
        },
      },
      {
        id: "renderer.rt",
        code: "RND·T",
        label: "Ray Path",
        since: 7,
        hierarchy: {
          "50": "An acceleration structure rebuilt against the live district.",
          "30": "Reflections, shadows and bounce sample the same world as physics.",
          "20": "BLAS refit → TLAS → ray query → denoise → accumulate.",
        },
      },
      {
        id: "renderer.neural",
        code: "RND·N",
        label: "Neural Path",
        since: 8,
        hierarchy: {
          "50": "A learned reconstruction sitting at the end of the pipeline.",
          "30": "Renders fewer real pixels and infers the rest without visible cost.",
          "20": "render at 0.5x → infer upscale → temporal stabilise → present.",
        },
      },
    ],
  },
  {
    id: "network",
    code: "NET·Ω",
    label: "Continuum Network",
    since: 9,
    hierarchy: {
      "50": "The shared world layer that connects separate facilities.",
      "30": "Artifacts, forks and civilisation index move between operators.",
      "20": "snapshot delta → rollback → resimulate → reconcile.",
    },
    children: [
      {
        id: "network.presence",
        code: "NET·P",
        label: "Operator Presence",
        since: 9,
        hierarchy: {
          "50": "Other operators rendered as first-class entities in the facility.",
          "30": "Presence is authoritative; you can be stood next to.",
          "20": "interpolate remote transforms at tick-1, extrapolate on loss.",
        },
      },
      {
        id: "network.exchange",
        code: "NET·X",
        label: "Artifact Exchange",
        since: 9,
        hierarchy: {
          "50": "A registry of every artifact any facility has ever sealed.",
          "30": "Forking an artifact credits its lineage automatically.",
          "20": "publish(hash, lineage) → index → resolve on demand.",
        },
      },
    ],
  },
];

// ------------------------------------------------------------
// Derived helpers
// ------------------------------------------------------------

export function computeAt(v: number) {
  return Math.pow(COMPUTE_GROWTH, v - 1);
}

/** Rough scale of what the frame budget can hold, relative to v1. */
export function frameCapacity(v: number) {
  const spec = VERSIONS[v - 1];
  const parallel = spec.v >= 5 ? 6 : spec.v >= 2 ? 2 : 1; // GPU-side multiplier
  return computeAt(v) * parallel;
}

export function versionsUpTo(v: number) {
  return VERSIONS.filter((s) => s.v <= v);
}

export function flattenTree(nodes: SystemNode[], depth = 0): Array<SystemNode & { depth: number }> {
  return nodes.flatMap((n) => [
    { ...n, depth },
    ...(n.children ? flattenTree(n.children, depth + 1) : []),
  ]);
}
