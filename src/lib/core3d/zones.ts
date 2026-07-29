// Browser-safe station data shared by the 3D scene and the HUD.
export interface Station {
  id: string;
  code: string;
  name: string;
  angle: number; // radians around the core
  accent: number; // hex color
  summary: string;
  readouts: Array<[string, string]>;
  actions: string[];
}

export const STATIONS: Station[] = [
  {
    id: "arrival",
    code: "ARV·00",
    name: "Arrival Zone",
    angle: Math.PI,
    accent: 0x9fe8ff,
    summary:
      "Entry vestibule of the LIGHT facility. Orientation manifest, atmosphere handshake and identity binding for the operator.",
    readouts: [
      ["Atmosphere", "nominal"],
      ["Gravity", "0.98 g"],
      ["Operator", "unbound"],
      ["Session", "genesis"],
    ],
    actions: ["Bind operator identity", "Play orientation sequence"],
  },
  {
    id: "vision",
    code: "VIS·01",
    name: "Vision Laboratory",
    angle: -Math.PI / 2,
    accent: 0x7cffd4,
    summary:
      "Converts unclear concepts into structured designs. Input a fragment, receive a resolved geometry, lineage and manufacturing route.",
    readouts: [
      ["Resolution", "0.94"],
      ["Concepts", "1,204"],
      ["Latency", "3.1 ms"],
      ["Engine", "VIS-7"],
    ],
    actions: ["Input concept fragment", "Render transformation"],
  },
  {
    id: "simulation",
    code: "SIM·02",
    name: "Simulation Chamber",
    angle: -Math.PI / 6,
    accent: 0xffd68a,
    summary:
      "Launches virtual prototypes into a physics envelope. Engineering runs stream back as living environments you can walk through.",
    readouts: [
      ["Solvers", "12"],
      ["Timestep", "4 ms"],
      ["Prototypes", "38"],
      ["Stability", "green"],
    ],
    actions: ["Launch prototype", "Open physics envelope"],
  },
  {
    id: "knowledge",
    code: "KNW·03",
    name: "Knowledge Archive",
    angle: Math.PI / 6,
    accent: 0xb9a8ff,
    summary:
      "A three-dimensional knowledge graph. Every concept is navigable: history, research, mechanics, implementation, verification.",
    readouts: [
      ["Nodes", "48,210"],
      ["Edges", "212,904"],
      ["Depth", "12"],
      ["Compression", "78.4%"],
    ],
    actions: ["Traverse graph", "Trace lineage"],
  },
  {
    id: "creation",
    code: "CRT·04",
    name: "Creation Workshop",
    angle: Math.PI / 2,
    accent: 0xff9d7a,
    summary:
      "Turns concepts into build plans. Bill of materials, tolerances, fabrication order and verification checklist emitted as one artifact.",
    readouts: [
      ["Queue", "6"],
      ["Foundries", "3"],
      ["Yield", "96.2%"],
      ["Plans", "412"],
    ],
    actions: ["Emit build plan", "Queue fabrication"],
  },
];

export const CORE_STATION: Station = {
  id: "core",
  code: "COR·Ω",
  name: "Intelligence Core",
  angle: 0,
  accent: 0x9fe8ff,
  summary:
    "The central energy structure of LIGHT Ω. All modules draw substrate from here; all knowledge returns here for compression.",
  readouts: [
    ["Tier", "T7"],
    ["Throughput", "48.2 B/s"],
    ["Coherence", "0.991"],
    ["Uptime", "∞"],
  ],
  actions: ["Inspect substrate", "Open runtime diagnostics"],
};
