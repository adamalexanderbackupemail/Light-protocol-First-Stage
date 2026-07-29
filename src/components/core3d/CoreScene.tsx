import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { STATIONS, CORE_STATION } from "@/lib/core3d/zones";

export interface CoreSceneProps {
  quality: "low" | "medium" | "high";
  paused: boolean;
  onReady: () => void;
  onFps: (fps: number) => void;
  onNear: (id: string | null) => void;
  onActivate: (id: string) => void;
  /** normalized joystick vector for mobile movement */
  moveRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
}

const ROOM_RADIUS = 34;
const CORE_Y = 7;
const STATION_R = 22;

/* ---------------- canvas helpers ---------------- */

function hexStr(color: number) {
  return "#" + color.toString(16).padStart(6, "0");
}

function labelSprite(text: string, sub: string, color: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d")!;
  const hex = hexStr(color);
  g.clearRect(0, 0, c.width, c.height);
  g.font = "600 44px 'JetBrains Mono', monospace";
  g.fillStyle = hex;
  g.textAlign = "center";
  g.fillText(text.toUpperCase(), 256, 62);
  g.font = "400 26px 'JetBrains Mono', monospace";
  g.globalAlpha = 0.7;
  g.fillText(sub.toUpperCase(), 256, 108);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  sprite.scale.set(6, 1.9, 1);
  return sprite;
}

/** Holographic readout panel drawn to a canvas texture. */
function readoutTexture(title: string, rows: Array<[string, string]>, color: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const g = c.getContext("2d")!;
  const hex = hexStr(color);
  g.clearRect(0, 0, c.width, c.height);

  g.strokeStyle = hex;
  g.globalAlpha = 0.35;
  g.lineWidth = 2;
  g.strokeRect(10, 10, c.width - 20, c.height - 20);
  g.globalAlpha = 0.08;
  g.fillStyle = hex;
  g.fillRect(10, 10, c.width - 20, c.height - 20);

  g.globalAlpha = 1;
  g.fillStyle = hex;
  g.font = "600 30px 'JetBrains Mono', monospace";
  g.fillText(title.toUpperCase(), 32, 60);
  g.globalAlpha = 0.35;
  g.fillRect(32, 76, c.width - 64, 2);

  rows.forEach(([k, v], i) => {
    const y = 130 + i * 44;
    g.globalAlpha = 0.55;
    g.font = "400 22px 'JetBrains Mono', monospace";
    g.fillText(k.toUpperCase(), 32, y);
    g.globalAlpha = 1;
    g.font = "600 24px 'JetBrains Mono', monospace";
    g.textAlign = "right";
    g.fillText(v.toUpperCase(), c.width - 32, y);
    g.textAlign = "left";
  });

  // scanline texture
  g.globalAlpha = 0.07;
  for (let y = 0; y < c.height; y += 4) g.fillRect(10, y, c.width - 20, 1);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Abstract telemetry glyph wall panel. */
function wallPanelTexture(seed: number, color: number) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  const hex = hexStr(color);
  const rnd = (n: number) => {
    const s = Math.sin(seed * 91.7 + n * 13.3) * 43758.5453;
    return s - Math.floor(s);
  };
  g.fillStyle = hex;
  g.globalAlpha = 0.06;
  g.fillRect(0, 0, 256, 256);
  g.globalAlpha = 0.5;
  g.strokeStyle = hex;
  g.lineWidth = 1;
  g.strokeRect(6, 6, 244, 244);

  // waveform
  g.beginPath();
  for (let x = 0; x < 244; x += 4) {
    const y = 80 + Math.sin(x * 0.08 + seed) * 22 * rnd(x) - 10;
    x === 0 ? g.moveTo(x + 6, y) : g.lineTo(x + 6, y);
  }
  g.stroke();

  // bars
  for (let i = 0; i < 12; i++) {
    const h = 10 + rnd(i) * 70;
    g.globalAlpha = 0.25 + rnd(i + 40) * 0.4;
    g.fillRect(18 + i * 19, 230 - h, 12, h);
  }
  // text rows
  g.globalAlpha = 0.45;
  g.font = "400 11px 'JetBrains Mono', monospace";
  for (let i = 0; i < 4; i++) {
    g.fillText(`0x${Math.floor(rnd(i + 7) * 0xffffff).toString(16).padStart(6, "0")} :: ok`, 16, 122 + i * 15);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function CoreScene(props: CoreSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const quality = propsRef.current.quality;
    const high = quality === "high";
    const low = quality === "low";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02060a);
    scene.fog = new THREE.FogExp2(0x02060a, 0.014);

    const camera = new THREE.PerspectiveCamera(74, mount.clientWidth / mount.clientHeight, 0.1, 400);
    camera.position.set(-29, 1.7, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: !low, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 2 : 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    mount.appendChild(renderer.domElement);

    // ---------- post processing ----------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    let bloom: UnrealBloomPass | null = null;
    if (!low) {
      bloom = new UnrealBloomPass(
        new THREE.Vector2(mount.clientWidth, mount.clientHeight),
        high ? 0.42 : 0.32,
        0.5,
        0.82,
      );
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());
    composer.setSize(mount.clientWidth, mount.clientHeight);

    /* ---------------- environment ---------------- */

    scene.add(new THREE.AmbientLight(0x1b3548, 0.55));
    const coreLight = new THREE.PointLight(0x8fe6ff, 150, 80, 2);
    coreLight.position.set(0, CORE_Y, 0);
    scene.add(coreLight);
    const rim = new THREE.DirectionalLight(0xbfe9ff, 0.28);
    rim.position.set(10, 24, 10);
    scene.add(rim);
    const underGlow = new THREE.PointLight(0x1f6d8c, 45, 45, 2);
    underGlow.position.set(0, 0.6, 0);
    scene.add(underGlow);

    // reflective floor (mirror on medium/high, matte on low)
    let reflector: Reflector | null = null;
    if (!low) {
      reflector = new Reflector(new THREE.CircleGeometry(ROOM_RADIUS, 96), {
        textureWidth: high ? 1024 : 512,
        textureHeight: high ? 1024 : 512,
        color: 0x0a1a24,
      });
      reflector.rotation.x = -Math.PI / 2;
      reflector.position.y = -0.02;
      scene.add(reflector);
    }
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(ROOM_RADIUS, 96),
      new THREE.MeshStandardMaterial({
        color: 0x060e15,
        roughness: 0.18,
        metalness: 0.95,
        transparent: !low,
        opacity: low ? 1 : 0.62,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.PolarGridHelper(ROOM_RADIUS, 16, 12, 96, 0x1f5f7a, 0x0e2836);
    grid.position.y = 0.03;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    scene.add(grid);

    // inlaid glowing floor circles
    const floorRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const r = 6 + i * 5;
      const m = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.09, 128),
        new THREE.MeshBasicMaterial({ color: 0x39d7ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide }),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.05;
      floorRings.push(m);
      scene.add(m);
    }

    // chamber shell
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(ROOM_RADIUS, ROOM_RADIUS, 26, 96, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x06101a,
        side: THREE.BackSide,
        roughness: 0.35,
        metalness: 0.8,
        emissive: 0x03212e,
        emissiveIntensity: 0.55,
      }),
    );
    wall.position.y = 13;
    scene.add(wall);

    // vertical wall ribs
    const ribs = new THREE.Group();
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 24, 0.5),
        new THREE.MeshStandardMaterial({
          color: 0x0b2634,
          emissive: 0x1a7fa0,
          emissiveIntensity: 0.22,
          metalness: 0.9,
          roughness: 0.3,
        }),
      );
      rib.position.set(Math.cos(a) * (ROOM_RADIUS - 0.3), 12, Math.sin(a) * (ROOM_RADIUS - 0.3));
      rib.lookAt(0, 12, 0);
      ribs.add(rib);
    }
    scene.add(ribs);

    // holographic wall panels
    const wallPanels: THREE.Mesh[] = [];
    const panelCount = low ? 8 : 18;
    for (let i = 0; i < panelCount; i++) {
      const a = (i / panelCount) * Math.PI * 2 + 0.1;
      const accent = [0x39d7ff, 0x7cffd4, 0xb9a8ff, 0xffd68a][i % 4];
      const geo = new THREE.PlaneGeometry(4.2, 2.6);
      const mat = new THREE.MeshBasicMaterial({
        map: wallPanelTexture(i + 1, accent),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const p = new THREE.Mesh(geo, mat);
      const h = 5 + (i % 3) * 4.2;
      p.position.set(Math.cos(a) * (ROOM_RADIUS - 1.6), h, Math.sin(a) * (ROOM_RADIUS - 1.6));
      p.lookAt(0, h, 0);
      wallPanels.push(p);
      scene.add(p);
    }

    // ceiling halo rings
    const ceilingRings = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(ROOM_RADIUS - i * 5, 0.05, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0x2ea8cc, transparent: true, opacity: 0.3 }),
      );
      r.rotation.x = Math.PI / 2;
      r.position.y = 16 + i * 1.1;
      ceilingRings.add(r);
    }
    scene.add(ceilingRings);

    /* ---------------- intelligence nucleus ---------------- */

    const coreGroup = new THREE.Group();
    coreGroup.position.y = CORE_Y;

    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 4),
      new THREE.MeshStandardMaterial({
        color: 0x0ea5c9,
        emissive: 0x6ff0ff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.35,
      }),
    );
    coreGroup.add(nucleus);

    // layered shells
    const shells: THREE.Mesh[] = [];
    const shellSpecs: Array<[number, number, number]> = [
      [3.4, 0x8fe6ff, 0.32],
      [4.3, 0x7cffd4, 0.22],
      [5.2, 0xb9a8ff, 0.16],
    ];
    for (const [r, col, op] of shellSpecs) {
      const s = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, 1),
        new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: op }),
      );
      shells.push(s);
      coreGroup.add(s);
    }

    // gyroscopic rings (thick, tilted)
    const gyros: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Mesh(
        new THREE.TorusGeometry(5.8 + i * 1.15, 0.075, 10, 160),
        new THREE.MeshBasicMaterial({ color: [0x39d7ff, 0x7cffd4, 0xb9a8ff, 0xffd68a][i], transparent: true, opacity: 0.65 }),
      );
      g.rotation.x = Math.PI / 2 + i * 0.42;
      g.rotation.y = i * 0.6;
      gyros.push(g);
      coreGroup.add(g);
    }

    // expanding energy pulses
    const pulses: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.05, 8, 96),
        new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.5 }),
      );
      p.rotation.x = Math.PI / 2;
      p.userData.phase = i / 3;
      pulses.push(p);
      coreGroup.add(p);
    }

    // orbiting status indicators
    const indicators: THREE.Mesh[] = [];
    const indicatorCount = low ? 8 : 14;
    for (let i = 0; i < indicatorCount; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.14, 0.14),
        new THREE.MeshBasicMaterial({ color: i % 5 === 0 ? 0xffd68a : 0x7cffd4, transparent: true, opacity: 0.9 }),
      );
      m.userData.a = (i / indicatorCount) * Math.PI * 2;
      m.userData.r = 7.6;
      m.userData.y = ((i % 5) - 2) * 0.9;
      indicators.push(m);
      coreGroup.add(m);
    }
    scene.add(coreGroup);

    // containment pillar + ceiling beam
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 2.0, CORE_Y, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x1d7f9c,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    pillar.position.y = CORE_Y / 2;
    scene.add(pillar);

    const upBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 0.6, 14, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x39d7ff,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    upBeam.position.y = CORE_Y + 8;
    scene.add(upBeam);

    const coreLabel = labelSprite(CORE_STATION.name, CORE_STATION.code, CORE_STATION.accent);
    coreLabel.position.set(0, CORE_Y + 8.5, 0);
    coreLabel.scale.set(10, 3.1, 1);
    scene.add(coreLabel);

    /* ---------------- gateways (modules) ---------------- */

    interface StationObj {
      id: string;
      pos: THREE.Vector3;
      group: THREE.Group;
      ring: THREE.Mesh;
      arch: THREE.Mesh;
      panel: THREE.Mesh;
      detail: THREE.Group;
      light: THREE.PointLight;
      accent: number;
      proximity: number;
    }
    const stationObjs: StationObj[] = [];

    for (const s of STATIONS) {
      const g = new THREE.Group();
      const x = Math.cos(s.angle) * STATION_R;
      const z = Math.sin(s.angle) * STATION_R;
      g.position.set(x, 0, z);
      g.lookAt(0, 0, 0);

      // platform
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(3.0, 3.4, 0.45, 48),
        new THREE.MeshStandardMaterial({ color: 0x0c1a24, metalness: 0.95, roughness: 0.2 }),
      );
      base.position.y = 0.22;
      g.add(base);

      const glow = new THREE.Mesh(
        new THREE.TorusGeometry(3.05, 0.07, 8, 96),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.65 }),
      );
      glow.rotation.x = Math.PI / 2;
      glow.position.y = 0.5;
      g.add(glow);

      // gateway arch
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(3.1, 0.16, 12, 96, Math.PI),
        new THREE.MeshStandardMaterial({
          color: 0x0b1c26,
          emissive: s.accent,
          emissiveIntensity: 0.5,
          metalness: 0.9,
          roughness: 0.25,
        }),
      );
      arch.position.y = 0.4;
      g.add(arch);

      // gateway membrane
      const membrane = new THREE.Mesh(
        new THREE.CircleGeometry(3.05, 64, 0, Math.PI),
        new THREE.MeshBasicMaterial({
          color: s.accent,
          transparent: true,
          opacity: 0.07,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      membrane.position.y = 0.4;
      g.add(membrane);

      // console
      const console3d = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.85, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x0f1e29, metalness: 0.9, roughness: 0.25 }),
      );
      console3d.position.set(0, 0.9, 1.5);
      console3d.rotation.x = -0.28;
      g.add(console3d);

      // holographic readout panel
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 2.9),
        new THREE.MeshBasicMaterial({
          map: readoutTexture(s.name, s.readouts, s.accent),
          transparent: true,
          opacity: 0.0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
      panel.position.set(0, 4.4, 0);
      panel.scale.setScalar(0.7);
      g.add(panel);

      // progressive detail: side blades revealed on approach
      const detail = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(
          new THREE.PlaneGeometry(1.5, 0.5),
          new THREE.MeshBasicMaterial({
            color: s.accent,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        const side = i % 2 === 0 ? -1 : 1;
        blade.position.set(side * 3.3, 2.0 + Math.floor(i / 2) * 0.85, 0);
        blade.userData.baseX = side * 3.3;
        detail.add(blade);
      }
      detail.scale.setScalar(0.001);
      g.add(detail);

      const label = labelSprite(s.name, s.code, s.accent);
      label.position.set(0, 6.4, 0);
      g.add(label);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 16, 8),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.16, depthWrite: false }),
      );
      beam.position.y = 8;
      g.add(beam);

      const light = new THREE.PointLight(s.accent, 12, 18, 2);
      light.position.set(0, 2.6, 0.6);
      g.add(light);

      scene.add(g);
      stationObjs.push({
        id: s.id,
        pos: new THREE.Vector3(x, 0, z),
        group: g,
        ring: glow,
        arch,
        panel,
        detail,
        light,
        accent: s.accent,
        proximity: 0,
      });
    }

    /* ---------------- energy conduits core <-> gateways ---------------- */

    const conduits: Array<{ curve: THREE.QuadraticBezierCurve3; pts: THREE.Points; offsets: Float32Array; dir: number }> = [];
    const flowPerConduit = low ? 24 : high ? 70 : 44;
    for (const s of stationObjs) {
      const start = new THREE.Vector3(0, CORE_Y, 0);
      const end = new THREE.Vector3(s.pos.x, 4.6, s.pos.z);
      const mid = start.clone().lerp(end, 0.5).setY(CORE_Y + 5.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 40, 0.05, 8, false),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.18, depthWrite: false }),
      );
      scene.add(tube);

      const arr = new Float32Array(flowPerConduit * 3);
      const offsets = new Float32Array(flowPerConduit);
      for (let i = 0; i < flowPerConduit; i++) offsets[i] = Math.random();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: s.accent,
          size: 0.22,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      scene.add(pts);
      conduits.push({ curve, pts, offsets, dir: Math.random() > 0.5 ? 1 : -1 });
    }

    /* ---------------- atmosphere particles ---------------- */

    const pCount = low ? 700 : high ? 4200 : 2000;
    const pos = new Float32Array(pCount * 3);
    const seeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * (ROOM_RADIUS - 6);
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x9fe8ff,
        size: 0.075,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(particles);

    /* ---------------- controls ---------------- */

    const keys = new Set<string>();
    let yaw = -1.31;
    let pitch = 0;
    const velocity = new THREE.Vector3();
    let nearId: string | null = null;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.code);
      if (e.code === "KeyE" && nearId) propsRef.current.onActivate(nearId);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== renderer.domElement) return;
      yaw -= e.movementX * 0.0022;
      pitch = Math.max(-1.2, Math.min(1.2, pitch - e.movementY * 0.0022));
    };
    const requestLock = () => renderer.domElement.requestPointerLock?.();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", requestLock);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      composer.setSize(mount.clientWidth, mount.clientHeight);
      bloom?.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    /* ---------------- loop ---------------- */

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let frames = 0;
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      frames++;
      acc += dt;
      if (acc >= 0.5) {
        propsRef.current.onFps(Math.round(frames / acc));
        frames = 0;
        acc = 0;
      }
      if (propsRef.current.paused) {
        composer.render();
        return;
      }
      const t = now * 0.001;

      // look (touch)
      const look = propsRef.current.lookRef.current;
      if (look.x || look.y) {
        yaw -= look.x * 0.0035;
        pitch = Math.max(-1.2, Math.min(1.2, pitch - look.y * 0.0035));
        look.x = 0;
        look.y = 0;
      }

      // movement
      forward.set(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(-1);
      right.set(-forward.z, 0, forward.x);
      const joy = propsRef.current.moveRef.current;
      let fwd = joy.y;
      let str = joy.x;
      if (keys.has("KeyW") || keys.has("ArrowUp")) fwd += 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) fwd -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) str += 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) str -= 1;
      const sprint = keys.has("ShiftLeft") ? 2 : 1;
      dir.set(0, 0, 0).addScaledVector(forward, fwd).addScaledVector(right, str);
      if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(9 * sprint);
      velocity.lerp(dir, 1 - Math.pow(0.0009, dt));
      camera.position.addScaledVector(velocity, dt);

      // collisions: room shell, core pedestal, gateway platforms
      const flat = new THREE.Vector2(camera.position.x, camera.position.z);
      if (flat.length() > ROOM_RADIUS - 1.5) {
        flat.setLength(ROOM_RADIUS - 1.5);
        camera.position.x = flat.x;
        camera.position.z = flat.y;
      }
      if (flat.length() < 3.2) {
        flat.setLength(3.2);
        camera.position.x = flat.x;
        camera.position.z = flat.y;
      }
      for (const s of stationObjs) {
        tmp.set(camera.position.x - s.pos.x, 0, camera.position.z - s.pos.z);
        const d = tmp.length();
        if (d < 3.4) {
          tmp.setLength(3.4);
          camera.position.x = s.pos.x + tmp.x;
          camera.position.z = s.pos.z + tmp.z;
        }
      }

      // head bob + subtle idle breathing
      const speed = Math.min(velocity.length(), 18);
      camera.position.y = 1.7 + Math.sin(t * 8) * speed * 0.005 + Math.sin(t * 0.7) * 0.035;

      camera.rotation.set(0, 0, 0);
      camera.rotateY(yaw + Math.sin(t * 0.23) * 0.004);
      camera.rotateX(pitch + Math.sin(t * 0.31) * 0.003);
      camera.rotateZ(Math.sin(t * 0.19) * 0.005 - velocity.dot(right) * 0.0016);

      /* ----- nucleus ----- */
      const beat = Math.sin(t * 1.5);
      nucleus.rotation.y = t * 0.22;
      nucleus.rotation.x = Math.sin(t * 0.3) * 0.2;
      nucleus.scale.setScalar(1 + beat * 0.06);
      (nucleus.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.35 + beat * 0.45;
      shells.forEach((s, i) => {
        s.rotation.y = t * (0.1 + i * 0.07) * (i % 2 ? -1 : 1);
        s.rotation.x = t * 0.05 * (i + 1);
        s.scale.setScalar(1 + Math.sin(t * 1.1 + i) * 0.03);
      });
      gyros.forEach((g, i) => {
        g.rotation.z = t * (0.35 + i * 0.16) * (i % 2 ? -1 : 1);
        g.rotation.y = t * 0.14 * (i + 1);
      });
      pulses.forEach((p) => {
        const k = ((t * 0.35 + p.userData.phase) % 1);
        p.scale.setScalar(1 + k * 10);
        (p.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k);
      });
      indicators.forEach((m, i) => {
        const a = m.userData.a + t * 0.35 * (i % 2 ? 1 : -1);
        m.position.set(Math.cos(a) * m.userData.r, m.userData.y + Math.sin(t + i) * 0.25, Math.sin(a) * m.userData.r);
        m.lookAt(0, m.position.y, 0);
        (m.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.abs(Math.sin(t * 2 + i)) * 0.65;
      });
      coreLight.intensity = 130 + beat * 45;
      underGlow.intensity = 38 + beat * 14;
      upBeam.rotation.y = t * 0.1;
      (upBeam.material as THREE.MeshBasicMaterial).opacity = 0.07 + Math.abs(beat) * 0.05;
      ceilingRings.rotation.y = t * 0.03;
      floorRings.forEach((r, i) => {
        (r.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.abs(Math.sin(t * 1.2 - i * 0.7)) * 0.28;
      });
      wallPanels.forEach((p, i) => {
        (p.material as THREE.MeshBasicMaterial).opacity = 0.28 + Math.abs(Math.sin(t * 0.8 + i * 0.5)) * 0.3;
      });

      /* ----- conduits ----- */
      for (const c of conduits) {
        const arr = c.pts.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < c.offsets.length; i++) {
          c.offsets[i] += dt * 0.22;
          if (c.offsets[i] > 1) c.offsets[i] -= 1;
          const u = c.dir > 0 ? c.offsets[i] : 1 - c.offsets[i];
          c.curve.getPoint(u, tmp);
          arr[i * 3] = tmp.x;
          arr[i * 3 + 1] = tmp.y;
          arr[i * 3 + 2] = tmp.z;
        }
        c.pts.geometry.attributes.position.needsUpdate = true;
      }

      /* ----- atmosphere ----- */
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const iy = i * 3 + 1;
        arr[iy] += (0.3 + seeds[i]) * dt * 1.4;
        if (arr[iy] > 20) arr[iy] = 0;
        const ang = 0.1 * dt * (0.4 + seeds[i]);
        const x = arr[i * 3];
        const z = arr[i * 3 + 2];
        arr[i * 3] = x * Math.cos(ang) - z * Math.sin(ang);
        arr[i * 3 + 2] = x * Math.sin(ang) + z * Math.cos(ang);
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.005;

      /* ----- gateways: proximity + progressive reveal ----- */
      let closest: string | null = null;
      let closestD = 8.5;
      for (const s of stationObjs) {
        const d = s.pos.distanceTo(camera.position);
        if (d < closestD) {
          closestD = d;
          closest = s.id;
        }
        // 0 far -> 1 near
        const target = THREE.MathUtils.clamp(1 - (d - 5) / 9, 0, 1);
        s.proximity += (target - s.proximity) * (1 - Math.pow(0.002, dt));
        const k = s.proximity;

        s.ring.rotation.z = t * (0.4 + k * 1.6);
        (s.ring.material as THREE.MeshBasicMaterial).opacity = 0.4 + k * (0.3 + Math.sin(t * 5) * 0.25);
        (s.arch.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + k * 1.1;
        s.light.intensity = 10 + k * 26;

        const pm = s.panel.material as THREE.MeshBasicMaterial;
        pm.opacity = k * 0.95;
        s.panel.scale.setScalar(0.7 + k * 0.42);
        s.panel.position.y = 4.4 + Math.sin(t * 1.2 + s.pos.x) * 0.12 + k * 0.3;
        s.panel.lookAt(camera.position);

        s.detail.scale.setScalar(Math.max(0.001, k));
        s.detail.children.forEach((b, i) => {
          const base = (b as THREE.Mesh).userData.baseX as number;
          b.position.x = base * (0.6 + k * 0.55);
          ((b as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
            k * (0.2 + Math.abs(Math.sin(t * 2.2 + i)) * 0.45);
        });
      }
      const coreDist = new THREE.Vector2(camera.position.x, camera.position.z).length();
      if (!closest && coreDist < 9) closest = "core";
      if (closest !== nearId) {
        nearId = closest;
        propsRef.current.onNear(nearId);
      }

      composer.render();
    };
    raf = requestAnimationFrame(loop);
    propsRef.current.onReady();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", requestLock);
      document.exitPointerLock?.();
      reflector?.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.quality]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
