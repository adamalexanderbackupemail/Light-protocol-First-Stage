import { useEffect, useRef } from "react";
import * as THREE from "three";
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

const ROOM_RADIUS = 30;

function labelSprite(text: string, sub: string, color: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d")!;
  const hex = "#" + color.toString(16).padStart(6, "0");
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
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(6, 1.9, 1);
  return sprite;
}

export default function CoreScene(props: CoreSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const quality = propsRef.current.quality;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03070c);
    scene.fog = new THREE.FogExp2(0x03070c, 0.022);

    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 1.7, 20);

    const renderer = new THREE.WebGLRenderer({
      antialias: quality !== "low",
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.25));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ---------- environment ----------
    scene.add(new THREE.AmbientLight(0x2a4a66, 1.1));
    const coreLight = new THREE.PointLight(0x8fe6ff, 260, 90, 2);
    coreLight.position.set(0, 6, 0);
    scene.add(coreLight);
    const rim = new THREE.DirectionalLight(0xbfe9ff, 0.5);
    rim.position.set(10, 20, 10);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(ROOM_RADIUS, 96),
      new THREE.MeshStandardMaterial({ color: 0x0a121a, roughness: 0.25, metalness: 0.85 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.PolarGridHelper(ROOM_RADIUS, 16, 10, 96, 0x1d4f66, 0x123241);
    grid.position.y = 0.02;
    scene.add(grid);

    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(ROOM_RADIUS, ROOM_RADIUS, 22, 96, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x081420,
        side: THREE.BackSide,
        roughness: 0.4,
        metalness: 0.7,
        emissive: 0x04202c,
        emissiveIntensity: 0.6,
      }),
    );
    wall.position.y = 11;
    scene.add(wall);

    const ceilingRings = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(ROOM_RADIUS - i * 4.5, 0.05, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0x2ea8cc, transparent: true, opacity: 0.35 }),
      );
      r.rotation.x = Math.PI / 2;
      r.position.y = 14 + i * 0.9;
      ceilingRings.add(r);
    }
    scene.add(ceilingRings);

    // ---------- intelligence core ----------
    const coreGroup = new THREE.Group();
    const coreSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.2, 3),
      new THREE.MeshStandardMaterial({
        color: 0x0ea5c9,
        emissive: 0x39d7ff,
        emissiveIntensity: 2.4,
        roughness: 0.15,
        metalness: 0.4,
      }),
    );
    coreSphere.position.y = 6;
    coreGroup.add(coreSphere);

    const coreCage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(4.4, 1),
      new THREE.MeshBasicMaterial({ color: 0x8fe6ff, wireframe: true, transparent: true, opacity: 0.35 }),
    );
    coreCage.position.y = 6;
    coreGroup.add(coreCage);

    const halos: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const h = new THREE.Mesh(
        new THREE.TorusGeometry(5.6 + i * 1.4, 0.06, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0x7cffd4, transparent: true, opacity: 0.5 }),
      );
      h.position.y = 6;
      h.rotation.x = Math.PI / 2 + i * 0.5;
      halos.push(h);
      coreGroup.add(h);
    }

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 1.6, 12, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x1d7f9c, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
    );
    pillar.position.y = 0;
    coreGroup.add(pillar);
    scene.add(coreGroup);

    // ---------- data stream particles ----------
    const pCount = quality === "low" ? 500 : quality === "medium" ? 1600 : 3200;
    const pos = new Float32Array(pCount * 3);
    const seeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * (ROOM_RADIUS - 6);
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * 16;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x9fe8ff,
        size: 0.09,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(particles);

    // ---------- stations ----------
    interface StationObj { id: string; pos: THREE.Vector3; group: THREE.Group; ring: THREE.Mesh; panel: THREE.Mesh; }
    const stationObjs: StationObj[] = [];

    for (const s of STATIONS) {
      const g = new THREE.Group();
      const R = 20;
      const x = Math.cos(s.angle) * R;
      const z = Math.sin(s.angle) * R;
      g.position.set(x, 0, z);
      g.lookAt(0, 0, 0);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.6, 0.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x0e1c26, metalness: 0.9, roughness: 0.25 }),
      );
      base.position.y = 0.25;
      g.add(base);

      const glow = new THREE.Mesh(
        new THREE.TorusGeometry(2.3, 0.07, 8, 64),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.7 }),
      );
      glow.rotation.x = Math.PI / 2;
      glow.position.y = 0.55;
      g.add(glow);

      const console3d = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.9, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x101f2a, metalness: 0.85, roughness: 0.3 }),
      );
      console3d.position.set(0, 0.95, 0.3);
      console3d.rotation.x = -0.25;
      g.add(console3d);

      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 2.1),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
      );
      panel.position.set(0, 3.1, 0);
      g.add(panel);

      const panelEdge = new THREE.Mesh(
        new THREE.RingGeometry(1.9, 1.96, 48),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
      );
      panelEdge.position.set(0, 3.1, -0.02);
      g.add(panelEdge);

      const label = labelSprite(s.name, s.code, s.accent);
      label.position.set(0, 4.9, 0);
      g.add(label);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 12, 8),
        new THREE.MeshBasicMaterial({ color: s.accent, transparent: true, opacity: 0.18 }),
      );
      beam.position.y = 6;
      g.add(beam);

      const light = new THREE.PointLight(s.accent, 22, 20, 2);
      light.position.set(0, 2.4, 0);
      g.add(light);

      scene.add(g);
      stationObjs.push({ id: s.id, pos: new THREE.Vector3(x, 0, z), group: g, ring: glow, panel });
    }

    const coreLabel = labelSprite(CORE_STATION.name, CORE_STATION.code, CORE_STATION.accent);
    coreLabel.position.set(0, 11.5, 0);
    coreLabel.scale.set(9, 2.8, 1);
    scene.add(coreLabel);

    // ---------- controls ----------
    const keys = new Set<string>();
    let yaw = Math.PI;
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
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---------- loop ----------
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let frames = 0;
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

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
        renderer.render(scene, camera);
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
      const dir = new THREE.Vector3()
        .addScaledVector(forward, fwd)
        .addScaledVector(right, str);
      if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(9 * sprint);
      velocity.lerp(dir, 1 - Math.pow(0.0009, dt));
      camera.position.addScaledVector(velocity, dt);

      // collisions: room shell + core pedestal
      const flat = new THREE.Vector2(camera.position.x, camera.position.z);
      if (flat.length() > ROOM_RADIUS - 1.5) {
        flat.setLength(ROOM_RADIUS - 1.5);
        camera.position.x = flat.x;
        camera.position.z = flat.y;
      }
      if (flat.length() < 3) {
        flat.setLength(3);
        camera.position.x = flat.x;
        camera.position.z = flat.y;
      }
      camera.position.y = 1.7 + Math.sin(t * 8) * Math.min(velocity.length(), 9) * 0.006;

      camera.rotation.set(0, 0, 0);
      camera.rotateY(yaw);
      camera.rotateX(pitch);

      // core animation
      coreSphere.rotation.y = t * 0.25;
      coreSphere.rotation.x = Math.sin(t * 0.3) * 0.2;
      const pulse = 1 + Math.sin(t * 1.6) * 0.05;
      coreSphere.scale.setScalar(pulse);
      coreCage.rotation.y = -t * 0.15;
      coreCage.rotation.z = t * 0.08;
      coreLight.intensity = 220 + Math.sin(t * 1.6) * 70;
      halos.forEach((h, i) => {
        h.rotation.z = t * (0.3 + i * 0.15) * (i % 2 ? -1 : 1);
        h.rotation.y = t * 0.12 * (i + 1);
      });
      ceilingRings.rotation.y = t * 0.03;

      // particles rise toward the core
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const iy = i * 3 + 1;
        arr[iy] += (0.4 + seeds[i]) * dt * 1.6;
        if (arr[iy] > 16) arr[iy] = 0;
        const ang = 0.12 * dt * (0.4 + seeds[i]);
        const x = arr[i * 3];
        const z = arr[i * 3 + 2];
        arr[i * 3] = x * Math.cos(ang) - z * Math.sin(ang);
        arr[i * 3 + 2] = x * Math.sin(ang) + z * Math.cos(ang);
      }
      pGeo.attributes.position.needsUpdate = true;

      // stations: proximity + billboards
      let closest: string | null = null;
      let closestD = 7;
      for (const s of stationObjs) {
        const d = s.pos.distanceTo(camera.position);
        if (d < closestD) {
          closestD = d;
          closest = s.id;
        }
        const active = d < 7;
        s.ring.rotation.z = t * (active ? 1.4 : 0.4);
        const m = s.ring.material as THREE.MeshBasicMaterial;
        m.opacity = active ? 0.55 + Math.sin(t * 5) * 0.35 : 0.45;
        s.panel.lookAt(camera.position);
        s.panel.position.y = 3.1 + Math.sin(t * 1.2 + s.pos.x) * 0.12;
      }
      const coreDist = new THREE.Vector2(camera.position.x, camera.position.z).length();
      if (!closest && coreDist < 8) closest = "core";
      if (closest !== nearId) {
        nearId = closest;
        propsRef.current.onNear(nearId);
      }

      renderer.render(scene, camera);
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
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.quality]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
