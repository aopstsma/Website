/* ============================================================
   Odisha 3D Interactive Map — High-Contrast Hero Visual
   All Orissa Private Secondary Training Schools Management Association
   ============================================================ */

(function () {
  const canvas = document.getElementById('odisha-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 95 boundary points extracted directly from official Mercator map of Odisha
  const ODISHA_BORDER = [
    [87.52, 21.749], [87.341, 21.8], [87.272, 21.979], [87.079, 21.877], [87.052, 22.043],
    [86.473, 22.299], [86.088, 22.58], [86.005, 22.478], [86.129, 22.35], [85.977, 22.209],
    [86.019, 22.056], [85.936, 21.979], [85.812, 22.005], [85.854, 22.107], [85.73, 22.069],
    [85.454, 22.171], [85.261, 22.043], [85.041, 22.12], [85.137, 22.312], [85.096, 22.516],
    [84.297, 22.363], [83.981, 22.542], [84.049, 22.465], [84.008, 22.388], [83.636, 22.222],
    [83.526, 22.03], [83.595, 21.864], [83.485, 21.8], [83.43, 21.673], [83.485, 21.609],
    [83.375, 21.596], [83.333, 21.455], [83.402, 21.34], [83.251, 21.34], [83.127, 21.11],
    [82.975, 21.187], [82.631, 21.161], [82.466, 20.842], [82.342, 20.88], [82.342, 20.548],
    [82.424, 20.446], [82.397, 20.037], [82.741, 19.973], [82.755, 19.819], [82.631, 19.755],
    [82.521, 19.896], [82.369, 19.807], [82.231, 19.973], [81.915, 20.088], [81.846, 20.024],
    [81.915, 19.755], [82.039, 19.768], [82.039, 19.513], [82.163, 19.398], [82.231, 18.899],
    [82.135, 18.759], [81.928, 18.669], [81.928, 18.567], [81.722, 18.324], [81.488, 18.235],
    [81.35, 17.8], [81.598, 17.8], [82.066, 18.056], [82.231, 17.966], [82.452, 18.529],
    [82.617, 18.222], [82.782, 18.413], [82.892, 18.337], [83.085, 18.35], [83.113, 18.503],
    [83.044, 18.605], [83.14, 18.72], [83.416, 18.822], [83.333, 18.963], [83.485, 18.937],
    [83.622, 19.142], [83.953, 18.759], [84.325, 18.759], [84.463, 18.976], [84.628, 19.014],
    [84.71, 19.129], [84.821, 19.104], [85.427, 19.589], [86.446, 19.934], [86.583, 20.152],
    [86.873, 20.343], [86.873, 20.484], [86.859, 20.356], [86.776, 20.343], [86.831, 20.497],
    [87.121, 20.688], [86.886, 21.097], [86.942, 21.276], [87.245, 21.532], [87.492, 21.558]
  ];

  // 5 Active Administrative Zones
  const ZONES = [
    { id: 'balasore',    name: 'Baleswar',    count: '40 Schools', lon: 86.85, lat: 21.60, color: 0xF59E0B },
    { id: 'central',     name: 'Central',     count: '24 Schools', lon: 85.92, lat: 20.52, color: 0x38BDF8 },
    { id: 'bhubaneswar', name: 'BBSR HQ',     count: '15 Schools', lon: 85.83, lat: 20.26, color: 0x10B981 },
    { id: 'sambalpur',   name: 'Sambalpur',   count: '9 Schools',  lon: 83.98, lat: 21.48, color: 0xEC4899 },
    { id: 'ganjam',      name: 'Ganjam',      count: '2 Schools',  lon: 84.85, lat: 19.35, color: 0xA78BFA },
  ];

  const LON0 = 84.45, LAT0 = 20.20, SC = 0.95;
  const gx = (lon) => (lon - LON0) * SC;
  const gy = (lat) => (lat - LAT0) * SC * 1.06;
  const MAP_TOP_Z = 0.36;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071526, 0.035);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 3.6, 8.4);
  camera.lookAt(0, 0, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const world = new THREE.Group();
  world.rotation.x = 0.52;
  scene.add(world);

  // Lighting
  scene.add(new THREE.AmbientLight(0x243b55, 0.8));

  const keyLight = new THREE.DirectionalLight(0xfff0cc, 1.4);
  keyLight.position.set(6, 10, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
  rimLight.position.set(-6, -2, -6);
  scene.add(rimLight);

  const topLight = new THREE.DirectionalLight(0xf59e0b, 0.5);
  topLight.position.set(0, 8, 2);
  scene.add(topLight);

  // 3D Extruded Terrain Mesh
  const shape = new THREE.Shape();
  shape.moveTo(gx(ODISHA_BORDER[0][0]), gy(ODISHA_BORDER[0][1]));
  for (let i = 1; i < ODISHA_BORDER.length; i++) {
    shape.lineTo(gx(ODISHA_BORDER[i][0]), gy(ODISHA_BORDER[i][1]));
  }
  shape.closePath();

  const mapGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.36,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.05,
    bevelSegments: 4,
  });
  mapGeo.computeVertexNormals();

  const mapMat = new THREE.MeshStandardMaterial({
    color: 0x132e4d,
    roughness: 0.28,
    metalness: 0.78,
    emissive: 0x0b2545,
    emissiveIntensity: 0.45,
  });

  const mapMesh = new THREE.Mesh(mapGeo, mapMat);
  world.add(mapMesh);

  // Glowing Golden Perimeter Border
  const borderPts = ODISHA_BORDER.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.02));
  borderPts.push(borderPts[0].clone());

  const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
  const borderMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
  world.add(new THREE.Line(borderGeo, borderMat));

  // Outer Shimmer
  const glowPts = borderPts.map(p => { const c = p.clone(); c.z += 0.006; return c; });
  const glowGeo = new THREE.BufferGeometry().setFromPoints(glowPts);
  const glowMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending });
  world.add(new THREE.Line(glowGeo, glowMat));

  // Coastal Shimmer along Bay of Bengal
  const coastPts = ODISHA_BORDER.slice(75, 95).map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.03));
  const coastGeo = new THREE.BufferGeometry().setFromPoints(coastPts);
  const coastMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
  world.add(new THREE.Line(coastGeo, coastMat));

  // Internal Zonal Division Lines
  const INTERNAL_LINES = [
    [[85.80, 21.40], [86.15, 21.05], [86.60, 20.85], [87.05, 20.80]],
    [[85.20, 20.35], [85.70, 20.38], [86.25, 20.20], [86.65, 20.00]],
    [[84.60, 21.65], [84.95, 21.15], [84.90, 20.60], [84.55, 20.30]],
    [[84.75, 19.80], [85.15, 19.65], [85.35, 19.55]],
    [[83.60, 20.40], [83.10, 20.10], [82.70, 19.80]],
  ];

  INTERNAL_LINES.forEach((line) => {
    const pts = line.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.015));
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.45 });
    world.add(new THREE.Line(g, m));
  });

  // Zone Beacons & Labels
  function makeBillboardLabel(zoneName, schoolCount, colorHex) {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 100;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(7, 21, 38, 0.92)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(8, 8, 304, 84, 12) : ctx.rect(8, 8, 304, 84);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(36, 42, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(zoneName, 58, 40);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(schoolCount, 58, 70);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const s = new THREE.Sprite(mat);
    s.scale.set(1.25, 0.39, 1);
    return s;
  }

  const beaconRings = [];
  const beaconPointers = [];
  const zonePositions = {};

  ZONES.forEach((zb) => {
    const pos = new THREE.Vector3(gx(zb.lon), gy(zb.lat), MAP_TOP_Z);
    zonePositions[zb.id] = pos;

    const pinGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.55, 12);
    pinGeo.rotateX(Math.PI / 2);
    const pinMat = new THREE.MeshStandardMaterial({
      color: zb.color,
      emissive: zb.color,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(pos.x, pos.y, pos.z + 0.28);
    world.add(pinMesh);
    beaconPointers.push(pinMesh);

    const sphereGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(pos.x, pos.y, pos.z + 0.56);
    world.add(sphereMesh);

    const ringGeo = new THREE.RingGeometry(0.04, 0.08, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: zb.color, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(pos.x, pos.y, pos.z + 0.02);
    world.add(ringMesh);
    beaconRings.push({ mesh: ringMesh, maxScale: 3.5, speed: 0.025 });

    const colorHexStr = '#' + zb.color.toString(16).padStart(6, '0');
    const label = makeBillboardLabel(zb.name, zb.count, colorHexStr);
    label.position.set(pos.x, pos.y + 0.38, pos.z + 0.72);
    world.add(label);
  });

  // Interconnecting Live Beam Network
  const bbsrPos = zonePositions['bhubaneswar'];
  if (bbsrPos) {
    ZONES.forEach((zb) => {
      if (zb.id === 'bhubaneswar') return;
      const targetPos = zonePositions[zb.id];
      if (!targetPos) return;

      const pts = [];
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = THREE.MathUtils.lerp(bbsrPos.x, targetPos.x, t);
        const y = THREE.MathUtils.lerp(bbsrPos.y, targetPos.y, t);
        const arcZ = Math.sin(t * Math.PI) * 0.45;
        pts.push(new THREE.Vector3(x, y, MAP_TOP_Z + arcZ + 0.04));
      }

      const curveGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      world.add(new THREE.Line(curveGeo, curveMat));
    });
  }

  // Interactive Mouse / Touch Dragging
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouseX;
    const dy = e.clientY - prevMouseY;
    world.rotation.y += dx * 0.007;
    world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + dy * 0.004, 0.25, 0.95);
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch Support
  let touchX = 0, touchY = 0;
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchX;
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy)) {
        world.rotation.y += dx * 0.008;
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }
    }
  }, { passive: true });

  // Resize
  function resize() {
    const parent = canvas.parentElement;
    const w = (parent ? parent.clientWidth : window.innerWidth);
    const h = (parent ? parent.clientHeight : 500) || 500;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    if (!isDragging && !reduced) {
      world.rotation.y += 0.0035;
    }

    world.position.y = Math.sin(elapsed * 1.2) * 0.04;

    beaconRings.forEach((br) => {
      br.mesh.scale.x += br.speed;
      br.mesh.scale.y += br.speed;
      br.mesh.material.opacity = Math.max(0, 1 - br.mesh.scale.x / br.maxScale);
      if (br.mesh.scale.x >= br.maxScale) {
        br.mesh.scale.set(1, 1, 1);
        br.mesh.material.opacity = 0.8;
      }
    });

    beaconPointers.forEach((pin, idx) => {
      pin.scale.z = 1 + Math.sin(elapsed * 2.5 + idx) * 0.08;
    });

    renderer.render(scene, camera);
  }
  animate();
})();
