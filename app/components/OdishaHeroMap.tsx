'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OdishaHeroMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // High-fidelity, authentic geographic boundary of Odisha State (Lat/Lon)
    // Tracing from Northern Mayurbhanj clockwise along Bay of Bengal coastline to South Koraput/Malkangiri and Western border
    const ODISHA_GEO_BORDER: [number, number][] = [
      // 1. Northern crown (Mayurbhanj / Balasore border with Bengal)
      [86.75, 22.58], [86.95, 22.54], [87.18, 22.35], [87.42, 21.90],
      // 2. Coastal Balasore & Subarnarekha mouth
      [87.48, 21.65], [87.12, 21.52], [86.98, 21.45], [86.92, 21.15],
      // 3. Bhadrak, Dhamra & Chandbali coast
      [86.95, 20.85], [86.82, 20.72],
      // 4. Kendrapara & Paradip (Mahanadi River estuary bulge)
      [86.75, 20.45], [86.68, 20.25], [86.35, 19.98],
      // 5. Puri coastline & Chilika Lake ocean spit
      [86.05, 19.82], [85.75, 19.75], [85.45, 19.65], [85.20, 19.52],
      // 6. Ganjam / Berhampur / Gopalpur coastal stretch
      [84.95, 19.28], [84.75, 19.12], [84.62, 18.98],
      // 7. Southern border (Gajapati / Rayagada / Koraput / Andhra border)
      [84.25, 18.88], [83.95, 18.72], [83.72, 18.52], [83.35, 18.32],
      [82.90, 18.22], [82.45, 18.15],
      // 8. Malkangiri southern tip & Sabari River basin
      [81.95, 18.05], [81.55, 17.85], [81.42, 18.12], [81.65, 18.45],
      // 9. Koraput / Nabarangpur western border (Chhattisgarh border)
      [82.02, 18.85], [82.35, 19.22], [82.25, 19.75], [82.42, 20.15],
      // 10. Nuapada / Kalahandi western range
      [82.38, 20.55], [82.52, 20.95], [82.72, 21.25],
      // 11. Bargarh / Sambalpur (Mahanadi upper basin)
      [82.98, 21.52], [83.35, 21.78], [83.65, 21.85],
      // 12. Jharsuguda & Sundargarh (Northern-Western plateau)
      [83.82, 22.02], [84.15, 22.22], [84.62, 22.38], [85.12, 22.45],
      // 13. Keonjhar & Mayurbhanj northern return loop
      [85.52, 22.32], [85.95, 22.25], [86.35, 22.42], [86.62, 22.55]
    ];

    // Authentic District/Zonal Interior Division Lines (for high realism)
    const INTERIOR_ZONAL_LINES: [number, number][][] = [
      // Central to Western divide (Angul-Sambalpur)
      [[84.45, 20.85], [84.75, 21.15], [85.12, 21.35], [85.45, 21.65]],
      // Coastal delta divide (Cuttack to Balasore)
      [[85.85, 20.45], [86.25, 20.85], [86.55, 21.25]],
      // Southern range divide (Ganjam to Koraput)
      [[84.65, 19.25], [83.95, 19.35], [83.25, 19.15], [82.65, 18.95]]
    ];

    const ZONES = [
      { id: 'balasore', name: 'Balasore Zone', lon: 86.93, lat: 21.49, count: '30 Schools', district: 'Balasore, Bhadrak' },
      { id: 'cuttack', name: 'Cuttack Zone', lon: 85.88, lat: 20.46, count: '18 Schools', district: 'Cuttack, Kendrapara, Jajpur' },
      { id: 'bhubaneswar', name: 'Bhubaneswar HQ', lon: 85.82, lat: 20.29, count: 'State Capital', district: 'Khordha, Puri, Nayagarh' },
      { id: 'zone-four', name: 'Baripada Zone', lon: 86.72, lat: 21.93, count: 'North Registry', district: 'Mayurbhanj, Keonjhar' },
      { id: 'sambalpur', name: 'Sambalpur Zone', lon: 83.97, lat: 21.47, count: '8 Schools', district: 'Sambalpur, Bargarh, Jharsuguda' },
      { id: 'berhampur', name: 'Berhampur Zone', lon: 84.79, lat: 19.31, count: 'South Registry', district: 'Ganjam, Gajapati, Koraput' }
    ];

    // Coordinate conversion mapping
    const LON0 = 84.35, LAT0 = 20.25, SCALE = 1.42;
    const px = (lon: number) => (lon - LON0) * SCALE;
    const py = (lat: number) => (lat - LAT0) * SCALE * 1.08;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, -1.2, 8.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const world = new THREE.Group();
    // Dignified, calm presentation angle (viewing the map like an architectural relief model)
    world.rotation.x = 0.42;
    world.rotation.y = -0.08;
    world.position.set(0.65, 0.15, 0);
    scene.add(world);

    // ============ REALISTIC CALM LIGHTING ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Warm main sun light casting soft specular highlights
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
    sunLight.position.set(6, 9, 8);
    scene.add(sunLight);

    // Golden soft accent light
    const goldAccent = new THREE.PointLight(0xf59e0b, 1.4, 16);
    goldAccent.position.set(2, 2, 4);
    scene.add(goldAccent);

    // Executive cool blue fill light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    // ============ BASE PEDESTAL (Architectural Mount) ============
    const pedestalGeo = new THREE.CylinderGeometry(4.6, 4.8, 0.25, 48);
    pedestalGeo.rotateX(Math.PI / 2);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x071526,
      roughness: 0.7,
      metalness: 0.2,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.z = -0.22;
    world.add(pedestalMesh);

    // Pedestal gold accent ring
    const ringBorderGeo = new THREE.RingGeometry(4.55, 4.65, 48);
    const ringBorderMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      side: THREE.DoubleSide,
    });
    const pedestalRing = new THREE.Mesh(ringBorderGeo, ringBorderMat);
    pedestalRing.position.z = -0.09;
    world.add(pedestalRing);

    // ============ ACCURATE 3D ODISHA RELIEF SLAB ============
    const shape = new THREE.Shape();
    ODISHA_GEO_BORDER.forEach(([lon, lat], i) => {
      const x = px(lon);
      const y = py(lat);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 4,
    };

    const mapGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Material: Executive Royal Navy stone with fine sheen
    const mapMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c2748,
      roughness: 0.28,
      metalness: 0.5,
    });
    const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial);
    world.add(mapMesh);

    // Coastline & Perimeter Gold Inlay Line
    const borderPoints: THREE.Vector3[] = [];
    ODISHA_GEO_BORDER.forEach(([lon, lat]) => {
      borderPoints.push(new THREE.Vector3(px(lon), py(lat), 0.47));
    });
    borderPoints.push(borderPoints[0].clone());

    const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 2,
    });
    const borderLine = new THREE.Line(borderGeo, borderMat);
    world.add(borderLine);

    // Etch interior regional boundary lines
    INTERIOR_ZONAL_LINES.forEach((lineCoords) => {
      const linePts = lineCoords.map(([lon, lat]) => new THREE.Vector3(px(lon), py(lat), 0.465));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
      });
      const internalLine = new THREE.Line(lineGeo, lineMat);
      world.add(internalLine);
    });

    // ============ ZONE PINS & REFINED BEACONS ============
    const pinsGroup = new THREE.Group();
    world.add(pinsGroup);

    const pinStemGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.36, 12);
    pinStemGeo.rotateX(Math.PI / 2);
    const pinHeadGeo = new THREE.SphereGeometry(0.11, 16, 16);

    const goldPinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xb45309,
      emissiveIntensity: 0.35,
    });

    const activePinMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    });

    const beaconRingGeo = new THREE.RingGeometry(0.14, 0.20, 28);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    const pinMeshes: { id: string; group: THREE.Group; head: THREE.Mesh; ring: THREE.Mesh }[] = [];

    ZONES.forEach((z) => {
      const pinGroup = new THREE.Group();
      const x = px(z.lon);
      const y = py(z.lat);
      const zPos = 0.48;

      pinGroup.position.set(x, y, zPos);

      // Pin stem
      const stem = new THREE.Mesh(pinStemGeo, goldPinMat);
      stem.position.z = 0.18;
      pinGroup.add(stem);

      // Pin head
      const head = new THREE.Mesh(pinHeadGeo, goldPinMat);
      head.position.z = 0.36;
      pinGroup.add(head);

      // Ground beacon ring
      const ring = new THREE.Mesh(beaconRingGeo, beaconRingMat.clone());
      ring.position.z = 0.01;
      pinGroup.add(ring);

      pinsGroup.add(pinGroup);
      pinMeshes.push({ id: z.id, group: pinGroup, head, ring });
    });

    // Network connection arcs from State HQ (Bhubaneswar) to member zones
    const capital = ZONES.find((z) => z.id === 'bhubaneswar')!;
    const capX = px(capital.lon);
    const capY = py(capital.lat);

    ZONES.filter((z) => z.id !== 'bhubaneswar').forEach((target) => {
      const tarX = px(target.lon);
      const tarY = py(target.lat);

      const midX = (capX + tarX) / 2;
      const midY = (capY + tarY) / 2;
      const midZ = 0.78;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(capX, capY, 0.52),
        new THREE.Vector3(midX, midY, midZ),
        new THREE.Vector3(tarX, tarY, 0.52)
      );

      const arcPoints = curve.getPoints(20);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xd97706,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      world.add(arcLine);
    });

    // ============ RESIZE HANDLER ============
    function onResize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;

      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);
    onResize();

    // ============ SMOOTH, CALM MOUSE PARALLAX ============
    let targetRotX = 0.42;
    let targetRotY = -0.08;
    let targetPosX = 0.65;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetRotY = -0.08 + normX * 0.16; // Calm, subtle tilt
      targetRotX = 0.42 - normY * 0.12;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle zone button hover signals
    const onZoneSignal = (e: Event) => {
      const customEvent = e as CustomEvent<{ zoneId: string | null }>;
      const zoneId = customEvent.detail?.zoneId;

      if (!zoneId) {
        targetPosX = 0.65;
        pinMeshes.forEach((p) => {
          p.head.material = goldPinMat;
          p.group.scale.set(1, 1, 1);
        });
        return;
      }

      const active = pinMeshes.find((p) => p.id === zoneId);
      if (active) {
        pinMeshes.forEach((p) => {
          if (p.id === zoneId) {
            p.head.material = activePinMat;
            p.group.scale.set(1.35, 1.35, 1.35);
          } else {
            p.head.material = goldPinMat;
            p.group.scale.set(0.9, 0.9, 0.9);
          }
        });
        targetPosX = 0.65 - active.group.position.x * 0.12;
      }
    };
    window.addEventListener('aopstsma:zone-hover', onZoneSignal);

    // ============ CALM ANIMATION LOOP ============
    let animId = 0;
    let clock = 0;

    const animate = () => {
      clock += 0.015;

      // Gentle, calm physics (no spinning, no chaotic waves)
      if (!reduced) {
        world.rotation.x += (targetRotX - world.rotation.x) * 0.05;
        world.rotation.y += (targetRotY - world.rotation.y) * 0.05;
        world.position.x += (targetPosX - world.position.x) * 0.05;
        // Extremely gentle architectural breathe
        world.position.y = 0.15 + Math.sin(clock * 0.5) * 0.02;

        // Gentle beacon ring pulse
        pinMeshes.forEach((p, idx) => {
          const s = 1 + ((Math.sin(clock * 1.5 + idx * 0.8) + 1) * 0.22);
          p.ring.scale.set(s, s, s);
          (p.ring.material as THREE.MeshBasicMaterial).opacity = 0.7 - (s - 1) * 0.8;
        });
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // ============ CLEANUP ============
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('aopstsma:zone-hover', onZoneSignal);

      mapGeometry.dispose();
      mapMaterial.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      ringBorderGeo.dispose();
      ringBorderMat.dispose();
      pinStemGeo.dispose();
      pinHeadGeo.dispose();
      beaconRingGeo.dispose();
      beaconRingMat.dispose();
      goldPinMat.dispose();
      activePinMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="odisha-canvas"
      aria-label="3D Authentic Relief Model of Odisha State with Educational Training Zones"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
