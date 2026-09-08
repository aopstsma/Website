'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OdishaHeroMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const OUTLINE: [number, number][] = [
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

    const ZONES = [
      { id: 'balasore',    lon: 86.93, lat: 21.49, pending: false },
      { id: 'cuttack',     lon: 85.95, lat: 20.52, pending: false },
      { id: 'bhubaneswar', lon: 85.78, lat: 20.16, pending: false },
      { id: 'zone-four',   lon: 84.85, lat: 22.20, pending: true },
      { id: 'sambalpur',   lon: 83.97, lat: 21.47, pending: false },
      { id: 'berhampur',   lon: 84.79, lat: 19.31, pending: false }
    ];

    const LON0 = 84.45, LAT0 = 20.4, SCALE = 3.05;
    const px = (lon: number) => (lon - LON0) * SCALE;
    const py = (lat: number) => (lat - LAT0) * SCALE * 1.06;

    function inside(lon: number, lat: number) {
      let hit = false;
      for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
        const [xi, yi] = OUTLINE[i], [xj, yj] = OUTLINE[j];
        if ((yi > lat) !== (yj > lat) &&
            lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
      }
      return hit;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
    camera.position.set(0, 0, 12.6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const world = new THREE.Group();
    scene.add(world);
    const group = new THREE.Group();
    group.position.x = 1.7;
    world.add(group);

    /* ---- Aurora backdrop ---- */
    const auroraGeo = new THREE.PlaneGeometry(60, 40, 40, 26);
    const auroraCols = new Float32Array(auroraGeo.attributes.position.count * 3);
    auroraGeo.setAttribute('color', new THREE.BufferAttribute(auroraCols, 3));
    const auroraMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const aurora = new THREE.Mesh(auroraGeo, auroraMat);
    aurora.position.z = -14;
    world.add(aurora);

    const A1 = new THREE.Color(0x1B4A73);
    const A2 = new THREE.Color(0x6B3A82);
    const A3 = new THREE.Color(0xB8801F);
    const auroraTmp = new THREE.Color();

    function paintAurora(t: number) {
      const p = auroraGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i) / 30, y = p.getY(i) / 20;
        const w1 = Math.sin(x * 1.6 + t * 0.16) * 0.5 + 0.5;
        const w2 = Math.sin(y * 2.1 - t * 0.11 + 1.7) * 0.5 + 0.5;
        const w3 = Math.sin((x + y) * 1.25 + t * 0.2) * 0.5 + 0.5;
        auroraTmp.copy(A1).lerp(A2, w1).lerp(A3, w2 * w3 * 0.5);
        const fade = Math.max(0, 1 - Math.hypot(x, y) * 0.72);
        auroraCols[i * 3] = auroraTmp.r * fade;
        auroraCols[i * 3 + 1] = auroraTmp.g * fade;
        auroraCols[i * 3 + 2] = auroraTmp.b * fade;
      }
      auroraGeo.attributes.color.needsUpdate = true;
    }
    paintAurora(0);

    /* ---- Fill particles ---- */
    const dense = window.innerWidth > 900 && !reduced;
    const step = dense ? 0.068 : 0.115;
    const positions: number[] = [], targets: number[] = [], seeds: number[] = [], zoneIdx: number[] = [], sizes: number[] = [];

    function pushPoint(x: number, y: number, z: number, big: boolean) {
      targets.push(x, y, z);
      const a = Math.random() * Math.PI * 2, r = 9 + Math.random() * 9;
      positions.push(Math.cos(a) * r, Math.sin(a) * r * 0.7, (Math.random() - 0.5) * 16);
      seeds.push(Math.random() * Math.PI * 2);
      sizes.push(big ? 1.9 : 0.7 + Math.random() * 0.7);
      let best = 0, bestD = Infinity;
      ZONES.forEach((z, i) => {
        const d = (px(z.lon) - x) ** 2 + (py(z.lat) - y) ** 2;
        if (d < bestD) { bestD = d; best = i; }
      });
      zoneIdx.push(best);
    }

    for (let lon = 81.3; lon <= 87.6; lon += step) {
      for (let lat = 18.1; lat <= 22.7; lat += step) {
        const jl = lon + (Math.random() - 0.5) * step * 0.9;
        const ja = lat + (Math.random() - 0.5) * step * 0.9;
        if (!inside(jl, ja)) continue;
        pushPoint(px(jl), py(ja), (Math.random() - 0.5) * 0.4, false);
      }
    }
    for (let i = 0; i < OUTLINE.length; i++) {
      const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length];
      const segs = dense ? 34 : 18;
      for (let s = 0; s < segs; s++) {
        const t = s / segs;
        pushPoint(px(a[0] + (b[0] - a[0]) * t), py(a[1] + (b[1] - a[1]) * t), 0.05, true);
      }
    }

    const COUNT = seeds.length;
    const posArr = new Float32Array(positions);
    const tgtArr = new Float32Array(targets);
    const colArr = new Float32Array(COUNT * 3);
    const sizeArr = new Float32Array(sizes);

    const BASE = new THREE.Color(0x2E5A73);
    const LIT  = new THREE.Color(0xF2C75C);
    for (let i = 0; i < COUNT; i++) {
      colArr[i * 3] = BASE.r;
      colArr[i * 3 + 1] = BASE.g;
      colArr[i * 3 + 2] = BASE.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(sizeArr, 1));

    function dotTexture() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      if (g) {
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
      }
      const t = new THREE.Texture(c);
      t.needsUpdate = true;
      return t;
    }
    const sprite = dotTexture();

    const VERT = `
      attribute float aScale;
      varying vec3 vColor;
      uniform float uSize;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * aScale * (1.0 / -mv.z) * 3.0;
        gl_Position = projectionMatrix * mv;
      }`;
    const FRAG = `
      uniform sampler2D uMap;
      varying vec3 vColor;
      void main() {
        vec4 tex = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(vColor, tex.a);
      }`;

    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: sprite }, uSize: { value: dense ? 13.0 : 17.0 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    group.add(new THREE.Points(geo, mat));

    /* ---- Network links + pulses ---- */
    const LINKS = [[0,1],[1,2],[1,4],[4,3],[3,0],[2,5],[4,5],[1,5]];
    const linkCurves: { curve: THREE.QuadraticBezierCurve3; line: THREE.Line; a: number; b: number }[] = [];

    LINKS.forEach(([a, b]) => {
      const pa = new THREE.Vector3(px(ZONES[a].lon), py(ZONES[a].lat), 0.4);
      const pb = new THREE.Vector3(px(ZONES[b].lon), py(ZONES[b].lat), 0.4);
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      mid.z += 1.4 + Math.random() * 0.8;
      const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
      const pts = curve.getPoints(44);

      const lg = new THREE.BufferGeometry().setFromPoints(pts);
      const lc = new Float32Array(pts.length * 3);
      const c1 = new THREE.Color(0x3E7FA8), c2 = new THREE.Color(0xD4A537);
      const tc = new THREE.Color();
      pts.forEach((_, i) => {
        const t = i / (pts.length - 1);
        tc.copy(c1).lerp(c2, Math.sin(t * Math.PI) * 0.7);
        const fade = Math.sin(t * Math.PI);
        lc[i * 3] = tc.r * fade;
        lc[i * 3 + 1] = tc.g * fade;
        lc[i * 3 + 2] = tc.b * fade;
      });
      lg.setAttribute('color', new THREE.BufferAttribute(lc, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const line = new THREE.Line(lg, lineMat);
      group.add(line);
      linkCurves.push({ curve, line, a, b });
    });

    const PULSES = reduced ? 0 : 14;
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePos = new Float32Array(Math.max(PULSES, 1) * 3);
    const pulseCol = new Float32Array(Math.max(PULSES, 1) * 3);
    const pulseSize = new Float32Array(Math.max(PULSES, 1));
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));
    pulseGeo.setAttribute('aScale', new THREE.BufferAttribute(pulseSize, 1));

    const pulseMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: sprite }, uSize: { value: 26.0 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    if (PULSES) group.add(new THREE.Points(pulseGeo, pulseMat));

    const pulses: { link: number; t: number; speed: number }[] = [];
    for (let i = 0; i < PULSES; i++) {
      pulses.push({
        link: Math.floor(Math.random() * linkCurves.length),
        t: Math.random(),
        speed: 0.09 + Math.random() * 0.13
      });
      pulseSize[i] = 0.8 + Math.random() * 0.7;
    }

    /* ---- Zone nodes ---- */
    const nodes = ZONES.map((z) => {
      const g = new THREE.Group();
      g.position.set(px(z.lon), py(z.lat), 0.45);
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 18, 18),
        new THREE.MeshBasicMaterial({ color: z.pending ? 0x6C8497 : 0xFFF0C4 })
      );
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.17, 0.2, 48),
        new THREE.MeshBasicMaterial({
          color: z.pending ? 0x6C8497 : 0xD4A537,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      const wave = new THREE.Mesh(
        new THREE.RingGeometry(0.22, 0.26, 48),
        new THREE.MeshBasicMaterial({
          color: 0xD4A537,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      const halo = new THREE.Mesh(
        new THREE.CircleGeometry(0.75, 40),
        new THREE.MeshBasicMaterial({
          color: 0xD4A537,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      halo.position.z = -0.05;
      g.add(halo, wave, ring, core);
      group.add(g);
      return { g, ring, wave, halo, phase: Math.random() * Math.PI * 2, glow: 0, pending: !!z.pending };
    });

    /* ---- Interaction ---- */
    let active = -1, hovered = -1;
    let pointerX = 0, pointerY = 0, scrollY = 0, lastTouch = -9999;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const railEls: (HTMLElement | null)[] = [];
    const railCleanups: (() => void)[] = [];
    document.querySelectorAll('[data-zone]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      const i = ZONES.findIndex((z) => z.id === htmlEl.dataset.zone);
      if (i >= 0) {
        railEls[i] = htmlEl;
        const on = () => { hovered = i; lastTouch = performance.now(); };
        const off = () => { hovered = -1; lastTouch = performance.now(); };
        htmlEl.addEventListener('mouseenter', on);
        htmlEl.addEventListener('focus', on);
        htmlEl.addEventListener('mouseleave', off);
        htmlEl.addEventListener('blur', off);
        railCleanups.push(() => {
          htmlEl.removeEventListener('mouseenter', on);
          htmlEl.removeEventListener('focus', on);
          htmlEl.removeEventListener('mouseleave', off);
          htmlEl.removeEventListener('blur', off);
        });
      }
    });

    function resize() {
      if (!canvas) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 760 ? 64 : 46;
      group.position.x = w < 900 ? 0 : 1.7;
      group.position.y = w < 900 ? -0.5 : 0;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    const t0 = performance.now();
    const ASSEMBLE = reduced ? 1 : 3000;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    const tmpCol = new THREE.Color();
    const vec = new THREE.Vector3();

    let running = true;
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let cycleAt = 3600, cycleIdx = 0;
    let animId = 0;

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      if (!running) return;

      const elapsed = now - t0;
      const p = easeOut(Math.min(elapsed / ASSEMBLE, 1));
      const time = elapsed * 0.001;

      if (hovered >= 0) {
        active = hovered;
      } else if (!reduced && now - lastTouch > 2200) {
        if (elapsed > cycleAt) {
          cycleAt = elapsed + 2400;
          cycleIdx = (cycleIdx + 1) % ZONES.length;
        }
        active = cycleIdx;
      } else {
        active = -1;
      }

      railEls.forEach((el, i) => {
        if (el) el.classList.toggle('is-active', i === active);
      });

      if (!reduced) paintAurora(time);

      const pos = geo.attributes.position.array as Float32Array;
      const col = geo.attributes.color.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const dr = reduced ? 0 : Math.sin(time * 0.7 + seeds[i]) * 0.032;
        const dz = reduced ? 0 : Math.cos(time * 0.5 + seeds[i]) * 0.05;
        pos[i3]     = posArr[i3]     + (tgtArr[i3]     - posArr[i3])     * p;
        pos[i3 + 1] = posArr[i3 + 1] + (tgtArr[i3 + 1] - posArr[i3 + 1]) * p + dr;
        pos[i3 + 2] = posArr[i3 + 2] + (tgtArr[i3 + 2] - posArr[i3 + 2]) * p + dz;
        const want = active >= 0 && zoneIdx[i] === active ? 1 : 0;
        tmpCol.copy(BASE).lerp(LIT, want * 0.92);
        col[i3]     += (tmpCol.r - col[i3])     * 0.075;
        col[i3 + 1] += (tmpCol.g - col[i3 + 1]) * 0.075;
        col[i3 + 2] += (tmpCol.b - col[i3 + 2]) * 0.075;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;

      if (PULSES) {
        for (let i = 0; i < PULSES; i++) {
          const q = pulses[i];
          q.t += q.speed * 0.016;
          if (q.t > 1) {
            q.t = 0;
            q.link = Math.floor(Math.random() * linkCurves.length);
          }
          linkCurves[q.link].curve.getPoint(q.t, vec);
          pulsePos[i * 3]     = vec.x;
          pulsePos[i * 3 + 1] = vec.y;
          pulsePos[i * 3 + 2] = vec.z;
          const glow = Math.sin(q.t * Math.PI) * p;
          pulseCol[i * 3]     = 0.95 * glow;
          pulseCol[i * 3 + 1] = 0.78 * glow;
          pulseCol[i * 3 + 2] = 0.35 * glow;
        }
        pulseGeo.attributes.position.needsUpdate = true;
        pulseGeo.attributes.color.needsUpdate = true;
      }

      linkCurves.forEach((l) => {
        const near = active >= 0 && (l.a === active || l.b === active);
        const want = (near ? 0.85 : 0.3) * p;
        (l.line.material as THREE.LineBasicMaterial).opacity +=
          (want - (l.line.material as THREE.LineBasicMaterial).opacity) * 0.08;
      });

      nodes.forEach((n, i) => {
        const want = active === i ? 1 : 0;
        n.glow += (want - n.glow) * 0.09;
        const beat = reduced ? 0 : Math.sin(time * 1.7 + n.phase) * 0.5 + 0.5;
        n.g.scale.setScalar((1 + n.glow * 0.9 + beat * 0.11) * p);
        (n.ring.material as THREE.MeshBasicMaterial).opacity =
          (n.pending ? 0.32 : 0.55) + n.glow * 0.45;
        (n.halo.material as THREE.MeshBasicMaterial).opacity =
          n.glow * 0.2 + beat * 0.035;
        const w = (time * 0.55 + n.phase) % 1;
        n.wave.scale.setScalar(1 + w * 2.6);
        (n.wave.material as THREE.MeshBasicMaterial).opacity =
          (1 - w) * (0.3 + n.glow * 0.5);
        n.g.lookAt(camera.position);
      });

      const tilt = reduced ? 0 : 1;
      group.rotation.y += (pointerX * 0.22 * tilt - group.rotation.y) * 0.04;
      group.rotation.x += (pointerY * 0.12 * tilt - group.rotation.x) * 0.04;
      world.position.y = scrollY * 0.0022;
      world.rotation.z = Math.sin(time * 0.12) * 0.012 * tilt;
      aurora.rotation.z = time * 0.012 * tilt;

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      railCleanups.forEach((fn) => fn());
      io.disconnect();
      geo.dispose();
      mat.dispose();
      auroraGeo.dispose();
      auroraMat.dispose();
      sprite.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="odisha-canvas" aria-hidden="true" />;
}
