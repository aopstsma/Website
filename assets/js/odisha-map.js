/* ============================================================
   Odisha particle map — hero visual
   Points fill the state outline; six zone nodes glow on top.
   Hovering a zone in the rail lights that node and its region.
   ============================================================ */

(function () {
  const canvas = document.getElementById('odisha-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Simplified Odisha boundary (lon, lat), clockwise ---- */
  const OUTLINE = [
    [86.90, 22.55], [87.20, 22.20], [87.48, 21.75], [87.10, 21.60],
    [86.95, 21.48], [86.92, 21.05], [86.80, 20.75], [86.72, 20.32],
    [86.35, 20.15], [86.00, 19.95], [85.60, 19.62], [85.20, 19.48],
    [84.90, 19.30], [84.60, 19.00], [84.25, 18.82], [83.95, 18.32],
    [83.40, 18.25], [82.90, 18.20], [82.35, 18.55], [82.05, 19.15],
    [81.55, 19.55], [81.42, 20.10], [81.60, 20.55], [82.05, 20.72],
    [82.30, 21.28], [82.80, 21.55], [83.15, 21.62], [83.52, 22.00],
    [84.02, 22.05], [84.40, 22.32], [84.90, 22.58], [85.35, 22.50],
    [85.72, 22.38], [86.22, 22.42], [86.55, 22.25]
  ];

  /* ---- Zone anchors ---- */
  const ZONES = [
    { id: 'balasore',    lon: 86.93, lat: 21.49 },
    { id: 'cuttack',     lon: 85.95, lat: 20.52 },
    { id: 'bhubaneswar', lon: 85.78, lat: 20.20 },
    { id: 'zone-four',   lon: 84.85, lat: 22.20, pending: true },
    { id: 'sambalpur',   lon: 83.97, lat: 21.47 },
    { id: 'berhampur',   lon: 84.79, lat: 19.31 }
  ];

  /* ---- Projection: lon/lat -> local units ---- */
  const LON0 = 84.45, LAT0 = 20.4, SCALE = 3.05;
  const px = (lon) => (lon - LON0) * SCALE;
  const py = (lat) => (lat - LAT0) * SCALE * 1.06;

  function inside(lon, lat) {
    let hit = false;
    for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
      const [xi, yi] = OUTLINE[i], [xj, yj] = OUTLINE[j];
      if ((yi > lat) !== (yj > lat) &&
          lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  }

  /* ---- Scene ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0, 12.6);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return; }
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  group.position.x = 1.7;
  scene.add(group);

  /* ---- Fill points ---- */
  const dense = window.innerWidth > 900 && !reduced;
  const step = dense ? 0.075 : 0.125;

  const positions = [], targets = [], seeds = [], zoneIdx = [];
  for (let lon = 81.3; lon <= 87.6; lon += step) {
    for (let lat = 18.1; lat <= 22.7; lat += step) {
      const jl = lon + (Math.random() - 0.5) * step * 0.9;
      const ja = lat + (Math.random() - 0.5) * step * 0.9;
      if (!inside(jl, ja)) continue;

      const x = px(jl), y = py(ja);
      targets.push(x, y, (Math.random() - 0.5) * 0.35);
      positions.push(
        x + (Math.random() - 0.5) * 16,
        y + (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 14
      );
      seeds.push(Math.random() * Math.PI * 2);

      // nearest zone, for the highlight sweep
      let best = 0, bestD = Infinity;
      ZONES.forEach((z, i) => {
        const d = (px(z.lon) - x) ** 2 + (py(z.lat) - y) ** 2;
        if (d < bestD) { bestD = d; best = i; }
      });
      zoneIdx.push(best);
    }
  }

  // Denser trace along the coastline / borders
  for (let i = 0; i < OUTLINE.length; i++) {
    const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length];
    const segs = dense ? 26 : 14;
    for (let s = 0; s < segs; s++) {
      const t = s / segs;
      const x = px(a[0] + (b[0] - a[0]) * t);
      const y = py(a[1] + (b[1] - a[1]) * t);
      targets.push(x, y, 0);
      positions.push(x + (Math.random() - 0.5) * 16, y + (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 14);
      seeds.push(Math.random() * Math.PI * 2);
      let best = 0, bestD = Infinity;
      ZONES.forEach((z, k) => {
        const d = (px(z.lon) - x) ** 2 + (py(z.lat) - y) ** 2;
        if (d < bestD) { bestD = d; best = k; }
      });
      zoneIdx.push(best);
    }
  }

  const COUNT = seeds.length;
  const posArr = new Float32Array(positions);
  const tgtArr = new Float32Array(targets);
  const colArr = new Float32Array(COUNT * 3);

  const BASE = new THREE.Color(0x2C5064);
  const LIT  = new THREE.Color(0xD4A537);
  for (let i = 0; i < COUNT; i++) {
    colArr[i * 3] = BASE.r; colArr[i * 3 + 1] = BASE.g; colArr[i * 3 + 2] = BASE.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));

  const mat = new THREE.PointsMaterial({
    size: dense ? 0.052 : 0.072,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const cloud = new THREE.Points(geo, mat);
  group.add(cloud);

  /* ---- Zone nodes ---- */
  const nodes = ZONES.map((z) => {
    const g = new THREE.Group();
    g.position.set(px(z.lon), py(z.lat), 0.42);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 16, 16),
      new THREE.MeshBasicMaterial({ color: z.pending ? 0x5C7386 : 0xF0D48A })
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.185, 40),
      new THREE.MeshBasicMaterial({
        color: z.pending ? 0x5C7386 : 0xD4A537,
        transparent: true, opacity: 0.55, side: THREE.DoubleSide
      })
    );
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.5, 40),
      new THREE.MeshBasicMaterial({
        color: 0xD4A537, transparent: true, opacity: 0, side: THREE.DoubleSide
      })
    );
    g.add(core, ring, halo);
    group.add(g);
    return { g, core, ring, halo, phase: Math.random() * Math.PI * 2, glow: 0, pending: !!z.pending };
  });

  /* ---- Interaction state ---- */
  let active = -1;
  let pointerX = 0, pointerY = 0;

  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  document.querySelectorAll('[data-zone]').forEach((el) => {
    const i = ZONES.findIndex((z) => z.id === el.dataset.zone);
    const on = () => { active = i; el.classList.add('is-active'); };
    const off = () => { active = -1; el.classList.remove('is-active'); };
    el.addEventListener('mouseenter', on);
    el.addEventListener('focus', on);
    el.addEventListener('mouseleave', off);
    el.addEventListener('blur', off);
  });

  /* ---- Resize ---- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 760 ? 62 : 46;
    group.position.x = w < 900 ? 0 : 1.7;
    group.position.y = w < 900 ? -0.6 : 0;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---- Assemble + animate ---- */
  const t0 = performance.now();
  const ASSEMBLE = reduced ? 1 : 2600;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const tmpCol = new THREE.Color();
  let running = true;
  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;

    const elapsed = now - t0;
    const p = easeOut(Math.min(elapsed / ASSEMBLE, 1));
    const time = elapsed * 0.001;

    const pos = geo.attributes.position.array;
    const col = geo.attributes.color.array;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const drift = reduced ? 0 : Math.sin(time * 0.65 + seeds[i]) * 0.026;
      pos[i3]     = posArr[i3]     + (tgtArr[i3]     - posArr[i3])     * p;
      pos[i3 + 1] = posArr[i3 + 1] + (tgtArr[i3 + 1] - posArr[i3 + 1]) * p + drift;
      pos[i3 + 2] = posArr[i3 + 2] + (tgtArr[i3 + 2] - posArr[i3 + 2]) * p;

      const want = active >= 0 && zoneIdx[i] === active ? 1 : 0;
      tmpCol.copy(BASE).lerp(LIT, want * 0.85);
      col[i3]     += (tmpCol.r - col[i3])     * 0.09;
      col[i3 + 1] += (tmpCol.g - col[i3 + 1]) * 0.09;
      col[i3 + 2] += (tmpCol.b - col[i3 + 2]) * 0.09;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;

    nodes.forEach((n, i) => {
      const want = active === i ? 1 : 0;
      n.glow += (want - n.glow) * 0.1;
      const pulse = reduced ? 0 : Math.sin(time * 1.5 + n.phase) * 0.5 + 0.5;
      const s = 1 + n.glow * 0.85 + pulse * 0.09;
      n.g.scale.setScalar(s * p);
      n.ring.material.opacity = (n.pending ? 0.3 : 0.5) + n.glow * 0.5;
      n.halo.material.opacity = n.glow * 0.28;
      n.halo.scale.setScalar(1 + n.glow * 0.45);
      n.g.lookAt(camera.position);
    });

    const tilt = reduced ? 0 : 1;
    group.rotation.y += (pointerX * 0.17 * tilt - group.rotation.y) * 0.045;
    group.rotation.x += (pointerY * 0.09 * tilt - group.rotation.x) * 0.045;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
