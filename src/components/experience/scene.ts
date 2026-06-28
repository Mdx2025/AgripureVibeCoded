/* eslint-disable @typescript-eslint/no-explicit-any */
// Real-time WebGL scene for the scroll-driven hero — ported ~1:1 from the
// approved prototype (design-handoff/prototypes/AgriPureExperience.dc.html).
// THREE is injected (dynamically imported) so nothing runs during SSR.

import { EXPERIENCE_STEPS } from "@/lib/experience-steps";

interface CreateOpts {
  THREE: any;
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  intro: HTMLElement;
  panel: HTMLElement;
  cue: HTMLElement;
  onIdx: (idx: number) => void;
}

const PD = EXPERIENCE_STEPS;
const bottle = (id: string) => `/assets/bottles/${id}.png`;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export function createScene(opts: CreateOpts): () => void {
  const { THREE, canvas, section, intro, panel, cue, onIdx } = opts;

  const cvs = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };

  // Central Coast late-afternoon sky: blue overhead → warm golden haze at horizon.
  const skyTex = () => {
    const c = cvs(16, 256), x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#4f86c2"); g.addColorStop(0.42, "#84b1d4");
    g.addColorStop(0.68, "#cdd9d9"); g.addColorStop(0.82, "#efe2c4");
    g.addColorStop(0.93, "#f5d6a2"); g.addColorStop(1, "#ecc889");
    x.fillStyle = g; x.fillRect(0, 0, 16, 256);
    return new THREE.CanvasTexture(c);
  };
  const cloudTex = () => {
    const c = cvs(1024, 512), x = c.getContext("2d")!;
    x.clearRect(0, 0, 1024, 512);
    for (let i = 0; i < 26; i++) {
      const cx = Math.random() * 1024, cy = 80 + Math.random() * 180, r = 50 + Math.random() * 120;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(255,255,255," + (0.5 + Math.random() * 0.4) + ")");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, r, r * 0.6, 0, 0, 7); x.fill();
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
  };
  const fieldTex = () => {
    const c = cvs(1024, 1024), x = c.getContext("2d")!;
    x.fillStyle = "#6c5836"; x.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1024; i += 20) {
      x.fillStyle = Math.floor(i / 20) % 2 ? "#7a6a44" : "#5c4a2c";
      x.fillRect(0, i, 1024, 11);
    }
    x.globalAlpha = 0.2;
    for (let i = 0; i < 5200; i++) {
      x.fillStyle = Math.random() > 0.5 ? "#8a7a52" : "#473820";
      x.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
    }
    x.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 46); t.anisotropy = 4;
    return t;
  };
  // Painted horizon: hazy Pacific band + golden rolling hills, wrapped on a
  // backdrop cylinder. fog:false — atmospheric haze is baked into the texture.
  const coastTex = () => {
    const W = 2048, H = 1024, c = cvs(W, H), x = c.getContext("2d")!;
    x.clearRect(0, 0, W, H);
    const oceanTop = 0.715 * H, oceanBot = 0.755 * H;
    const og = x.createLinearGradient(0, oceanTop, 0, oceanBot);
    og.addColorStop(0, "#c3d4da"); og.addColorStop(0.2, "#9fbccb"); og.addColorStop(1, "#82a3b6");
    x.fillStyle = og; x.fillRect(0, oceanTop, W, oceanBot - oceanTop);
    x.fillStyle = "rgba(255,250,236,0.65)"; x.fillRect(0, oceanTop, W, 2); // bright horizon line
    // layered golden rolling hills below the ocean line
    const layers = [
      { y: 0.752, amp: 0.02, col: "#aeb78c" },
      { y: 0.788, amp: 0.034, col: "#bcb06c" },
      { y: 0.838, amp: 0.05, col: "#c3a659" },
    ];
    layers.forEach((L, li) => {
      x.fillStyle = L.col; x.beginPath(); x.moveTo(0, H);
      const baseY = L.y * H;
      for (let px = 0; px <= W; px += 8) {
        const t = px / W;
        const yy = baseY
          - (Math.sin(t * Math.PI * 2 * (2 + li) + li * 1.3) * 0.5 + 0.5) * L.amp * H
          - Math.sin(t * Math.PI * 2 * (5 + li)) * L.amp * H * 0.3;
        x.lineTo(px, yy);
      }
      x.lineTo(W, H); x.closePath(); x.fill();
    });
    // scattered oak dabs on the nearest hill
    x.fillStyle = "rgba(72,92,56,0.5)";
    for (let i = 0; i < 48; i++) {
      const px = Math.random() * W, py = (0.85 + Math.random() * 0.08) * H, r = 4 + Math.random() * 8;
      x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
  };
  const soft = (col: string) => {
    const c = cvs(64, 64), x = c.getContext("2d")!;
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, col); g.addColorStop(0.45, col.replace("rgb", "rgba").replace(")", ",0.45)"));
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  };
  const glow = (col: string) => {
    const c = cvs(128, 128), x = c.getContext("2d")!;
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, col); g.addColorStop(0.3, col.replace("rgb", "rgba").replace(")", ",0.6)"));
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  };
  const threatTex = (type: string) => {
    const c = cvs(84, 84), x = c.getContext("2d")!;
    x.lineCap = "round"; x.lineJoin = "round"; const C = 42;
    if (type === "pest") {
      x.fillStyle = "#5a3a1c"; x.beginPath(); x.ellipse(C, C + 5, 13, 18, 0, 0, 7); x.fill();
      x.fillStyle = "#7a5024"; x.beginPath(); x.ellipse(C - 4, C, 6, 9, 0, 0, 7); x.fill();
      x.strokeStyle = "#3a2410"; x.lineWidth = 2; x.beginPath(); x.moveTo(C, C - 10); x.lineTo(C, C + 20); x.stroke();
      x.fillStyle = "#3a2410"; x.beginPath(); x.arc(C, C - 15, 8, 0, 7); x.fill();
      x.lineWidth = 3;
      for (let i = 0; i < 3; i++) { const y = C - 2 + i * 9; x.beginPath(); x.moveTo(C - 12, y); x.lineTo(C - 24, y - 6); x.moveTo(C + 12, y); x.lineTo(C + 24, y - 6); x.stroke(); }
      x.beginPath(); x.moveTo(C - 4, C - 21); x.lineTo(C - 9, C - 30); x.moveTo(C + 4, C - 21); x.lineTo(C + 9, C - 30); x.stroke();
    } else if (type === "virus") {
      x.fillStyle = "#7e5fb0"; const r = 16; x.beginPath(); x.arc(C, C, r, 0, 7); x.fill();
      x.strokeStyle = "#7e5fb0"; x.lineWidth = 4; x.fillStyle = "#7e5fb0";
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.28; const x1 = C + Math.cos(a) * r, y1 = C + Math.sin(a) * r, x2 = C + Math.cos(a) * (r + 11), y2 = C + Math.sin(a) * (r + 11); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); x.beginPath(); x.arc(x2, y2, 3.6, 0, 7); x.fill(); }
      x.fillStyle = "#d8c8ef"; ([[-5, -4], [6, -2], [-2, 6]] as number[][]).forEach((p) => { x.beginPath(); x.arc(C + p[0], C + p[1], 3, 0, 7); x.fill(); });
    } else if (type === "spore") {
      const pts: number[][] = [[0, 0, 13], [-15, -9, 8], [15, -8, 8], [-12, 13, 7], [13, 12, 8], [0, -19, 6]];
      x.fillStyle = "#7a6a3a"; pts.forEach((p) => { x.beginPath(); x.arc(C + p[0], C + p[1], p[2], 0, 7); x.fill(); });
      x.fillStyle = "#a89a5a"; pts.forEach((p) => { x.beginPath(); x.arc(C + p[0] - p[2] * 0.3, C + p[1] - p[2] * 0.3, p[2] * 0.45, 0, 7); x.fill(); });
    } else if (type === "residue") {
      x.fillStyle = "#6f6440"; x.beginPath(); x.moveTo(C, C - 18); x.quadraticCurveTo(C + 16, C + 6, C, C + 18); x.quadraticCurveTo(C - 16, C + 6, C, C - 18); x.fill();
      x.fillStyle = "#9a8f5e"; x.beginPath(); x.ellipse(C - 4, C - 2, 4, 7, 0, 0, 7); x.fill();
    } else if (type === "root") {
      x.strokeStyle = "#9a7b4a"; x.lineWidth = 4; x.beginPath();
      x.moveTo(C, C - 20); x.lineTo(C, C + 2); x.lineTo(C - 13, C + 20); x.moveTo(C, C + 2); x.lineTo(C + 13, C + 20);
      x.moveTo(C - 13, C + 20); x.lineTo(C - 20, C + 28); x.moveTo(C + 13, C + 20); x.lineTo(C + 20, C + 28); x.stroke();
    } else if (type === "soil") {
      x.fillStyle = "#8a6a3a"; ([[-10, 4, 10], [8, 8, 9], [0, -6, 8], [-4, 16, 6], [12, -4, 6]] as number[][]).forEach((p) => { x.beginPath(); x.arc(C + p[0], C + p[1], p[2], 0, 7); x.fill(); });
      x.fillStyle = "#a8895a"; ([[-10, 4, 4], [8, 8, 3.5]] as number[][]).forEach((p) => { x.beginPath(); x.arc(C + p[0], C + p[1], p[2], 0, 7); x.fill(); });
    } else {
      x.strokeStyle = "#5B8A3C"; x.lineWidth = 4; x.beginPath(); x.arc(C, C, 17, 0, 7); x.stroke();
      x.beginPath(); x.moveTo(C - 8, C - 4); x.lineTo(C, C + 6); x.lineTo(C + 8, C - 4); x.stroke();
    }
    return new THREE.CanvasTexture(c);
  };

  // Broad, 5-lobed grape leaf (palmate), pointing +y with its base at origin.
  const grapeLeafGeo = () => {
    const s = new THREE.Shape();
    const pts: number[][] = [
      [0, 0], [0.13, 0.20], [0.32, 0.18], [0.23, 0.44], [0.42, 0.50],
      [0.27, 0.72], [0.11, 0.68], [0, 0.98],
      [-0.11, 0.68], [-0.27, 0.72], [-0.42, 0.50], [-0.23, 0.44], [-0.32, 0.18], [-0.13, 0.20],
    ];
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  };

  // ---- scene state ----
  let leafMats: any[] = [], leaves: any[] = [], fruits: any[] = [], flowers: any[] = [];

  // The hero plant is a single grapevine: gnarled trunk → cordon arms on a
  // trellis, a canopy of grape leaves, and clusters that set fruit at the end.
  const buildPlant = () => {
    const grp = new THREE.Group();
    leafMats = []; leaves = []; fruits = []; flowers = [];
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a3d22, roughness: 0.95 });
    const cordonY = 1.5, arm = 1.15;

    // gnarled trunk up to the cordon
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, 1.5, 8), woodMat);
    trunk.position.y = 0.75; trunk.castShadow = true; grp.add(trunk);

    // cordon arms trained horizontally along the trellis
    [-1, 1].forEach((dir) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, arm, 7), woodMat);
      c.rotation.z = Math.PI / 2; c.position.set((dir * arm) / 2, cordonY, 0); c.castShadow = true; grp.add(c);
    });

    // trellis post + catch wires
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.3, 6), new THREE.MeshStandardMaterial({ color: 0x6b563a, roughness: 0.95 }));
    post.position.set(0, 1.15, -0.18); post.castShadow = true; grp.add(post);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x9a9a90, roughness: 0.5, metalness: 0.6 });
    [1.5, 1.95].forEach((wy) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.8, 5), wireMat);
      w.rotation.z = Math.PI / 2; w.position.set(0, wy, -0.18); grp.add(w);
    });

    const lg = grapeLeafGeo();
    const anchors: number[][] = [];
    for (let s = 0; s <= 6; s++) {
      const t = s / 6; const nodeX = lerp(-arm, arm, t);
      const shootH = 0.5 + Math.random() * 0.5;
      const nLeaves = 3 + (s % 2);
      for (let i = 0; i < nLeaves; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: 0xa6b063, roughness: 0.62, side: THREE.DoubleSide, emissive: 0x16280b, emissiveIntensity: 0 });
        leafMats.push(mat);
        const leaf = new THREE.Mesh(lg, mat); leaf.castShadow = true;
        leaf.position.set(nodeX + (Math.random() - 0.5) * 0.5, cordonY + 0.08 + Math.random() * (shootH + 0.4), (Math.random() - 0.5) * 0.5);
        leaf.rotation.y = Math.random() * 6.28; leaf.rotation.x = -0.3 - Math.random() * 0.4;
        leaf.scale.setScalar(0.5 + Math.random() * 0.35);
        leaf.userData = { ph: Math.random() * 6 }; grp.add(leaf); leaves.push(leaf);
      }
      if (Math.abs(nodeX) < arm - 0.05) anchors.push([nodeX + (Math.random() - 0.5) * 0.2, cordonY - 0.12, (Math.random() - 0.5) * 0.18]);
    }

    // grape clusters (fruit, step 7) + flower nubs (step 6) hanging under the cordon
    const grapeMat = new THREE.MeshStandardMaterial({ color: 0x5e2c50, roughness: 0.45 });
    anchors.forEach((a) => {
      const cluster = new THREE.Group(); cluster.position.set(a[0], a[1], a[2]);
      const berries = 16;
      for (let b = 0; b < berries; b++) {
        const rr = 0.13 * (1 - b / berries) + 0.03; const aa = b * 2.4;
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), grapeMat);
        berry.position.set(Math.cos(aa) * rr * 0.6, -b * 0.045, Math.sin(aa) * rr * 0.6);
        berry.castShadow = true; cluster.add(berry);
      }
      cluster.scale.setScalar(0); grp.add(cluster); fruits.push(cluster);

      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xdfe6b8, emissive: 0x2a2a14, roughness: 0.7 }));
      fl.position.set(a[0], a[1] - 0.08, a[2]); fl.scale.setScalar(0); grp.add(fl); flowers.push(fl);
    });

    // soil mound at the base
    const mound = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 12, 0, 6.28, 0, Math.PI / 2.3), new THREE.MeshStandardMaterial({ color: 0x4a3a22, roughness: 1 }));
    mound.receiveShadow = true; grp.add(mound);
    return grp;
  };

  // ---- init ----
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = skyTex();
  scene.fog = new THREE.Fog(0xd8d1bb, 26, 112);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400); scene.add(camera);

  scene.add(new THREE.HemisphereLight(0xe6efff, 0x6b6238, 0.82));
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const sun = new THREE.DirectionalLight(0xffe2af, 1.75); // warm low Central-Coast sun
  sun.position.set(20, 13, -10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
  const ssc = 14; sun.shadow.camera.left = -ssc; sun.shadow.camera.right = ssc; sun.shadow.camera.top = ssc; sun.shadow.camera.bottom = -ssc; sun.shadow.bias = -0.0004;
  scene.add(sun);

  const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(190, 32, 16),
    new THREE.MeshBasicMaterial({ map: cloudTex(), transparent: true, opacity: 0.7, side: THREE.BackSide, depthWrite: false, fog: false }),
  );
  scene.add(cloud);

  const sg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow("rgb(255,244,210)"), transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  sg.scale.set(60, 60, 1); sg.position.set(70, 70, -120); scene.add(sg);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: fieldTex(), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  // rolling golden hills behind the vineyard (mid-distance relief)
  const hillMat = new THREE.MeshStandardMaterial({ color: 0xb7a866, roughness: 1, flatShading: true });
  const hillGeo = new THREE.IcosahedronGeometry(1, 1);
  ([[-24, -40, 16, 8], [18, -50, 20, 9], [-6, -62, 30, 13], [34, -44, 14, 7], [-38, -56, 18, 10], [8, -72, 34, 15]] as number[][])
    .forEach(([hx, hz, s, h]) => {
      const m = new THREE.Mesh(hillGeo, hillMat);
      m.position.set(hx, -3, hz); m.scale.set(s, h * 0.45, s); m.receiveShadow = true; scene.add(m);
    });

  // painted coastal horizon (Pacific + far hills) on a backdrop cylinder
  const coast = new THREE.Mesh(
    new THREE.CylinderGeometry(135, 135, 120, 64, 1, true),
    new THREE.MeshBasicMaterial({ map: coastTex(), transparent: true, side: THREE.BackSide, depthWrite: false, fog: false }),
  );
  coast.position.y = 30; scene.add(coast);

  // vineyard rows — vine canopy trained into long hedges receding to the treeline
  const ROW_SPACING = 2.4;
  const vineBlob = new THREE.IcosahedronGeometry(0.5, 0); vineBlob.scale(1.15, 0.85, 0.62);
  const inst = new THREE.InstancedMesh(vineBlob, new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true }), 4200);
  const dummy = new THREE.Object3D(), col = new THREE.Color(); let n = 0;
  for (let rx = -34; rx <= 34 && n < 4200; rx += ROW_SPACING) {
    if (Math.abs(rx) < 2.0) continue; // leave the central path open to the hero vine
    for (let z = 8; z >= -64 && n < 4200; z -= 0.62) {
      if (Math.abs(rx) < 2.2 && z > -1.6) continue;
      const px = rx + (Math.random() - 0.5) * 0.22;
      const pz = z + (Math.random() - 0.5) * 0.2;
      dummy.position.set(px, 0.62 + Math.random() * 0.15, pz);
      const s = 0.6 + Math.random() * 0.35;
      dummy.scale.set(s * 1.25, s + Math.random() * 0.55, s);
      dummy.rotation.set(0, Math.random() * 6, (Math.random() - 0.5) * 0.08); dummy.updateMatrix();
      inst.setMatrixAt(n, dummy.matrix);
      col.setHSL(0.27 + Math.random() * 0.05, 0.5, 0.26 + Math.random() * 0.12); inst.setColorAt(n, col); n++;
    }
  }
  inst.count = n; inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true; scene.add(inst);

  // trellis end-posts marching down each row
  const tpostGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.4, 5);
  const tposts = new THREE.InstancedMesh(tpostGeo, new THREE.MeshStandardMaterial({ color: 0x6b563a, roughness: 0.95 }), 900);
  const td = new THREE.Object3D(); let pn = 0;
  for (let rx = -34; rx <= 34 && pn < 900; rx += ROW_SPACING) {
    if (Math.abs(rx) < 2.0) continue;
    for (let z = 6; z >= -60 && pn < 900; z -= 6) {
      td.position.set(rx, 0.55, z); td.updateMatrix(); tposts.setMatrixAt(pn, td.matrix); pn++;
    }
  }
  tposts.count = pn; tposts.instanceMatrix.needsUpdate = true; tposts.castShadow = true; scene.add(tposts);

  // scattered coastal live oaks (low-poly 3D) dotting the hills
  const oakTrunk = new THREE.CylinderGeometry(0.18, 0.28, 2.2, 6);
  const oakCanopy = new THREE.IcosahedronGeometry(1, 1);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4a32, roughness: 1 });
  const oakMat = new THREE.MeshStandardMaterial({ color: 0x61774a, roughness: 0.95, flatShading: true });
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * 6.28, d = 28 + Math.random() * 58;
    const ox = Math.cos(a) * d, oz = Math.sin(a) * d - 10;
    if (Math.abs(ox) < 6 && oz > -8) continue; // keep the hero + path clear
    const g = new THREE.Group(); g.position.set(ox, 0, oz);
    const tr = new THREE.Mesh(oakTrunk, trunkMat); tr.position.y = 1.1; tr.castShadow = true; g.add(tr);
    const base = 1.3 + Math.random() * 1.3;
    for (let k = 0; k < 3; k++) {
      const can = new THREE.Mesh(oakCanopy, oakMat);
      can.position.set((Math.random() - 0.5) * 1.3, 2.4 + Math.random() * 0.9, (Math.random() - 0.5) * 1.3);
      can.scale.setScalar(base * (0.7 + Math.random() * 0.5)); can.castShadow = true; g.add(can);
    }
    scene.add(g);
  }

  const postGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.1, 6), postMat = new THREE.MeshStandardMaterial({ color: 0x6b563a, roughness: 0.95 });
  for (let i = 1; i <= 7; i++) {
    [-1.6, 1.6].forEach((sx) => { const post = new THREE.Mesh(postGeo, postMat); post.position.set(sx, 0.55, 2 + i * 2.4); post.castShadow = true; scene.add(post); });
  }

  const plant = buildPlant(); scene.add(plant);

  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5, metalness: 0.3 });
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 12), pipeMat); pipe.rotation.z = Math.PI / 2; pipe.position.set(0, 3.5, 0); scene.add(pipe);
  const feeder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12), pipeMat); feeder.position.set(1.2, 2.7, 0); scene.add(feeder);

  const loader = new THREE.TextureLoader();
  const tex = PD.map((p) => { const t = loader.load(bottle(p.id)); if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace; else t.encoding = THREE.sRGBEncoding; return t; });
  const bottleMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false });
  const bottleMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.55), bottleMat); bottleMesh.position.set(1.95, -0.1, -4.3); bottleMesh.renderOrder = 20; camera.add(bottleMesh);

  const drops: any[] = []; const dropMat = new THREE.MeshPhongMaterial({ color: 0xdff0ff, transparent: true, opacity: 0.85, shininess: 120, specular: 0xffffff });
  for (let i = 0; i < 70; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dropMat.clone()); d.visible = false;
    d.userData = { x: (Math.random() - 0.5) * 1.6, z: (Math.random() - 0.5) * 1.0, y: 2.6 + Math.random() * 0.9, v: 0.04 + Math.random() * 0.05 };
    scene.add(d); drops.push(d);
  }

  const mist: any[] = []; const mtex = soft("rgb(228,242,224)");
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: mtex, transparent: true, opacity: 0, depthWrite: false }));
    const a = Math.random() * 6.28, r = Math.random() * 1.3; m.position.set(Math.cos(a) * r, 0.4 + Math.random() * 2.6, Math.sin(a) * r);
    m.scale.setScalar(1.3 + Math.random() * 1.4); m.userData = { ph: Math.random() * 6, base: m.position.y }; scene.add(m); mist.push(m);
  }
  const FN = 240, fp = new Float32Array(FN * 3); const fph = new Float32Array(FN);
  for (let i = 0; i < FN; i++) { const a = Math.random() * 6.28, r = Math.random() * 1.2; fp[i * 3] = Math.cos(a) * r; fp[i * 3 + 1] = 0.3 + Math.random() * 2.8; fp[i * 3 + 2] = Math.sin(a) * r; fph[i] = Math.random() * 6; }
  const fgeo = new THREE.BufferGeometry(); fgeo.setAttribute("position", new THREE.BufferAttribute(fp, 3));
  const fine = new THREE.Points(fgeo, new THREE.PointsMaterial({ size: 0.07, map: soft("rgb(214,238,250)"), transparent: true, opacity: 0, depthWrite: false })); scene.add(fine);

  const NN = 160, np = new Float32Array(NN * 3); const nano: any[] = [];
  for (let i = 0; i < NN; i++) { const a = Math.random() * 6.28, r = 1.6 + Math.random() * 1.6, h = 0.6 + Math.random() * 2.4; np[i * 3] = Math.cos(a) * r; np[i * 3 + 1] = h; np[i * 3 + 2] = Math.sin(a) * r; nano.push({ a, r, h, sp: 0.6 + Math.random() * 0.8 }); }
  const ngeo = new THREE.BufferGeometry(); ngeo.setAttribute("position", new THREE.BufferAttribute(np, 3));
  const nanoP = new THREE.Points(ngeo, new THREE.PointsMaterial({ size: 0.11, map: glow("rgb(150,240,170)"), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(nanoP);

  const tThreatTex: Record<string, any> = {};
  ["pest", "virus", "spore", "residue", "root", "soil", "slow"].forEach((t) => (tThreatTex[t] = threatTex(t)));
  const threats: any[] = [];
  for (let i = 0; i < 16; i++) {
    const m = new THREE.SpriteMaterial({ map: tThreatTex.pest, transparent: true, opacity: 0, depthTest: false });
    const s = new THREE.Sprite(m); s.scale.set(0.55, 0.55, 0.55);
    s.userData = { a: (i / 16) * 6.28, h: 0.7 + Math.random() * 1.9, rad: 1.0 + Math.random() * 0.5, sp: Math.random() * 6, bob: Math.random() * 6, fall: Math.random() };
    s.renderOrder = 12; scene.add(s); threats.push(s);
  }

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize); resize();

  let target = 0, p = 0, curIdx = -2;
  const onScroll = () => {
    const r = section.getBoundingClientRect(); const total = section.offsetHeight - window.innerHeight;
    const s2 = clamp(-r.top, 0, total); target = total > 0 ? s2 / total : 0;
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const onIdxInternal = (idx: number) => {
    if (idx < 0) return;
    const pd = PD[idx]; bottleMat.map = tex[idx];
    const tx = tThreatTex[pd.threat] || tThreatTex.pest; const c = new THREE.Color(pd.tcolor);
    for (const s of threats) { s.material.map = tx; s.material.color.copy(c); s.material.needsUpdate = true; const u = s.userData; u.a = Math.random() * 6.28; u.h = 0.7 + Math.random() * 1.9; u.rad = 1.0 + Math.random() * 0.5; }
  };

  const clock = new THREE.Clock();
  const lk = new THREE.Vector3();
  let raf = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const time = clock.getElapsedTime();
    p = lerp(p, target, 0.075);
    const introEnd = 0.085; let idx = -1, lt = 0;
    if (p < introEnd) {
      const t = smooth(0, 1, p / introEnd);
      camera.position.set(lerp(-6, Math.sin(-0.55) * 5.4, t), lerp(15, 2.1, t), lerp(22, 5.4, t));
      lk.set(lerp(2, 0, t), 1.5, lerp(-10, 0, t)); camera.lookAt(lk);
    } else {
      const seg = (p - introEnd) / (1 - introEnd); const f = clamp(seg * PD.length, 0, PD.length - 0.0001); idx = Math.floor(f); lt = f - idx;
      const a = -0.55 + seg * 1.15; const r = 5.4 - seg * 1.7 - smooth(0.2, 0.7, lt) * 0.5;
      const hy = 1.95 + Math.sin(seg * 6.28) * 0.25 + Math.sin(time * 0.35) * 0.05;
      camera.position.set(Math.sin(a) * r, hy, Math.cos(a) * r); camera.lookAt(0, 1.45, 0);
    }

    if (idx !== curIdx) { curIdx = idx; onIdxInternal(idx); onIdx(idx); }

    intro.style.opacity = String(clamp(1 - p / introEnd, 0, 1));
    if (idx >= 0) panel.style.opacity = String(clamp(Math.min(lt / 0.12, (1 - lt) / 0.12, 1), 0, 1));
    else panel.style.opacity = "0";
    cue.style.opacity = String(clamp(1 - smooth(0.93, 1, p), 0, 1));

    cloud.rotation.y = time * 0.004;

    const health = idx < 0 ? 0.12 : (idx + smooth(0.32, 0.72, lt)) / PD.length;
    const sick = new THREE.Color(0xb2bb6a), lush = new THREE.Color(0x3f8c2c), lc = sick.clone().lerp(lush, health);
    for (const m of leafMats) { m.color.copy(lc); m.emissiveIntensity = health * 0.06; }
    plant.rotation.z = Math.sin(time * 0.6) * 0.018; plant.scale.setScalar(lerp(0.9, 1.05, health));
    for (const lf of leaves) lf.rotation.x = -0.52 + Math.sin(time * 1.1 + lf.userData.ph) * 0.05;

    const flo = idx >= 5 ? smooth(0.2, 0.7, idx === 5 ? lt : 1) : 0;
    const fru = idx >= 6 ? smooth(0.25, 0.8, lt) : 0;
    for (const f of flowers) f.scale.setScalar(0.0001 + flo * (1 - fru));
    for (const fr of fruits) fr.scale.setScalar(0.0001 + fru);
    inst.rotation.z = Math.sin(time * 0.4) * 0.006;

    const app = idx >= 0 ? smooth(0.16, 0.3, lt) * (1 - smooth(0.64, 0.8, lt)) : 0;
    for (const d of drops) {
      if (app > 0.05) {
        d.visible = true; d.material.opacity = app * 0.9; d.position.set(d.userData.x, d.userData.y, d.userData.z);
        d.userData.y -= d.userData.v * 1.5;
        if (d.userData.y < 0.2) { d.userData.y = 2.6 + Math.random() * 0.9; d.userData.x = (Math.random() - 0.5) * 1.6; d.userData.z = (Math.random() - 0.5) * 1.0; }
      } else d.visible = false;
    }
    for (const m of mist) { m.material.opacity = app * 0.42; m.position.y = m.userData.base + Math.sin(time * 0.6 + m.userData.ph) * 0.25 + ((time * 0.05) % 2); }
    fine.material.opacity = app * 0.5;
    { const a = fgeo.attributes.position.array as Float32Array; for (let i = 0; i < fph.length; i++) { a[i * 3 + 1] += 0.006; if (a[i * 3 + 1] > 3.2) a[i * 3 + 1] = 0.3; } fgeo.attributes.position.needsUpdate = true; }
    nanoP.material.opacity = app * 0.9;
    { const a = ngeo.attributes.position.array as Float32Array; for (let i = 0; i < nano.length; i++) { const o = nano[i]; const conv = app; const r = lerp(o.r, 0.25, conv * 0.85); const ang = o.a + time * o.sp * 0.5; a[i * 3] = Math.cos(ang) * r; a[i * 3 + 1] = lerp(o.h, 1.3, conv * 0.6) + Math.sin(time * 2 + i) * 0.04; a[i * 3 + 2] = Math.sin(ang) * r; } ngeo.attributes.position.needsUpdate = true; }

    const clearing = idx < 0 ? 1 : PD[idx] && PD[idx].threat === "none" ? 1 : smooth(0.32, 0.66, lt);
    const present = idx < 0 || (PD[idx] && PD[idx].threat === "none") ? 0 : 1;
    for (const s of threats) {
      const u = s.userData; const ang = u.a + time * 0.35 + u.sp; const rad = u.rad * (1 + clearing * 2.6);
      s.position.set(Math.cos(ang) * rad, u.h * (1 - clearing) + clearing * -0.5 + Math.sin(time * 1.4 + u.bob) * 0.12, Math.sin(ang) * rad);
      s.material.opacity = present * (1 - clearing) * 0.95; s.material.rotation = Math.sin(time + u.sp) * 0.2;
    }

    renderer.render(scene, camera);
  };
  frame();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
    try { renderer.dispose(); } catch { /* noop */ }
  };
}
