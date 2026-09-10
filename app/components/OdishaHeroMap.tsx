'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ==========================================================================
   CINEMATIC 3D ODISHA STATE MAP
   Command-center style visualization with:
   - Extruded 3D terrain with metallic finish
   - Glowing golden zone beacons with pulsing rings
   - 200+ floating luminous particles
   - Animated connection lines with flowing pulse spheres
   - Radar sweep emanating from Bhubaneswar HQ
   - Dramatic entrance animation (map rises from darkness)
   - Slow cinematic camera orbit with vertical bob
   - Interactive zone highlighting on hover
   ========================================================================== */

export default function OdishaHeroMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==================== GEOGRAPHIC DATA ====================
    const BORDER: [number, number][] = [
      [86.75,22.58],[86.95,22.54],[87.18,22.35],[87.42,21.90],
      [87.48,21.65],[87.12,21.52],[86.98,21.45],[86.92,21.15],
      [86.95,20.85],[86.82,20.72],
      [86.75,20.45],[86.68,20.25],[86.35,19.98],
      [86.05,19.82],[85.75,19.75],[85.45,19.65],[85.20,19.52],
      [84.95,19.28],[84.75,19.12],[84.62,18.98],
      [84.25,18.88],[83.95,18.72],[83.72,18.52],[83.35,18.32],
      [82.90,18.22],[82.45,18.15],
      [81.95,18.05],[81.55,17.85],[81.42,18.12],[81.65,18.45],
      [82.02,18.85],[82.35,19.22],[82.25,19.75],[82.42,20.15],
      [82.38,20.55],[82.52,20.95],[82.72,21.25],
      [82.98,21.52],[83.35,21.78],[83.65,21.85],
      [83.82,22.02],[84.15,22.22],[84.62,22.38],[85.12,22.45],
      [85.52,22.32],[85.95,22.25],[86.35,22.42],[86.62,22.55]
    ];

    const ZONES = [
      { id: 'balasore',    name: 'Balasore',    lon: 86.93, lat: 21.49 },
      { id: 'cuttack',     name: 'Cuttack',     lon: 85.88, lat: 20.46 },
      { id: 'bhubaneswar', name: 'BBSR HQ',     lon: 85.82, lat: 20.29 },
      { id: 'zone-four',   name: 'Baripada',    lon: 86.72, lat: 21.93 },
      { id: 'sambalpur',   name: 'Sambalpur',   lon: 83.97, lat: 21.47 },
      { id: 'berhampur',   name: 'Berhampur',   lon: 84.79, lat: 19.31 },
    ];

    // Interior zonal division lines for map detail
    const DIVISIONS: [number, number][][] = [
      [[84.45,20.85],[84.75,21.15],[85.12,21.35],[85.45,21.65]],
      [[85.85,20.45],[86.25,20.85],[86.55,21.25]],
      [[84.65,19.25],[83.95,19.35],[83.25,19.15],[82.65,18.95]],
    ];

    const LON0 = 84.45, LAT0 = 20.21, SC = 0.88;
    const gx = (lon: number) => (lon - LON0) * SC;
    const gy = (lat: number) => (lat - LAT0) * SC * 1.08;
    const MAP_TOP_Z = 0.32; // Top surface of extruded map

    // ==================== HELPERS ====================
    function makeGlowTexture(): THREE.Texture {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.2, 'rgba(255,210,120,0.8)');
      g.addColorStop(0.5, 'rgba(255,170,40,0.3)');
      g.addColorStop(1, 'rgba(255,140,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    function makeLabel(text: string): THREE.Sprite {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 64;
      const ctx = c.getContext('2d')!;
      ctx.font = 'bold 26px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 128, 32);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false });
      const s = new THREE.Sprite(mat);
      s.scale.set(0.75, 0.19, 1);
      disposables.push(tex, mat);
      return s;
    }

    // Track disposable resources
    const disposables: { dispose(): void }[] = [];
    function track<T extends { dispose(): void }>(o: T): T { disposables.push(o); return o; }

    // ==================== SCENE ====================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050d1a, 0.045);

    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x050d1a, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Clean existing children & append canvas
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const world = new THREE.Group();
    world.rotation.x = 0.55;
    world.scale.setScalar(0.01); // Start tiny for entrance animation
    scene.add(world);

    // ==================== LIGHTING ====================
    scene.add(new THREE.AmbientLight(0x1a2a4a, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffd700, 0.9);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0066ff, 0.55);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.25);
    topLight.position.set(0, 10, 2);
    scene.add(topLight);

    // ==================== GRID FLOOR ====================
    const gridHelper = new THREE.GridHelper(12, 50, 0x0a3d5c, 0x061f30);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -0.08;
    const gridMats = Array.isArray(gridHelper.material) ? gridHelper.material : [gridHelper.material];
    gridMats.forEach(m => { m.transparent = true; m.opacity = 0.25; m.depthWrite = false; });
    world.add(gridHelper);

    // ==================== 3D TERRAIN (EXTRUDED ODISHA) ====================
    const shape = new THREE.Shape();
    shape.moveTo(gx(BORDER[0][0]), gy(BORDER[0][1]));
    for (let i = 1; i < BORDER.length; i++) shape.lineTo(gx(BORDER[i][0]), gy(BORDER[i][1]));
    shape.closePath();

    const mapGeo = track(new THREE.ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
    }));

    // Subtle terrain relief on top vertices
    const pos = mapGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z > 0.22) pos.setZ(i, z + (Math.random() - 0.5) * 0.04);
    }
    pos.needsUpdate = true;
    mapGeo.computeVertexNormals();

    const mapMat = track(new THREE.MeshStandardMaterial({
      color: 0x0f1d30,
      metalness: 0.75,
      roughness: 0.28,
      emissive: 0x0a1525,
      emissiveIntensity: 0.25,
    }));
    const mapMesh = new THREE.Mesh(mapGeo, mapMat);
    world.add(mapMesh);

    // ==================== INTERIOR DIVISION LINES ====================
    DIVISIONS.forEach(div => {
      const pts = div.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.01));
      const g = track(new THREE.BufferGeometry().setFromPoints(pts));
      const m = track(new THREE.LineBasicMaterial({ color: 0x1a3050, transparent: true, opacity: 0.5 }));
      world.add(new THREE.Line(g, m));
    });

    // ==================== GOLDEN BORDER OUTLINE ====================
    const borderPts = BORDER.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.01));
    borderPts.push(borderPts[0].clone());

    const borderGeo = track(new THREE.BufferGeometry().setFromPoints(borderPts));
    world.add(new THREE.Line(borderGeo, track(new THREE.LineBasicMaterial({ color: 0xd4a843 }))));

    // Outer glow layer
    const glowBorderGeo = track(new THREE.BufferGeometry().setFromPoints(
      borderPts.map(p => { const c = p.clone(); c.z += 0.005; return c; })
    ));
    world.add(new THREE.Line(glowBorderGeo, track(new THREE.LineBasicMaterial({
      color: 0xfbbf24, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending,
    }))));

    // Coastal shimmer (Bay of Bengal – eastern indices)
    const coastPts = BORDER.slice(1, 20).map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.02));
    const coastGeo = track(new THREE.BufferGeometry().setFromPoints(coastPts));
    world.add(new THREE.Line(coastGeo, track(new THREE.LineBasicMaterial({
      color: 0x38bdf8, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending,
    }))));

    // ==================== ZONE BEACONS ====================
    interface Beacon {
      id: string;
      base: THREE.Mesh;
      beam: THREE.Mesh;
      ring: THREE.Mesh;
      label: THREE.Sprite;
      beamMat: THREE.MeshBasicMaterial;
      ringMat: THREE.MeshBasicMaterial;
      baseMat: THREE.MeshBasicMaterial;
      ringPhase: number;
      pos: THREE.Vector3;
    }
    const beacons: Beacon[] = [];
    const beamHeight = 1.4;

    const glowTex = makeGlowTexture();
    disposables.push(glowTex);

    ZONES.forEach((zone, idx) => {
      const zx = gx(zone.lon), zy = gy(zone.lat);
      const isHQ = zone.id === 'bhubaneswar';

      // Base glowing sphere
      const baseGeo = track(new THREE.SphereGeometry(isHQ ? 0.08 : 0.06, 16, 16));
      const baseMat = track(new THREE.MeshBasicMaterial({
        color: isHQ ? 0xffffff : 0xfbbf24,
        transparent: true, opacity: 0.95,
      }));
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(zx, zy, MAP_TOP_Z + 0.02);
      world.add(base);

      // Vertical beam pillar
      const bGeo = track(new THREE.CylinderGeometry(0.012, 0.022, beamHeight, 8));
      bGeo.rotateX(Math.PI / 2);
      bGeo.translate(0, 0, beamHeight / 2);
      const beamMat = track(new THREE.MeshBasicMaterial({
        color: isHQ ? 0xffffff : 0xfbbf24,
        transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const beam = new THREE.Mesh(bGeo, beamMat);
      beam.position.set(zx, zy, MAP_TOP_Z);
      world.add(beam);

      // Pulsing ring
      const ringGeo = track(new THREE.TorusGeometry(0.12, 0.008, 8, 32));
      const ringMat = track(new THREE.MeshBasicMaterial({
        color: 0xfbbf24, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(zx, zy, MAP_TOP_Z + 0.01);
      world.add(ring);

      // Top glow sprite
      const topGlowMat = track(new THREE.SpriteMaterial({
        map: glowTex, color: 0xfbbf24, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const topGlow = new THREE.Sprite(topGlowMat);
      topGlow.scale.set(0.35, 0.35, 1);
      topGlow.position.set(zx, zy, MAP_TOP_Z + beamHeight);
      world.add(topGlow);

      // Text label
      const label = makeLabel(zone.name);
      label.position.set(zx, zy, MAP_TOP_Z + beamHeight + 0.22);
      world.add(label);

      beacons.push({
        id: zone.id, base, beam, ring, label, beamMat, ringMat, baseMat,
        ringPhase: idx * 0.7, // Stagger the pulse timing
        pos: new THREE.Vector3(zx, zy, MAP_TOP_Z),
      });
    });

    // ==================== PARTICLE SYSTEM ====================
    const PARTICLE_COUNT = 220;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pSpeeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 6;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPositions[i * 3 + 2] = Math.random() * 3 + 0.4;
      pSpeeds[i] = 0.04 + Math.random() * 0.06;
    }

    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const particleMat = track(new THREE.PointsMaterial({
      color: 0xfbbf24, size: 0.045,
      map: glowTex, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const particles = new THREE.Points(particleGeo, particleMat);
    world.add(particles);

    // ==================== CONNECTION LINES (HQ → ZONES) ====================
    interface FlowPulse {
      mesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      t: number;
      speed: number;
    }
    const flowPulses: FlowPulse[] = [];

    const hqIdx = ZONES.findIndex(z => z.id === 'bhubaneswar');
    const hqPos = new THREE.Vector3(gx(ZONES[hqIdx].lon), gy(ZONES[hqIdx].lat), MAP_TOP_Z + 0.04);

    ZONES.forEach((zone, idx) => {
      if (idx === hqIdx) return; // Skip self-connection

      const endPos = new THREE.Vector3(gx(zone.lon), gy(zone.lat), MAP_TOP_Z + 0.04);
      const midPos = new THREE.Vector3(
        (hqPos.x + endPos.x) / 2,
        (hqPos.y + endPos.y) / 2,
        MAP_TOP_Z + 0.04 + hqPos.distanceTo(endPos) * 0.25,
      );
      const curve = new THREE.QuadraticBezierCurve3(hqPos, midPos, endPos);

      // Static connection line
      const lineGeo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)));
      const lineMat = track(new THREE.LineBasicMaterial({
        color: 0x06b6d4, transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending,
      }));
      world.add(new THREE.Line(lineGeo, lineMat));

      // 3 flow pulse spheres per connection
      for (let p = 0; p < 3; p++) {
        const pGeo = track(new THREE.SphereGeometry(0.028, 8, 8));
        const pMat = track(new THREE.MeshBasicMaterial({
          color: 0x06b6d4, transparent: true, opacity: 0.85,
          blending: THREE.AdditiveBlending,
        }));
        const pMesh = new THREE.Mesh(pGeo, pMat);
        world.add(pMesh);

        flowPulses.push({
          mesh: pMesh, curve,
          t: p / 3, // Stagger along path
          speed: 0.18 + Math.random() * 0.08,
        });
      }
    });

    // ==================== RADAR SWEEP ====================
    const sweepAngle = Math.PI / 5;
    const sweepShape = new THREE.Shape();
    sweepShape.moveTo(0, 0);
    for (let a = 0; a <= sweepAngle; a += sweepAngle / 20) {
      sweepShape.lineTo(Math.cos(a) * 3.5, Math.sin(a) * 3.5);
    }
    sweepShape.lineTo(0, 0);

    const sweepGeo = track(new THREE.ShapeGeometry(sweepShape));
    const sweepMat = track(new THREE.MeshBasicMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0.08,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    }));
    const sweepMesh = new THREE.Mesh(sweepGeo, sweepMat);
    sweepMesh.position.set(gx(85.82), gy(20.29), MAP_TOP_Z + 0.02);
    world.add(sweepMesh);

    // ==================== ANIMATION STATE ====================
    let entranceT = 0;
    const entranceDur = reduced ? 0.01 : 2.2;
    let activeZoneId: string | null = null;
    let mouseNX = 0, mouseNY = 0;
    const clock = new THREE.Clock();
    let animId: number;

    // ==================== ANIMATION LOOP ====================
    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // --- Entrance Animation ---
      if (entranceT < 1) {
        entranceT = Math.min(1, entranceT + delta / entranceDur);
        const t = 1 - Math.pow(1 - entranceT, 3);
        world.scale.setScalar(t);
        world.position.y = (1 - t) * -1.5;
      }

      // --- Camera Orbit ---
      if (!reduced) {
        const angle = elapsed * 0.12;
        const radius = 7.2;
        camera.position.x = Math.sin(angle) * radius + mouseNX * 0.4;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = 3.2 + Math.sin(elapsed * 0.22) * 0.35 + mouseNY * 0.25;
        camera.lookAt(0, 0, 0);
      }

      // --- Zone Beacons Pulse ---
      beacons.forEach(b => {
        const isActive = b.id === activeZoneId;
        const pSpeed = isActive ? 1.6 : 0.7;
        const phase = (elapsed * pSpeed + b.ringPhase) % 2.0;
        const ringScale = 0.5 + phase * 1.2;
        b.ring.scale.setScalar(ringScale);
        b.ringMat.opacity = Math.max(0, 0.6 - phase * 0.35);

        // Beacon brightness
        const targetOpacity = isActive ? 0.7 : 0.35;
        b.beamMat.opacity += (targetOpacity - b.beamMat.opacity) * delta * 5;
        b.baseMat.opacity = isActive ? 1.0 : 0.9;

        // Subtle vertical float on base sphere
        b.base.position.z = MAP_TOP_Z + 0.02 + Math.sin(elapsed * 1.5 + b.ringPhase) * 0.01;
      });

      // --- Particles ---
      const pArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pArr[i * 3 + 2] += pSpeeds[i] * delta * (reduced ? 0 : 1);
        if (pArr[i * 3 + 2] > 3.8) {
          pArr[i * 3 + 2] = 0.35;
          pArr[i * 3] = (Math.random() - 0.5) * 6;
          pArr[i * 3 + 1] = (Math.random() - 0.5) * 5;
        }
        // Gentle horizontal drift
        if (!reduced) {
          pArr[i * 3]     += Math.sin(elapsed * 0.4 + i * 0.3) * delta * 0.012;
          pArr[i * 3 + 1] += Math.cos(elapsed * 0.4 + i * 0.3) * delta * 0.012;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // --- Flow Pulses ---
      flowPulses.forEach(fp => {
        fp.t = (fp.t + delta * fp.speed) % 1;
        const pt = fp.curve.getPointAt(fp.t);
        fp.mesh.position.copy(pt);
        // Subtle size pulse
        const s = 0.7 + Math.sin(fp.t * Math.PI) * 0.5;
        fp.mesh.scale.setScalar(s);
      });

      // --- Radar Sweep ---
      if (!reduced) {
        sweepMesh.rotation.z = elapsed * 0.35;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    // ==================== EVENT LISTENERS ====================
    const onZoneHover = (e: Event) => {
      activeZoneId = (e as CustomEvent).detail?.zoneId ?? null;
    };
    window.addEventListener('aopstsma:zone-hover', onZoneHover);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(container);

    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseNY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouse);

    // ==================== CLEANUP ====================
    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
      container.removeEventListener('mousemove', onMouse);
      window.removeEventListener('aopstsma:zone-hover', onZoneHover);
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="odisha-3d-viewport" />;
}
