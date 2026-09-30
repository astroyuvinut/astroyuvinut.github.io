// iceScene.js : cinematic ice-field background for a portfolio.
// Usage:
//   const scene = createIceScene(canvas, { stationCount: 5 });
//   bindScrollShots(scene);            // reads [data-shot] sections
//   scene.pulse(2); scene.emit(12, true);
//   scene.destroy();                   // on unmount
import * as THREE from 'three';

const SPACING = 7.5;

export function createIceScene(canvas, opts = {}) {
  const narrow = window.innerWidth < 700;
  const {
    stationCount = 5,
    maxPixelRatio = 1.5,
    particleCount = narrow ? 600 : 1400,
    dustCount = narrow ? 700 : 1800,
    background = 0x04070c,
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  } = opts;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null; // caller should show a CSS fallback
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  scene.fog = new THREE.FogExp2(background, 0.045);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 220);

  scene.add(new THREE.AmbientLight(0x7194b8, 0.55));
  const key = new THREE.DirectionalLight(0xd8f2ff, 1.2);
  key.position.set(4, 7, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0x55b8ff, 2.4, 26);
  scene.add(rim);

  const grid = new THREE.GridHelper(160, 160, 0x1b3a55, 0x0b1826);
  grid.position.set(0, -3.2, -((stationCount - 1) * SPACING) / 2);
  scene.add(grid);

  const stationPos = (i) =>
    new THREE.Vector3(Math.sin(i * 1.15) * 2.6, Math.cos(i * 0.8) * 0.7 - 0.2, -i * SPACING);

  const shapes = [
    () => new THREE.IcosahedronGeometry(0.62, 0),
    () => new THREE.OctahedronGeometry(0.7, 0),
    () => new THREE.BoxGeometry(0.85, 0.85, 0.85),
    () => new THREE.DodecahedronGeometry(0.62, 0),
    () => new THREE.TorusGeometry(0.5, 0.16, 8, 28),
    () => new THREE.TetrahedronGeometry(0.75, 0),
    () => new THREE.TorusKnotGeometry(0.38, 0.12, 64, 8),
  ];

  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const slabGeo = track(new THREE.BoxGeometry(2.5, 3.4, 0.26));
  const slabEdges = track(new THREE.EdgesGeometry(slabGeo));
  const stations = [];

  for (let i = 0; i < stationCount; i++) {
    const g = new THREE.Group();
    g.position.copy(stationPos(i));
    g.rotation.y = (i % 2 ? 1 : -1) * 0.28;
    g.rotation.z = (i % 2 ? -1 : 1) * 0.04;

    const slabMat = track(new THREE.MeshPhysicalMaterial({
      color: 0x8fd0ff, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.12,
      emissive: 0x1a5a8a, emissiveIntensity: 0.15, side: THREE.DoubleSide, depthWrite: false,
    }));
    g.add(new THREE.Mesh(slabGeo, slabMat));

    const edgeMat = track(new THREE.LineBasicMaterial({ color: 0xc6ecff, transparent: true, opacity: 0.4 }));
    g.add(new THREE.LineSegments(slabEdges, edgeMat));

    const geo = track(shapes[i % shapes.length]());
    const crystalMat = track(new THREE.MeshStandardMaterial({
      color: 0xe0f6ff, emissive: 0x2c8fd6, emissiveIntensity: 0.35,
      flatShading: true, roughness: 0.25, metalness: 0.3,
    }));
    const crystal = new THREE.Mesh(geo, crystalMat);
    const wire = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(geo)),
      track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }))
    );
    crystal.add(wire);
    g.add(crystal);

    scene.add(g);
    stations.push({ slabMat, edgeMat, crystal, crystalMat, pulse: 0 });
  }

  // Curved track through every station, with a lead-in and a tail.
  const pts = [stationPos(0).clone().add(new THREE.Vector3(-1, 0.4, 10))];
  for (let i = 0; i < stationCount; i++) pts.push(stationPos(i));
  pts.push(stationPos(stationCount - 1).clone().add(new THREE.Vector3(2, -0.3, -12)));
  const curve = new THREE.CatmullRomCurve3(pts);

  // Precomputed samples: particles lerp between them instead of solving the spline every frame.
  const LUT_N = 300 * stationCount;
  const lut = curve.getSpacedPoints(LUT_N);
  const at = (t, out) => {
    const f = Math.max(0, Math.min(0.9999, t)) * LUT_N;
    const i = f | 0;
    return out.copy(lut[i]).lerp(lut[i + 1], f - i);
  };

  const guideGeo = track(new THREE.BufferGeometry().setFromPoints(lut));
  scene.add(new THREE.Line(guideGeo, track(new THREE.LineBasicMaterial({ color: 0x3f86bf, transparent: true, opacity: 0.22 }))));

  // Particle pool.
  const P = particleCount;
  const tp = new Float32Array(P * 3);
  const tv = Array.from({ length: P }, () => ({ t: 0, sp: 0, ox: 0, oy: 0, oz: 0, on: false }));
  const tokGeo = track(new THREE.BufferGeometry());
  tokGeo.setAttribute('position', new THREE.BufferAttribute(tp, 3));
  const tokens = new THREE.Points(tokGeo, track(new THREE.PointsMaterial({
    size: 0.07, color: 0xd6f3ff, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  tokens.frustumCulled = false;
  scene.add(tokens);

  let cursor = 0;
  function emit(n = 4, fast = true) {
    for (let k = 0; k < n; k++) {
      const p = tv[cursor];
      cursor = (cursor + 1) % P;
      p.on = true;
      p.t = 0;
      p.sp = (fast ? 0.0032 : 0.0009) * (0.7 + Math.random() * 0.6);
      const r = fast ? 0.22 : 0.9;
      p.ox = (Math.random() - 0.5) * r;
      p.oy = (Math.random() - 0.5) * r;
      p.oz = (Math.random() - 0.5) * r;
    }
  }
  // Ambient slow stream that loops forever.
  const ambient = Math.round(P * 0.12);
  for (let k = 0; k < ambient; k++) {
    emit(1, false);
    tv[(cursor + P - 1) % P].t = Math.random();
  }

  // Ice dust.
  const depth = stationCount * SPACING + 30;
  const dp = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 34;
    dp[i * 3 + 1] = (Math.random() - 0.5) * 16;
    dp[i * 3 + 2] = 14 - Math.random() * depth;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, track(new THREE.PointsMaterial({
    size: 0.035, color: 0x86b3d6, transparent: true, opacity: 0.55, depthWrite: false,
  })));
  scene.add(dust);

  // Camera shots.
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const midZ = -((stationCount - 1) * SPACING) / 2;
  function shot(name) {
    if (name === 'hero') {
      return window.innerWidth < 700
        ? { pos: V(-1.5, 3.2, 13), look: V(1.5, 1.6, -12), focus: 0 }
        : { pos: V(-5.2, 1.6, 11.5), look: V(0.6, -0.1, -12), focus: 0 };
    }
    if (name === 'wide') {
      return { pos: V(10, 5.5, midZ + 13), look: V(0, -0.6, midZ), focus: -1 };
    }
    const i = Math.max(0, Math.min(stationCount - 1, Number(name) || 0));
    const p = stationPos(i);
    const side = i % 2 ? -1 : 1;
    return { pos: p.clone().add(V(3.1 * side, 0.7, 4.4)), look: p.clone().add(V(-0.6 * side, 0, -0.4)), focus: i };
  }

  let target = shot('hero');
  const camPos = target.pos.clone();
  const camLook = target.look.clone();

  let mx = 0, my = 0;
  const onPointer = (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 58 : 42;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const tmp = new THREE.Vector3();
  let last = performance.now();
  let raf = 0;

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const ease = reducedMotion ? 1 : 1 - Math.pow(0.02, dt);

    camPos.lerp(target.pos, ease);
    camLook.lerp(target.look, ease);
    camera.position.copy(camPos).add(tmp.set(mx * 0.5, -my * 0.3, 0));
    camera.lookAt(camLook);

    stations.forEach((s, i) => {
      s.pulse *= Math.pow(0.02, dt);
      const f = target.focus === i ? 1 : 0;
      s.edgeMat.opacity = 0.3 + f * 0.3 + s.pulse * 0.7;
      s.slabMat.emissiveIntensity = 0.12 + f * 0.25 + s.pulse * 1.4;
      s.slabMat.opacity = 0.1 + f * 0.06 + s.pulse * 0.12;
      if (!reducedMotion) {
        s.crystal.rotation.y += dt * (0.35 + s.pulse * 4);
        s.crystal.rotation.x += dt * 0.12;
      }
      const sc = 1 + s.pulse * 0.28;
      s.crystal.scale.set(sc, sc, sc);
      s.crystalMat.emissiveIntensity = 0.3 + s.pulse * 1.6 + f * 0.2;
    });

    const fi = target.focus >= 0 ? target.focus : Math.floor(stationCount / 2);
    rim.position.lerp(tmp.copy(stationPos(fi)).add(V(0, 1.5, 2)), ease);

    for (let i = 0; i < P; i++) {
      const p = tv[i];
      if (!p.on) { tp[i * 3 + 1] = -999; continue; }
      if (!reducedMotion) p.t += p.sp * dt * 60;
      if (p.t >= 1) {
        if (p.sp < 0.002) p.t = 0;                         // ambient: loop
        else { p.on = false; tp[i * 3 + 1] = -999; continue; } // burst: retire
      }
      at(p.t, tmp);
      tp[i * 3] = tmp.x + p.ox;
      tp[i * 3 + 1] = tmp.y + p.oy;
      tp[i * 3 + 2] = tmp.z + p.oz;
    }
    tokGeo.attributes.position.needsUpdate = true;

    if (!reducedMotion) {
      dust.rotation.y += dt * 0.01;
      dust.position.y = Math.sin(now / 4000) * 0.3;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop); // browsers pause rAF in hidden tabs
  }
  raf = requestAnimationFrame(loop);

  return {
    /** Flash station i (0-based). */
    pulse(i) {
      if (stations[i]) stations[i].pulse = 1;
    },
    /** Send n particles down the track. fast=true for a quick burst. */
    emit,
    /** 'hero' | 'wide' | station index */
    setShot(name) {
      target = shot(name);
    },
    get stationCount() {
      return stationCount;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    },
  };
}

/** Moves the camera when a [data-shot] element crosses the middle of the viewport. Returns a cleanup fn. */
export function bindScrollShots(ice, { root = document, onLabel } = {}) {
  if (!ice) return () => {};
  let current = null;
  let currentLabel = null;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const s = e.target.dataset.shot;
        if (s !== current) {
          current = s;
          ice.setShot(/^\d+$/.test(s) ? Number(s) : s);
        }
        // consecutive 'wide' sections share a shot but not a label
        const label = e.target.dataset.label;
        if (onLabel && label && label !== currentLabel) {
          currentLabel = label;
          onLabel(label);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  root.querySelectorAll('[data-shot]').forEach((el) => obs.observe(el));
  return () => obs.disconnect();
}

/** Optional: glyph-scramble text reveal for headings and HUD labels. */
export function scramble(el, text, duration = 650) {
  if (!el) return;
  const final = text ?? el.dataset.text ?? el.textContent;
  el.dataset.text = final;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = final;
    return;
  }
  const glyphs = '▓▒░<>/\\_=+*#01';
  const t0 = performance.now();
  cancelAnimationFrame(el._scrambleRaf);
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    const reveal = Math.floor(p * final.length);
    let s = '';
    for (let i = 0; i < final.length; i++) {
      s += i < reveal || final[i] === ' ' ? final[i] : glyphs[(Math.random() * glyphs.length) | 0];
    }
    el.textContent = s;
    if (p < 1) el._scrambleRaf = requestAnimationFrame(tick);
  };
  el._scrambleRaf = requestAnimationFrame(tick);
}
