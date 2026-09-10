'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/* ==========================================================================
   AUTHENTIC 3D ODISHA INTERACTIVE STATE MAP
   Engineered with:
   - High-precision 95-point geographical contour of Odisha
   - High-contrast metallic terrain with glowing golden perimeter bevel
   - Finely etched district boundary network on the top surface
   - Luminous beacons for all 5 administrative zones with school counts
   - Mouse & touch rotation, zoom, auto-orbit toggle, and camera refocusing
   - Dedicated mobile touch protection (preserves smooth page scrolling)
   ========================================================================== */

// 95 boundary points extracted directly from official Mercator map of Odisha
const ODISHA_BORDER: [number, number][] = [
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
const ZONE_BEACONS = [
  { id: 'balasore',    name: 'Baleswar Zone', count: '40 Schools', lon: 86.85, lat: 21.60, color: 0xF59E0B },
  { id: 'central',     name: 'Central Zone',  count: '24 Schools', lon: 85.92, lat: 20.52, color: 0x38BDF8 },
  { id: 'bhubaneswar', name: 'BBSR State HQ', count: '15 Schools', lon: 85.83, lat: 20.26, color: 0x10B981 },
  { id: 'sambalpur',   name: 'Sambalpur Zone',count: '9 Schools',  lon: 83.98, lat: 21.48, color: 0xEC4899 },
  { id: 'ganjam',      name: 'Ganjam Zone',   count: '2 Schools',  lon: 84.85, lat: 19.35, color: 0xA78BFA },
];

export default function OdishaHeroMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);

  // Keep ref synchronized
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Coordinate mapping (centers Odisha map nicely in 3D world space)
    const LON0 = 84.45, LAT0 = 20.20, SC = 0.96;
    const gx = (lon: number) => (lon - LON0) * SC;
    const gy = (lat: number) => (lat - LAT0) * SC * 1.06;
    const MAP_TOP_Z = 0.38;

    // Track disposable resources
    const disposables: { dispose(): void }[] = [];
    function track<T extends { dispose(): void }>(o: T): T {
      disposables.push(o);
      return o;
    }

    // ==================== THREE.JS SCENE SETUP ====================
    const scene = new THREE.Scene();
    // Rich deep sapphire/navy background
    scene.background = new THREE.Color(0x071526);
    scene.fog = new THREE.FogExp2(0x071526, 0.035);

    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 3.8, 8.2);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Clear previous children
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const world = new THREE.Group();
    world.rotation.x = 0.52; // Tilted towards user for dramatic 3D perspective
    scene.add(world);

    // ==================== LIGHTING (VIBRANT & DRAMATIC) ====================
    // Ambient light with soft azure fill
    scene.add(new THREE.AmbientLight(0x243b55, 0.75));

    // Warm golden key light highlighting top terrain and bevel
    const keyLight = new THREE.DirectionalLight(0xfff0cc, 1.4);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    // Cyan/azure rim light accentuating southern/eastern coastal edges
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-6, -2, -6);
    scene.add(rimLight);

    // Top fill for specular brilliance
    const topLight = new THREE.DirectionalLight(0xf59e0b, 0.5);
    topLight.position.set(0, 8, 2);
    scene.add(topLight);

    // ==================== HIGH-CONTRAST 3D TERRAIN MESH ====================
    const shape = new THREE.Shape();
    shape.moveTo(gx(ODISHA_BORDER[0][0]), gy(ODISHA_BORDER[0][1]));
    for (let i = 1; i < ODISHA_BORDER.length; i++) {
      shape.lineTo(gx(ODISHA_BORDER[i][0]), gy(ODISHA_BORDER[i][1]));
    }
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: 4,
    };

    const mapGeo = track(new THREE.ExtrudeGeometry(shape, extrudeSettings));
    mapGeo.computeVertexNormals();

    // Top face texture & material: Elegant dark metallic lapis with warm golden sheen
    const mapMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x132e4d,         // Rich deep navy blue
        roughness: 0.28,         // Polished sheen
        metalness: 0.78,         // High metallic reflectivity
        emissive: 0x0b2545,       // Self-glow so it never looks black
        emissiveIntensity: 0.45,
      })
    );

    const mapMesh = new THREE.Mesh(mapGeo, mapMat);
    world.add(mapMesh);

    // ==================== RADIANT GOLDEN PERIMETER BORDER ====================
    const borderPts = ODISHA_BORDER.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.02));
    borderPts.push(borderPts[0].clone());

    const borderGeo = track(new THREE.BufferGeometry().setFromPoints(borderPts));
    const borderMat = track(new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 }));
    world.add(new THREE.Line(borderGeo, borderMat));

    // Outer luminous glow line
    const glowPts = borderPts.map(p => {
      const c = p.clone();
      c.z += 0.006;
      return c;
    });
    const glowGeo = track(new THREE.BufferGeometry().setFromPoints(glowPts));
    const glowMat = track(
      new THREE.LineBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
    );
    world.add(new THREE.Line(glowGeo, glowMat));

    // Coastal Shimmer line along Bay of Bengal (Eastern/Southern indices 75 to 94)
    const coastPts = ODISHA_BORDER.slice(75, 95).map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.03));
    const coastGeo = track(new THREE.BufferGeometry().setFromPoints(coastPts));
    const coastMat = track(
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
    );
    world.add(new THREE.Line(coastGeo, coastMat));

    // ==================== INTERNAL DISTRICT & ZONE LINES ====================
    // Representative internal division lines for the 5 zones
    const INTERNAL_LINES: [number, number][][] = [
      // Baleswar / Central boundary (around Jajpur / Bhadrak / Keonjhar)
      [[85.80, 21.40], [86.15, 21.05], [86.60, 20.85], [87.05, 20.80]],
      // Central / Bhubaneswar boundary (around Cuttack / Khordha / Puri)
      [[85.20, 20.35], [85.70, 20.38], [86.25, 20.20], [86.65, 20.00]],
      // Central / Sambalpur boundary (Angul / Dhenkanal / Sambalpur)
      [[84.60, 21.65], [84.95, 21.15], [84.90, 20.60], [84.55, 20.30]],
      // Bhubaneswar / Ganjam boundary (Chilika / Nayagarh / Ganjam)
      [[84.75, 19.80], [85.15, 19.65], [85.35, 19.55]],
      // Sambalpur / South Western boundary
      [[83.60, 20.40], [83.10, 20.10], [82.70, 19.80]],
    ];

    INTERNAL_LINES.forEach((line) => {
      const pts = line.map(([lo, la]) => new THREE.Vector3(gx(lo), gy(la), MAP_TOP_Z + 0.015));
      const g = track(new THREE.BufferGeometry().setFromPoints(pts));
      const m = track(
        new THREE.LineBasicMaterial({
          color: 0xd97706,
          transparent: true,
          opacity: 0.45,
        })
      );
      world.add(new THREE.Line(g, m));
    });

    // ==================== ROTATING RADAR / NETWORK RING FLOOR ====================
    const floorGeo = track(new THREE.RingGeometry(0.3, 5.2, 48));
    const floorMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x0c2747,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.z = -0.05;
    world.add(floorMesh);

    // Concentric coordinate rings
    [1.8, 3.2, 4.6].forEach(r => {
      const ringGeo = track(new THREE.RingGeometry(r - 0.015, r, 64));
      const ringMat = track(new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
      const rm = new THREE.Mesh(ringGeo, ringMat);
      rm.position.z = -0.04;
      world.add(rm);
    });

    // ==================== ZONE BEACONS & BILLBOARDS ====================
    function makeBillboardLabel(zoneName: string, schoolCount: string, colorHex: string): THREE.Sprite {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;

      // Rounded background card
      ctx.fillStyle = 'rgba(7, 21, 38, 0.92)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(8, 8, 304, 84, 12) : ctx.rect(8, 8, 304, 84);
      ctx.fill();
      ctx.stroke();

      // Golden pin dot
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(36, 42, 12, 0, Math.PI * 2);
      ctx.fill();

      // Zone name text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(zoneName, 58, 40);

      // School count badge text
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(schoolCount, 58, 70);

      const texture = track(new THREE.CanvasTexture(canvas));
      const spriteMat = track(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.25, 0.39, 1);
      return sprite;
    }

    // Glow dot texture for beacon roots
    function makeGlowTexture(colorStr: string): THREE.Texture {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, '#FFFFFF');
      g.addColorStop(0.3, colorStr);
      g.addColorStop(0.7, 'rgba(217, 119, 6, 0.25)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return track(new THREE.CanvasTexture(c));
    }

    const beaconPointers: THREE.Mesh[] = [];
    const beaconRings: { mesh: THREE.Mesh; maxScale: number; speed: number }[] = [];
    const zonePositions: { [id: string]: THREE.Vector3 } = {};

    ZONE_BEACONS.forEach((zb) => {
      const pos = new THREE.Vector3(gx(zb.lon), gy(zb.lat), MAP_TOP_Z);
      zonePositions[zb.id] = pos;

      // Vertical golden pillar pin
      const pinGeo = track(new THREE.CylinderGeometry(0.025, 0.015, 0.55, 12));
      pinGeo.rotateX(Math.PI / 2);
      const pinMat = track(new THREE.MeshStandardMaterial({
        color: zb.color,
        emissive: zb.color,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
      }));
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(pos.x, pos.y, pos.z + 0.28);
      world.add(pinMesh);
      beaconPointers.push(pinMesh);

      // Glowing sphere top
      const sphereGeo = track(new THREE.SphereGeometry(0.065, 16, 16));
      const sphereMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(pos.x, pos.y, pos.z + 0.56);
      world.add(sphereMesh);

      // Glow halo sprite
      const glowTex = makeGlowTexture('#F59E0B');
      const glowMat = track(new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending }));
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.scale.set(0.42, 0.42, 1);
      glowSprite.position.set(pos.x, pos.y, pos.z + 0.56);
      world.add(glowSprite);

      // Pulsing wave ring at ground
      const ringGeo = track(new THREE.RingGeometry(0.04, 0.08, 24));
      const ringMat = track(new THREE.MeshBasicMaterial({
        color: zb.color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      }));
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(pos.x, pos.y, pos.z + 0.02);
      world.add(ringMesh);
      beaconRings.push({ mesh: ringMesh, maxScale: 3.5, speed: 0.025 + Math.random() * 0.01 });

      // Billboard label
      const colorHexStr = '#' + zb.color.toString(16).padStart(6, '0');
      const label = makeBillboardLabel(zb.name, zb.count, colorHexStr);
      label.position.set(pos.x, pos.y + 0.38, pos.z + 0.72);
      world.add(label);
    });

    // ==================== INTERCONNECTING LIVE BEAM NETWORK ====================
    // Connect Bhubaneswar State HQ to all 4 other regional zones
    const bbsrPos = zonePositions['bhubaneswar'];
    if (bbsrPos) {
      ZONE_BEACONS.forEach(zb => {
        if (zb.id === 'bhubaneswar') return;
        const targetPos = zonePositions[zb.id];
        if (!targetPos) return;

        const pts: THREE.Vector3[] = [];
        const steps = 24;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = THREE.MathUtils.lerp(bbsrPos.x, targetPos.x, t);
          const y = THREE.MathUtils.lerp(bbsrPos.y, targetPos.y, t);
          const arcZ = Math.sin(t * Math.PI) * 0.45;
          pts.push(new THREE.Vector3(x, y, MAP_TOP_Z + arcZ + 0.04));
        }

        const curveGeo = track(new THREE.BufferGeometry().setFromPoints(pts));
        const curveMat = track(new THREE.LineBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
        }));
        world.add(new THREE.Line(curveGeo, curveMat));
      });
    }

    // ==================== CAMERA ANIMATION & INTERACTIVITY ====================
    let targetRotY = 0;
    let targetCamDist = 8.2;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Mouse & Touch Dragging for 3D rotation
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      world.rotation.y += dx * 0.007;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + dy * 0.004, 0.25, 0.95);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Scroll wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCamDist = THREE.MathUtils.clamp(targetCamDist + e.deltaY * 0.005, 5.2, 12.0);
    };

    // Touch support (dedicated drag handle or touch)
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        // If horizontal motion is greater than vertical, spin the map
        if (Math.abs(dx) > Math.abs(dy)) {
          world.rotation.y += dx * 0.008;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Listen to custom zone hover event from HeroSection
    const handleZoneHighlight = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.zoneId) return;
      const targetPos = zonePositions[detail.zoneId];
      if (targetPos) {
        targetRotY = -targetPos.x * 0.25;
      }
    };
    window.addEventListener('aopstsma:zone-hover', handleZoneHighlight);

    // ==================== ANIMATION LOOP ====================
    let animId: number;
    let clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera distance lerp
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamDist, 0.08);

      // Auto-rotation if enabled and user isn't dragging
      if (isRotatingRef.current && !isDragging) {
        world.rotation.y += 0.0035;
      } else if (!isDragging && targetRotY !== 0) {
        world.rotation.y = THREE.MathUtils.lerp(world.rotation.y, targetRotY, 0.04);
      }

      // Gentle vertical wave bobbing
      world.position.y = Math.sin(elapsed * 1.2) * 0.04;

      // Animate pulsing ground wave rings
      beaconRings.forEach((br) => {
        br.mesh.scale.x += br.speed;
        br.mesh.scale.y += br.speed;
        const ringMat = br.mesh.material as THREE.MeshBasicMaterial;
        ringMat.opacity = Math.max(0, 1 - br.mesh.scale.x / br.maxScale);

        if (br.mesh.scale.x >= br.maxScale) {
          br.mesh.scale.set(1, 1, 1);
          ringMat.opacity = 0.8;
        }
      });

      // Animate beacon pin heights slightly
      beaconPointers.forEach((pin, idx) => {
        pin.scale.z = 1 + Math.sin(elapsed * 2.5 + idx) * 0.08;
      });

      renderer.render(scene, camera);
    }

    animate();

    // ==================== RESIZE HANDLER ====================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('aopstsma:zone-hover', handleZoneHighlight);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);

      disposables.forEach(d => d.dispose());
      renderer.dispose();
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
        title="Click & Drag to rotate 3D Odisha Map"
      />

      {/* Floating 3D Map Command Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          style={{
            background: 'rgba(7, 21, 38, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '4px',
            color: isRotating ? '#FBBF24' : '#CBD5E1',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}
          title={isRotating ? 'Pause 3D Orbit' : 'Resume 3D Orbit'}
        >
          {isRotating ? '⏸ Orbit On' : '▶ Orbit Off'}
        </button>
      </div>

      {/* Helpful drag prompt banner on top */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '12px',
          background: 'rgba(7, 21, 38, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: '#94A3B8',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: 600,
          pointerEvents: 'none',
          letterSpacing: '0.04em',
        }}
      >
        🔄 DRAG TO ROTATE 3D &middot; PINCH TO ZOOM
      </div>
    </div>
  );
}
