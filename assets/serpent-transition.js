/**
 * GYAN CHAUPAR · CINEMATIC 3D SERPENT STRIKE OPENING TRANSITION
 * Procedural C2-continuous kinematics, helical ladder ascent, articulated jaw strike
 * and seamless transition into the live website.
 */
(function() {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) {
    console.warn('THREE not found for serpent transition.');
    const siteRootEl = document.getElementById('site-root');
    const overlayEl = document.getElementById('serpent-transition');
    if (siteRootEl) siteRootEl.classList.add('revealed');
    if (overlayEl) overlayEl.classList.add('is-done');
    return;
  }


    // =========================================================================
    // 1. ULTRA-FAST PROCEDURAL PBR TEXTURES (256x256, <15ms TOTAL)
    // =========================================================================

    function createBrushedGoldTextures() {
      const size = 256;
      const diffC = document.createElement('canvas');
      const bumpC = document.createElement('canvas');
      diffC.width = bumpC.width = size;
      diffC.height = bumpC.height = size;
      const dCtx = diffC.getContext('2d');
      const bCtx = bumpC.getContext('2d');

      const grad = dCtx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0.0, '#D8B464');
      grad.addColorStop(0.38, '#F0D998');
      grad.addColorStop(0.72, '#8E6D2F');
      grad.addColorStop(1.0, '#F0D998');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, size, size);

      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, size, size);

      for (let i = 0; i < 220; i++) {
        const y = Math.random() * size;
        dCtx.strokeStyle = i % 2 === 0 ? 'rgba(255,246,216,0.10)' : 'rgba(72,48,16,0.10)';
        dCtx.beginPath();
        dCtx.moveTo(0, y);
        dCtx.lineTo(size, y);
        dCtx.stroke();

        bCtx.strokeStyle = i % 2 === 0 ? 'rgba(185,185,185,0.22)' : 'rgba(65,65,65,0.22)';
        bCtx.beginPath();
        bCtx.moveTo(0, y);
        bCtx.lineTo(size, y);
        bCtx.stroke();
      }

      for (let row = 0; row < 4; row++) {
        const y = row * 64 + 32;
        dCtx.strokeStyle = 'rgba(65,44,14,0.38)';
        dCtx.lineWidth = 2;
        dCtx.beginPath();
        dCtx.moveTo(0, y);
        dCtx.lineTo(size, y);
        dCtx.stroke();

        bCtx.strokeStyle = '#303030';
        bCtx.lineWidth = 2;
        bCtx.beginPath();
        bCtx.moveTo(0, y);
        bCtx.lineTo(size, y);
        bCtx.stroke();
      }

      const map = new THREE.CanvasTexture(diffC);
      map.colorSpace = THREE.SRGBColorSpace;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(1, 3);

      const bumpMap = new THREE.CanvasTexture(bumpC);
      bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
      bumpMap.repeat.set(1, 3);

      return { map, bumpMap };
    }

    /**
     * 256x256 keeled reptilian scales: obsidian-bronze (#1A140E) with antique gold (#C9A24B) rims
     * and optional dorsal diamond pattern + ventral champagne-gold belly scutes.
     */
    function createScaleTextures(isBody) {
      const size = 256;
      const diffC = document.createElement('canvas');
      const bumpC = document.createElement('canvas');
      diffC.width = bumpC.width = size;
      diffC.height = bumpC.height = size;
      const dCtx = diffC.getContext('2d');
      const bCtx = bumpC.getContext('2d');

      dCtx.fillStyle = '#0C0906';
      dCtx.fillRect(0, 0, size, size);
      bCtx.fillStyle = '#080808';
      bCtx.fillRect(0, 0, size, size);

      const cols = isBody ? 16 : 14;
      const rows = isBody ? 18 : 14;
      const cellW = size / cols;
      const cellH = size / rows;

      for (let row = -1; row <= rows + 1; row++) {
        for (let col = -1; col <= cols + 1; col++) {
          const offsetX = (row & 1) ? cellW * 0.5 : 0;
          const cx = col * cellW + offsetX;
          const cy = row * cellH;
          const u = cx / size;

          if (isBody && (u < 0.13 || u > 0.87)) continue;

          const rx = cellW * 0.56;
          const ry = cellH * 0.72;

          let isGold = false;
          let isCrimson = false;
          if (isBody) {
            const distDorsal = Math.abs(u - 0.5);
            const vPhase = ((row / rows) * 3.0) % 1.0;
            const dHalf = 0.16 * (1.0 - Math.abs(vPhase - 0.5) * 2.0);
            isGold = Math.abs(distDorsal - dHalf) < 0.036;
            isCrimson = !isGold && distDorsal < Math.max(0, dHalf - 0.036);
          } else {
            const nx = (col / cols) - 0.5;
            const ny = (row / rows) - 0.5;
            const w = Math.abs(Math.abs(nx) * 2.1 - (0.34 + Math.sin(ny * Math.PI * 4) * 0.14));
            isGold = w < 0.09;
            isCrimson = !isGold && w < 0.13 && ((row & 1) === 0);
          }

          const trace = (ctx) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy - ry);
            ctx.quadraticCurveTo(cx + rx * 1.04, cy - ry * 0.1, cx + rx * 0.72, cy + ry * 0.48);
            ctx.quadraticCurveTo(cx, cy + ry * 1.04, cx - rx * 0.72, cy + ry * 0.48);
            ctx.quadraticCurveTo(cx - rx * 1.04, cy - ry * 0.1, cx, cy - ry);
            ctx.closePath();
          };

          trace(dCtx);
          const dg = dCtx.createLinearGradient(cx, cy - ry, cx, cy + ry);
          if (isGold) {
            dg.addColorStop(0.0, '#2B1F10');
            dg.addColorStop(0.5, '#C9A24B');
            dg.addColorStop(0.85, '#F0D998');
            dg.addColorStop(1.0, '#2A1D0E');
          } else if (isCrimson) {
            dg.addColorStop(0.0, '#1B0808');
            dg.addColorStop(0.55, '#5E1115');
            dg.addColorStop(0.85, '#7A1419');
            dg.addColorStop(1.0, '#150707');
          } else {
            dg.addColorStop(0.0, '#120D09');
            dg.addColorStop(0.5, '#1A140E');
            dg.addColorStop(0.85, '#2E2216');
            dg.addColorStop(1.0, '#120D09');
          }
          dCtx.fillStyle = dg;
          dCtx.fill();
          dCtx.strokeStyle = isGold ? 'rgba(240,217,152,0.75)' : 'rgba(201,162,75,0.32)';
          dCtx.lineWidth = 0.85;
          dCtx.stroke();

          trace(bCtx);
          const bg = bCtx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, ry);
          bg.addColorStop(0.0, '#E4E4E4');
          bg.addColorStop(0.68, '#7E7E7E');
          bg.addColorStop(1.0, '#101010');
          bCtx.fillStyle = bg;
          bCtx.fill();

          // Keeled scale ridge
          bCtx.beginPath();
          bCtx.moveTo(cx, cy - ry * 0.65);
          bCtx.lineTo(cx, cy + ry * 0.70);
          bCtx.strokeStyle = '#FFFFFF';
          bCtx.lineWidth = 1.25;
          bCtx.stroke();
        }
      }

      if (isBody) {
        const scutes = 24;
        const sh = size / scutes;
        const drawBelly = (x0, w) => {
          for (let r = 0; r < scutes; r++) {
            const y = r * sh;
            const g = dCtx.createLinearGradient(0, y, 0, y + sh);
            g.addColorStop(0.0, '#443016');
            g.addColorStop(0.5, '#C9A24B');
            g.addColorStop(0.9, '#F0D998');
            g.addColorStop(1.0, '#19110A');
            dCtx.fillStyle = g;
            dCtx.fillRect(x0, y, w, sh - 0.8);

            bCtx.fillStyle = '#C8C8C8';
            bCtx.fillRect(x0, y, w, sh - 1.0);
          }
        };
        drawBelly(0, size * 0.145);
        drawBelly(size * 0.855, size * 0.145);
      }

      const map = new THREE.CanvasTexture(diffC);
      map.colorSpace = THREE.SRGBColorSpace;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(isBody ? 1 : 1.4, isBody ? 8.0 : 1.4);

      const bumpMap = new THREE.CanvasTexture(bumpC);
      bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
      bumpMap.repeat.set(isBody ? 1 : 1.4, isBody ? 8.0 : 1.4);

      return { map, bumpMap };
    }

    /**
     * 256x256 molten gold (#F5C754) iris with radial filaments and razor-sharp black vertical slit.
     */
    function createViperEyeTexture() {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      const c = size * 0.5;

      ctx.fillStyle = '#0C0604';
      ctx.fillRect(0, 0, size, size);

      const irisR = c * 0.86;
      const g = ctx.createRadialGradient(c, c, irisR * 0.08, c, c, irisR);
      g.addColorStop(0.0, '#FFF6D4');
      g.addColorStop(0.32, '#F5C754');
      g.addColorStop(0.65, '#D89732');
      g.addColorStop(0.86, '#8F3E16');
      g.addColorStop(1.0, '#0C0503');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c, c, irisR, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 84; i++) {
        const a = (i / 84) * Math.PI * 2;
        const r0 = irisR * 0.18;
        const r1 = irisR * (0.76 + (i % 3) * 0.06);
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
        ctx.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255,244,200,0.42)' : 'rgba(122,20,25,0.34)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(c, c, irisR * 0.94, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(12, 6, 4, 0.9)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Razor-sharp vertical slit pupil
      const pH = irisR * 0.86;
      const pW = irisR * 0.14;
      ctx.beginPath();
      ctx.moveTo(c, c - pH);
      ctx.quadraticCurveTo(c + pW, c, c, c + pH);
      ctx.quadraticCurveTo(c - pW, c, c, c - pH);
      ctx.closePath();
      ctx.fillStyle = '#020202';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 240, 185, 0.78)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function createEmberTexture() {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const h = size * 0.5;
      const g = ctx.createRadialGradient(h, h, 0, h, h, h);
      g.addColorStop(0.0, 'rgba(246, 230, 188, 1)');
      g.addColorStop(0.38, 'rgba(216, 180, 100, 0.65)');
      g.addColorStop(1.0, 'rgba(216, 180, 100, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // =========================================================================
    // 2. SINGLE-DRAW-CALL MERGED GOLDEN LADDER GEOMETRY
    // =========================================================================

    function mergeBufferGeometries(geos) {
      let totalVerts = 0;
      let totalIndices = 0;
      for (let i = 0; i < geos.length; i++) {
        totalVerts += geos[i].attributes.position.count;
        totalIndices += geos[i].index.count;
      }

      const positions = new Float32Array(totalVerts * 3);
      const normals = new Float32Array(totalVerts * 3);
      const uvs = new Float32Array(totalVerts * 2);
      const indices = new Uint32Array(totalIndices);

      let vOff = 0;
      let iOff = 0;
      for (let i = 0; i < geos.length; i++) {
        const g = geos[i];
        const p = g.attributes.position.array;
        const n = g.attributes.normal.array;
        const u = g.attributes.uv.array;
        const idx = g.index.array;

        positions.set(p, vOff * 3);
        normals.set(n, vOff * 3);
        uvs.set(u, vOff * 2);
        for (let k = 0; k < idx.length; k++) {
          indices[iOff + k] = idx[k] + vOff;
        }

        vOff += g.attributes.position.count;
        iOff += idx.length;
        g.dispose();
      }

      const merged = new THREE.BufferGeometry();
      merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      merged.setIndex(new THREE.BufferAttribute(indices, 1));
      return merged;
    }

    const LADDER_Z = -3.0;
    const RAIL_X = 0.56;
    const RAIL_R = 0.068;

    function createMergedLadderGeometry() {
      const parts = [];
      const mat = new THREE.Matrix4();
      const quat = new THREE.Quaternion();
      const scale = new THREE.Vector3(1, 1, 1);
      const pos = new THREE.Vector3();

      const addPart = (geo, px, py, pz, rx = 0, ry = 0, rz = 0) => {
        quat.setFromEuler(new THREE.Euler(rx, ry, rz));
        pos.set(px, py, pz);
        mat.compose(pos, quat, scale);
        geo.applyMatrix4(mat);
        parts.push(geo);
      };

      // Two vertical side rails + turned lotus finials
      const finialPts = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.095, 0.0),
        new THREE.Vector2(0.102, 0.05),
        new THREE.Vector2(0.070, 0.11),
        new THREE.Vector2(0.112, 0.22),
        new THREE.Vector2(0.088, 0.32),
        new THREE.Vector2(0.050, 0.40),
        new THREE.Vector2(0.072, 0.46),
        new THREE.Vector2(0.020, 0.58),
        new THREE.Vector2(0.0, 0.65)
      ];

      [-RAIL_X, RAIL_X].forEach((x) => {
        addPart(new THREE.CylinderGeometry(RAIL_R, RAIL_R, 7.2, 18), x, -0.5, 0);
        addPart(new THREE.LatheGeometry(finialPts, 18), x, 3.1, 0);
      });

      // 9 beveled horizontal rungs + embossed joint rings & collars
      for (let i = 0; i < 9; i++) {
        const y = -2.42 + i * 0.60;
        addPart(new THREE.CylinderGeometry(0.041, 0.041, RAIL_X * 2, 14), 0, y, 0, 0, 0, Math.PI * 0.5);
        addPart(new THREE.TorusGeometry(0.046, 0.010, 8, 16), 0, y, 0, 0, Math.PI * 0.5, 0);

        [-1, 1].forEach((side) => {
          const xr = side * RAIL_X;
          addPart(new THREE.TorusGeometry(RAIL_R + 0.013, 0.016, 8, 16), xr, y + 0.052, 0, Math.PI * 0.5, 0, 0);
          addPart(new THREE.TorusGeometry(RAIL_R + 0.013, 0.016, 8, 16), xr, y - 0.052, 0, Math.PI * 0.5, 0, 0);
          addPart(
            new THREE.CylinderGeometry(0.052, 0.066, 0.085, 12),
            xr - side * 0.085,
            y,
            0,
            0,
            0,
            side === 1 ? Math.PI * 0.5 : -Math.PI * 0.5
          );
        });
      }

      return mergeBufferGeometries(parts);
    }

    // =========================================================================
    // 3. ANATOMICAL VIPER HEAD GEOMETRY (PROMINENT EYES, ZERO RED LEAKAGE)
    // =========================================================================

    function viperHalfWidthAt(t) {
      if (t < 0.28) {
        return 0.52 + Math.sin((t / 0.28) * Math.PI * 0.5) * 0.44;
      }
      const u = (t - 0.28) / 0.72;
      return 0.96 * Math.pow(1.0 - u, 0.72) + 0.16 * (1.0 - u * 0.35);
    }

    function createUpperSkullGeometry() {
      const segZ = 34, segT = 30;
      const zMin = -0.88, zMax = 1.32;
      const pos = [], uvs = [], idx = [];

      for (let iz = 0; iz <= segZ; iz++) {
        const tz = iz / segZ;
        const z = zMin + tz * (zMax - zMin);
        const cap = Math.sin(Math.min(1, tz * 6.5) * Math.PI * 0.5) *
                    Math.sin(Math.min(1, (1 - tz) * 7.5) * Math.PI * 0.5);
        const halfW = viperHalfWidthAt(tz) * cap;
        const crownH = (0.48 * (1.0 - tz * 0.36) + Math.sin(tz * Math.PI) * 0.14) * cap;
        const snoutLift = Math.pow(Math.max(0, (tz - 0.72) / 0.28), 2.0) * 0.09;

        for (let it = 0; it <= segT; it++) {
          const tt = it / segT;
          const th = tt * Math.PI * 2;
          const cosT = Math.cos(th);
          const sinT = Math.sin(th);

          let x = cosT * halfW;
          let y = 0;

          if (sinT >= 0) {
            y = Math.pow(sinT, 0.78) * crownH + snoutLift;
            if (tz > 0.32 && tz < 0.78 && Math.abs(cosT) < 0.45) {
              const g = (1.0 - Math.abs(cosT) / 0.45) * Math.sin(((tz - 0.32) / 0.46) * Math.PI);
              y -= g * 0.065;
            }
            const ez = (z - 0.40) / 0.24;
            const es = (Math.abs(cosT) - 0.72) / 0.32;
            const ev = (sinT - 0.45) / 0.45;
            const dE = Math.sqrt(ez * ez + es * es + ev * ev);
            if (dE < 1.0) {
              const indent = Math.cos(dE * Math.PI * 0.5) * 0.12;
              x -= Math.sign(x) * indent;
              y -= indent * 0.25;
            }
          } else {
            y = Math.pow(-sinT, 0.75) * 0.075 + snoutLift * 0.4;
          }

          pos.push(x, y, z);
          uvs.push(tt * 1.5, tz * 1.5);
        }
      }

      for (let iz = 0; iz < segZ; iz++) {
        for (let it = 0; it < segT; it++) {
          const a = iz * (segT + 1) + it;
          const b = a + (segT + 1);
          idx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }

    function createBrowRidgeGeometry(side) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.27, 0.37, 0.72),
        new THREE.Vector3(side * 0.47, 0.43, 0.50),
        new THREE.Vector3(side * 0.62, 0.41, 0.18),
        new THREE.Vector3(side * 0.78, 0.33, -0.22)
      ]);
      const segs = 16, radSegs = 8;
      const geo = new THREE.TubeGeometry(curve, segs, 0.082, radSegs, false);
      const p = geo.attributes.position;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const c = curve.getPointAt(t);
        const prof = Math.sin(t * Math.PI) * 0.85 + 0.18;
        for (let j = 0; j <= radSegs; j++) {
          const k = i * (radSegs + 1) + j;
          p.setXYZ(
            k,
            c.x + (p.getX(k) - c.x) * prof * 1.25,
            c.y + (p.getY(k) - c.y) * prof * 0.62,
            c.z + (p.getZ(k) - c.z) * prof
          );
        }
      }
      geo.computeVertexNormals();
      return geo;
    }

    function createForwardEyeGeometry(r = 0.175) {
      const geo = new THREE.SphereGeometry(r, 24, 18);
      const p = geo.attributes.position;
      const uv = geo.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const z = p.getZ(i);
        if (z >= -0.02) {
          uv.setXY(
            i,
            THREE.MathUtils.clamp(0.5 + p.getX(i) / (r * 1.92), 0.01, 0.99),
            THREE.MathUtils.clamp(0.5 + p.getY(i) / (r * 1.92), 0.01, 0.99)
          );
        } else {
          uv.setXY(i, 0.02, 0.02);
        }
      }
      uv.needsUpdate = true;
      return geo;
    }

    function createLowerMandibleGeometry() {
      const segZ = 30, segT = 28;
      const zMin = -0.82, zMax = 1.24;
      const pos = [], uvs = [], idx = [];

      for (let iz = 0; iz <= segZ; iz++) {
        const tz = iz / segZ;
        const z = zMin + tz * (zMax - zMin);
        const cap = Math.sin(Math.min(1, tz * 6.0) * Math.PI * 0.5) *
                    Math.sin(Math.min(1, (1 - tz) * 7.5) * Math.PI * 0.5);
        const halfW = viperHalfWidthAt(tz) * 0.93 * cap;
        const depth = 0.31 * (1.0 - tz * 0.44) * cap;

        for (let it = 0; it <= segT; it++) {
          const tt = it / segT;
          const th = tt * Math.PI * 2;
          const sinT = Math.sin(th);
          const x = Math.cos(th) * halfW;
          const y = sinT <= 0 ? -Math.pow(-sinT, 0.72) * depth : -Math.sin(sinT * Math.PI) * 0.035;
          pos.push(x, y, z);
          uvs.push(tt * 1.4, tz * 1.4);
        }
      }

      for (let iz = 0; iz < segZ; iz++) {
        for (let it = 0; it < segT; it++) {
          const a = iz * (segT + 1) + it;
          const b = a + (segT + 1);
          idx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }

    function createInsetLowerGumGeometry() {
      const segZ = 18, segX = 14;
      const zMin = -0.62, zMax = 1.02;
      const pos = [], uvs = [], idx = [];

      for (let iz = 0; iz <= segZ; iz++) {
        const tz = iz / segZ;
        const z = zMin + tz * (zMax - zMin);
        const mappedTz = (z + 0.82) / 2.06;
        const cap = Math.sin(Math.min(1, (1 - tz) * 5.0) * Math.PI * 0.5);
        const halfW = viperHalfWidthAt(mappedTz) * 0.68 * cap;

        for (let ix = 0; ix <= segX; ix++) {
          const tx = ix / segX;
          const nx = (tx - 0.5) * 2.0;
          pos.push(nx * halfW, -0.020 + Math.pow(Math.abs(nx), 2.4) * 0.030, z);
          uvs.push(tx, tz);
        }
      }

      for (let iz = 0; iz < segZ; iz++) {
        for (let ix = 0; ix < segX; ix++) {
          const a = iz * (segX + 1) + ix;
          const b = a + (segX + 1);
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }

    function createInsetUpperPalateGeometry() {
      const segZ = 18, segX = 14;
      const zMin = -0.64, zMax = 1.08;
      const pos = [], uvs = [], idx = [];

      for (let iz = 0; iz <= segZ; iz++) {
        const tz = iz / segZ;
        const z = zMin + tz * (zMax - zMin);
        const mappedTz = (z + 0.88) / 2.20;
        const cap = Math.sin(Math.min(1, (1 - tz) * 5.5) * Math.PI * 0.5);
        const halfW = viperHalfWidthAt(mappedTz) * 0.72 * cap;

        for (let ix = 0; ix <= segX; ix++) {
          const tx = ix / segX;
          const nx = (tx - 0.5) * 2.0;
          pos.push(nx * halfW, 0.016 + (1.0 - nx * nx) * 0.052, z);
          uvs.push(tx, tz);
        }
      }

      for (let iz = 0; iz < segZ; iz++) {
        for (let ix = 0; ix < segX; ix++) {
          const a = iz * (segX + 1) + ix;
          const b = a + (segX + 1);
          idx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }

    function createCurvedFangGeometry(length = 0.56, baseR = 0.045, curveBack = 0.13) {
      const segs = 14, radSegs = 8;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -length * 0.42, curveBack * 0.25),
        new THREE.Vector3(0, -length * 0.78, -curveBack * 0.32),
        new THREE.Vector3(0, -length, -curveBack * 0.85)
      ]);
      const geo = new THREE.TubeGeometry(curve, segs, baseR, radSegs, false);
      const p = geo.attributes.position;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const c = curve.getPointAt(t);
        const s = Math.pow(1.0 - t, 1.35);
        for (let j = 0; j <= radSegs; j++) {
          const k = i * (radSegs + 1) + j;
          p.setXYZ(k, c.x + (p.getX(k) - c.x) * s, c.y + (p.getY(k) - c.y) * s, c.z + (p.getZ(k) - c.z) * s);
        }
      }
      geo.computeVertexNormals();
      return geo;
    }

    // =========================================================================
    // 4. HYPER-OPTIMIZED TRANSITION CONTROLLER (ZERO PER-FRAME ALLOCATIONS)
    // =========================================================================
    // 4. SILKY-SMOOTH C2 TRANSITION CONTROLLER (ZERO ALLOCATIONS, ANALYTIC NORMALS)
    // =========================================================================

    let overlayEl = null;
    let vignetteEl = null;
    let blackoutEl = null;
    let siteRootEl = null;

    const BODY_RINGS = 64;
    const BODY_RADIAL = 14;
    const BODY_LENGTH = 10.6;
    const HEAD_SCALE = 0.56;
    const EMBER_COUNT = 42;

    // Helical wrap constants (clears rails at ±0.56 + body radius cleanly)
    const HELIX_R = 0.94;
    const K_THETA = (Math.PI * 2.0) / 6.8;
    const THETA_AT_FRONT = Math.PI * 4.0; // Dead-center front of ladder at arc = 8.0
    const ARC_FRONT = 8.0;
    const THETA_START = THETA_AT_FRONT - ARC_FRONT * K_THETA;
    const K_Y = 0.34;
    const Y_BASE = -2.05;

    // Precomputed radial unit circle + cross-section analytic normal lookup tables
    const _cosRad = new Float32Array(BODY_RADIAL + 1);
    const _sinRad = new Float32Array(BODY_RADIAL + 1);
    const _nxRad = new Float32Array(BODY_RADIAL + 1);
    const _nyRad = new Float32Array(BODY_RADIAL + 1);
    const _scaleXRad = new Float32Array(BODY_RADIAL + 1);
    const _scaleYRad = new Float32Array(BODY_RADIAL + 1);
    (function initCrossSectionLUT() {
      for (let j = 0; j <= BODY_RADIAL; j++) {
        const ang = (j / BODY_RADIAL) * Math.PI * 2 - Math.PI * 0.5;
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        _cosRad[j] = c;
        _sinRad[j] = s;

        const sx = 1.08;
        const sy = s < 0 ? 0.86 * 0.76 : 0.86;
        _scaleXRad[j] = c * sx;
        _scaleYRad[j] = s * sy + (s > 0 ? Math.pow(s, 6) * 0.14 : 0);

        // Exact outward ellipse normal in (R, U) plane
        const nx = c / sx;
        const ny = s / sy;
        const invLen = 1.0 / Math.hypot(nx, ny);
        _nxRad[j] = nx * invLen;
        _nyRad[j] = ny * invLen;
      }
    })();

    // Pre-allocated scratch buffers (zero GC allocations inside render loop)
    const _spine = Array.from({ length: BODY_RINGS + 1 }, () => new THREE.Vector3());
    const _tangents = Array.from({ length: BODY_RINGS + 1 }, () => new THREE.Vector3());
    const _upFrames = Array.from({ length: BODY_RINGS + 1 }, () => new THREE.Vector3());
    const _rightFrames = Array.from({ length: BODY_RINGS + 1 }, () => new THREE.Vector3());

    const _worldUp = new THREE.Vector3(0, 1, 0);
    const _camBasePos = new THREE.Vector3(0, 0.20, 4.65);
    const _camLookAt = new THREE.Vector3(0, 0.10, -2.2);
    const _vAxis = new THREE.Vector3();
    const _vRef = new THREE.Vector3();
    const _vHelix = new THREE.Vector3();
    const _vStrike = new THREE.Vector3();
    const _vHeadPos = new THREE.Vector3();
    const _vHeadTarget = new THREE.Vector3();
    const _vHeadFwd = new THREE.Vector3();
    const _vHeadUp = new THREE.Vector3();
    const _vHeadRight = new THREE.Vector3();
    const _vNeckAnchor = new THREE.Vector3();
    const _vOffsetDelta = new THREE.Vector3();
    const _vCross = new THREE.Vector3();
    const _vTmpR = new THREE.Vector3();
    const _vTmpU = new THREE.Vector3();
    const _qTangent = new THREE.Quaternion();
    const _qCamLook = new THREE.Quaternion();
    const _qTarget = new THREE.Quaternion();
    const _qHeadSmooth = new THREE.Quaternion();
    const _mLook = new THREE.Matrix4();

    /**
     * C2-continuous quintic smootherstep: zero 1st & 2nd derivatives at endpoints.
     */
    function smootherstep(edge0, edge1, x) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Unified C2-continuous parametric spine function evalSpine(s, t, out).
     * Smoothly blends the 360° helical wrap, upper-neck S-coil peel-off,
     * anticipation compression, and straight camera lunge with zero hard switches.
     */
    function evalSpine(s, t, out) {
      // Head arc glides from deep shadow below (-5.2) to front-center of upper ladder (8.0)
      const headArc = -5.2 + (ARC_FRONT - -5.2) * smootherstep(0.45, 1.92, t);
      const arc = headArc - (1.0 - s) * BODY_LENGTH;

      // 1. Continuous helical wrap around the golden ladder
      const th = THETA_START + arc * K_THETA;
      _vHelix.set(
        Math.sin(th) * HELIX_R,
        Y_BASE + arc * K_Y,
        LADDER_Z + Math.cos(th) * HELIX_R
      );

      // 2. Smooth upper-neck peel-off into taut S-coil -> anticipation -> straight lunge
      const coilW = smootherstep(1.50, 2.28, t);
      if (coilW <= 1e-5 || s <= 0.48) {
        out.copy(_vHelix);
        return;
      }

      const wNeck = smootherstep(0.48, 0.92, s);
      const u = Math.max(0, Math.min(1, (s - 0.48) / 0.52));

      // Overlapping C2 anticipation wind-up & explosive lunge weights
      const windupW = smootherstep(2.22, 2.52, t) * (1.0 - smootherstep(2.48, 2.74, t));
      const lungeW = smootherstep(2.46, 2.94, t);

      const sAmp = (0.52 + 0.24 * windupW) * (1.0 - lungeW);
      const swayX = Math.sin(t * 4.2) * 0.045 * u * (1.0 - lungeW);
      const breathY = Math.sin(t * 4.8) * 0.025 * u * (1.0 - lungeW);

      const anchorY = Y_BASE + ARC_FRONT * K_Y;
      const anchorZ = LADDER_Z + HELIX_R;

      const targetX = Math.sin(u * Math.PI * 2.15) * sAmp + swayX;
      const targetY = anchorY * (1.0 - u) + 0.20 * u + Math.sin(u * Math.PI) * 0.11 * (1.0 - lungeW) + breathY;
      const zHover = anchorZ + u * (1.72 - 0.56 * windupW);
      const zLunge = anchorZ + u * 6.45;
      const targetZ = zHover + (zLunge - zHover) * lungeW;

      _vStrike.set(targetX, targetY, targetZ);
      out.lerpVectors(_vHelix, _vStrike, wNeck * coilW);
    }

    // Active runtime instance (fully disposed upon completion)
    let activeCleanup = null;

    function startSerpentTransition() {
      if (activeCleanup) activeCleanup();

      overlayEl = document.getElementById('serpent-transition');
      vignetteEl = document.getElementById('serpent-vignette');
      blackoutEl = document.getElementById('serpent-blackout');
      siteRootEl = document.getElementById('site-root');

      if (!overlayEl || !siteRootEl) {
        if (siteRootEl) siteRootEl.classList.add('revealed');
        return;
      }

      // Reset DOM state cleanly
      siteRootEl.classList.remove('revealed');
      overlayEl.classList.remove('is-done');
      overlayEl.style.opacity = '1';
      vignetteEl.style.opacity = '0';
      blackoutEl.style.opacity = '0';

      // One-click to skip overlay
      overlayEl.onclick = skipSerpentTransition;

      // Respect prefers-reduced-motion with an instant gentle reveal
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        siteRootEl.classList.add('revealed');
        overlayEl.style.transition = 'opacity 0.42s ease';
        requestAnimationFrame(() => {
          overlayEl.style.opacity = '0';
        });
        const tid = setTimeout(() => {
          overlayEl.classList.add('is-done');
          overlayEl.style.transition = '';
          window.dispatchEvent(new CustomEvent('serpentTransitionComplete'));
        }, 440);
        activeCleanup = () => clearTimeout(tid);
        return;
      }

      // Track all disposable GPU resources for 100% leak-free cleanup
      const geometries = [];
      const materials = [];
      const textures = [];
      const trackGeo = (g) => { geometries.push(g); return g; };
      const trackMat = (m) => { materials.push(m); return m; };
      const trackTex = (t) => { textures.push(t); return t; };

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0a08);
      scene.fog = new THREE.FogExp2(0x0d0a08, 0.068);

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.04, 55);
      camera.position.copy(_camBasePos);
      camera.lookAt(_camLookAt);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false
      });
      renderer.shadowMap.enabled = false;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.24;
      renderer.domElement.style.opacity = '0';
      overlayEl.insertBefore(renderer.domElement, vignetteEl);

      // Crisp lightweight lighting (zero shadow maps)
      scene.add(new THREE.AmbientLight(0x36271c, 0.88));

      const keyLight = new THREE.DirectionalLight(0xF0D998, 1.95);
      keyLight.position.set(3.2, 5.2, 5.4);
      scene.add(keyLight);

      const frontFill = new THREE.DirectionalLight(0xD8B464, 0.76);
      frontFill.position.set(-2.0, 1.2, 5.5);
      scene.add(frontFill);

      const crimsonUnderFill = new THREE.DirectionalLight(0x9E1B22, 0.42);
      crimsonUnderFill.position.set(0.0, -3.5, 3.2);
      scene.add(crimsonUnderFill);

      const rimL = new THREE.SpotLight(0xF0D998, 5.0, 24, Math.PI * 0.44, 0.55, 1.1);
      rimL.position.set(-5.0, 3.5, -1.2);
      scene.add(rimL);

      const rimR = new THREE.SpotLight(0xD8B464, 4.4, 24, Math.PI * 0.44, 0.55, 1.1);
      rimR.position.set(5.0, 2.8, -1.4);
      scene.add(rimR);

      const ladderGlow = new THREE.PointLight(0xF0D998, 0.0, 12);
      ladderGlow.position.set(0, 0.4, LADDER_Z - 1.5);
      scene.add(ladderGlow);

      // 1. Single-draw-call merged Golden Ladder (9 beveled rungs)
      const goldTex = createBrushedGoldTextures();
      trackTex(goldTex.map);
      trackTex(goldTex.bumpMap);

      const ladderMesh = new THREE.Mesh(
        trackGeo(createMergedLadderGeometry()),
        trackMat(new THREE.MeshStandardMaterial({
          map: goldTex.map,
          bumpMap: goldTex.bumpMap,
          bumpScale: 0.015,
          color: 0xF0D998,
          metalness: 0.90,
          roughness: 0.23
        }))
      );
      ladderMesh.position.set(0, -10.8, LADDER_Z);
      scene.add(ladderMesh);

      // 2. Detailed Pit Viper Head (Lightweight MeshStandardMaterial everywhere)
      const headTex = createScaleTextures(false);
      const bodyTex = createScaleTextures(true);
      const eyeTex = createViperEyeTexture();
      const emberTex = createEmberTexture();
      trackTex(headTex.map); trackTex(headTex.bumpMap);
      trackTex(bodyTex.map); trackTex(bodyTex.bumpMap);
      trackTex(eyeTex); trackTex(emberTex);

      const headScaleMat = trackMat(new THREE.MeshStandardMaterial({
        map: headTex.map,
        bumpMap: headTex.bumpMap,
        bumpScale: 0.045,
        roughness: 0.36,
        metalness: 0.48
      }));

      const browMat = trackMat(new THREE.MeshStandardMaterial({
        map: headTex.map,
        bumpMap: headTex.bumpMap,
        bumpScale: 0.055,
        color: 0xD8B464,
        roughness: 0.30,
        metalness: 0.55
      }));

      const mouthMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0x7A1419,
        emissive: 0x240406,
        roughness: 0.20,
        metalness: 0.06
      }));

      const membraneMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0x7A1419,
        emissive: 0x1D0305,
        roughness: 0.24,
        metalness: 0.05,
        side: THREE.DoubleSide
      }));

      const fangMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0xF5E8CC,
        roughness: 0.14,
        metalness: 0.12
      }));

      const eyeIrisMat = trackMat(new THREE.MeshStandardMaterial({
        map: eyeTex,
        emissive: new THREE.Color(0xF5C754),
        emissiveMap: eyeTex,
        emissiveIntensity: 0.92,
        roughness: 0.12,
        metalness: 0.10
      }));

      const corneaMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        roughness: 0.05,
        metalness: 0.15,
        depthWrite: false
      }));

      const headGroup = new THREE.Group();
      headGroup.scale.setScalar(HEAD_SCALE);
      scene.add(headGroup);

      const HINGE_Z = -0.66;

      // Upper Skull, Brow Ridges, Forward-Facing Eyes & Hinged Fangs
      const upperJawGroup = new THREE.Group();
      upperJawGroup.position.set(0, 0, HINGE_Z);
      headGroup.add(upperJawGroup);

      const upperLocal = new THREE.Group();
      upperLocal.position.set(0, 0, -HINGE_Z);
      upperJawGroup.add(upperLocal);

      upperLocal.add(new THREE.Mesh(trackGeo(createUpperSkullGeometry()), headScaleMat));
      upperLocal.add(new THREE.Mesh(trackGeo(createInsetUpperPalateGeometry()), mouthMat));
      upperLocal.add(new THREE.Mesh(trackGeo(createBrowRidgeGeometry(1)), browMat));
      upperLocal.add(new THREE.Mesh(trackGeo(createBrowRidgeGeometry(-1)), browMat));

      const eyeGeo = trackGeo(createForwardEyeGeometry(0.175));
      const corneaGeo = trackGeo(new THREE.SphereGeometry(0.184, 18, 14));
      [-1, 1].forEach((side) => {
        const eyeAsm = new THREE.Group();
        eyeAsm.position.set(side * 0.44, 0.24, 0.46);
        eyeAsm.rotation.y = side * 0.19;
        eyeAsm.add(new THREE.Mesh(eyeGeo, eyeIrisMat));
        eyeAsm.add(new THREE.Mesh(corneaGeo, corneaMat));
        upperLocal.add(eyeAsm);
      });

      const pitMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x050302 }));
      const pitGeo = trackGeo(new THREE.SphereGeometry(0.036, 8, 8));
      [-1, 1].forEach((side) => {
        const n = new THREE.Mesh(pitGeo, pitMat);
        n.position.set(side * 0.18, 0.17, 1.15);
        upperLocal.add(n);
        const lp = new THREE.Mesh(pitGeo, pitMat);
        lp.scale.set(1.25, 0.9, 1.0);
        lp.position.set(side * 0.29, 0.11, 0.90);
        upperLocal.add(lp);
      });

      const fangGeo = trackGeo(createCurvedFangGeometry(0.56, 0.045, 0.13));
      const sheathGeo = trackGeo(new THREE.SphereGeometry(0.088, 12, 10));
      sheathGeo.scale(1.0, 1.1, 1.35);

      const makeFang = (side) => {
        const p = new THREE.Group();
        p.position.set(side * 0.25, 0.04, 0.90);
        const sh = new THREE.Mesh(sheathGeo, mouthMat);
        sh.position.set(0, 0.01, 0.01);
        p.add(sh);
        p.add(new THREE.Mesh(fangGeo, fangMat));
        return p;
      };
      const fangL = makeFang(1);
      const fangR = makeFang(-1);
      upperLocal.add(fangL, fangR);

      // Thick Armored U-Shaped Lower Mandible + Strictly Inset Gums & Forked Tongue
      const lowerJawGroup = new THREE.Group();
      lowerJawGroup.position.set(0, 0, HINGE_Z);
      headGroup.add(lowerJawGroup);

      const lowerLocal = new THREE.Group();
      lowerLocal.position.set(0, 0, -HINGE_Z);
      lowerJawGroup.add(lowerLocal);

      lowerLocal.add(new THREE.Mesh(trackGeo(createLowerMandibleGeometry()), headScaleMat));
      lowerLocal.add(new THREE.Mesh(trackGeo(createInsetLowerGumGeometry()), mouthMat));

      const tongueGroup = new THREE.Group();
      tongueGroup.position.set(0, 0.008, 0.28);
      lowerLocal.add(tongueGroup);

      const tongueMat = trackMat(new THREE.MeshStandardMaterial({
        color: 0x9E1B22,
        emissive: 0x2E0608,
        roughness: 0.22,
        metalness: 0.06
      }));

      const stemGeo = trackGeo(new THREE.CylinderGeometry(0.016, 0.028, 0.90, 8));
      stemGeo.rotateX(Math.PI * 0.5);
      stemGeo.translate(0, 0, 0.45);
      tongueGroup.add(new THREE.Mesh(stemGeo, tongueMat));

      const forkGeo = trackGeo(new THREE.ConeGeometry(0.016, 0.30, 6));
      forkGeo.rotateX(Math.PI * 0.5);
      forkGeo.translate(0, 0, 0.15);
      const forkL = new THREE.Mesh(forkGeo, tongueMat);
      forkL.position.set(0, 0, 0.89);
      forkL.rotation.y = 0.28;
      const forkR = new THREE.Mesh(forkGeo, tongueMat);
      forkR.position.set(0, 0, 0.89);
      forkR.rotation.y = -0.28;
      tongueGroup.add(forkL, forkR);

      // Enclosed Throat + Crimson Mouth Light + Dynamic Jaw-Hinge Membranes
      const throatGeo = trackGeo(new THREE.CylinderGeometry(0.30, 0.20, 0.96, 14, 1, true));
      throatGeo.rotateX(Math.PI * 0.5);
      const throatMesh = new THREE.Mesh(
        throatGeo,
        trackMat(new THREE.MeshStandardMaterial({
          color: 0x4A0A0D,
          emissive: 0x160203,
          roughness: 0.28,
          side: THREE.BackSide
        }))
      );
      throatMesh.position.set(0, 0.02, -0.94);
      headGroup.add(throatMesh);

      const throatLight = new THREE.PointLight(0x9E1B22, 0.0, 4.5);
      throatLight.position.set(0, 0.02, -0.22);
      headGroup.add(throatLight);

      const createMemGeo = (side) => {
        const g = trackGeo(new THREE.BufferGeometry());
        const pAttr = new THREE.BufferAttribute(new Float32Array(10 * 3), 3);
        pAttr.setUsage(THREE.DynamicDrawUsage);
        const nArr = new Float32Array(10 * 3);
        for (let i = 0; i < 10; i++) nArr[i * 3] = side;
        g.setAttribute('position', pAttr);
        g.setAttribute('normal', new THREE.BufferAttribute(nArr, 3));
        g.setIndex([0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 8, 3, 8, 4, 4, 8, 9]);
        return g;
      };
      const memLGeo = createMemGeo(1);
      const memRGeo = createMemGeo(-1);
      headGroup.add(new THREE.Mesh(memLGeo, membraneMat), new THREE.Mesh(memRGeo, membraneMat));

      const zAnchors = [-0.52, -0.32, -0.10, 0.12, 0.30];
      function updateMembranes(upperRotX, lowerRotX, jawOpen) {
        const inset = 0.60 + 0.11 * jawOpen;
        const cosU = Math.cos(upperRotX), sinU = Math.sin(upperRotX);
        const cosL = Math.cos(lowerRotX), sinL = Math.sin(lowerRotX);
        const updateOne = (geo, side) => {
          const p = geo.attributes.position;
          for (let i = 0; i < 5; i++) {
            const zLoc = zAnchors[i];
            const tz = (zLoc + 0.88) / 2.20;
            const xb = side * viperHalfWidthAt(tz) * inset;
            const dz = zLoc - HINGE_Z;
            p.setXYZ(i, xb, 0.02 * cosU - dz * sinU, HINGE_Z + 0.02 * sinU + dz * cosU);
            p.setXYZ(i + 5, xb * 0.94, -0.015 * cosL - dz * sinL, HINGE_Z - 0.015 * sinL + dz * cosL);
          }
          p.needsUpdate = true;
        };
        updateOne(memLGeo, 1);
        updateOne(memRGeo, -1);
      }

      // 3. Fast Analytic Tubular Body (64 rings x 14 radial, DynamicDrawUsage, zero computeVertexNormals)
      const bodyGeo = trackGeo(new THREE.BufferGeometry());
      const vCount = (BODY_RINGS + 1) * (BODY_RADIAL + 1);
      const bodyPosArr = new Float32Array(vCount * 3);
      const bodyNormArr = new Float32Array(vCount * 3);
      const bodyUvArr = new Float32Array(vCount * 2);
      const bodyIdx = [];

      for (let i = 0; i <= BODY_RINGS; i++) {
        const v = i / BODY_RINGS;
        for (let j = 0; j <= BODY_RADIAL; j++) {
          const k = (i * (BODY_RADIAL + 1) + j) * 2;
          bodyUvArr[k] = j / BODY_RADIAL;
          bodyUvArr[k + 1] = v;
        }
      }
      for (let i = 0; i < BODY_RINGS; i++) {
        for (let j = 0; j < BODY_RADIAL; j++) {
          const a = i * (BODY_RADIAL + 1) + j;
          const b = a + (BODY_RADIAL + 1);
          bodyIdx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }

      const bodyPosAttr = new THREE.BufferAttribute(bodyPosArr, 3);
      bodyPosAttr.setUsage(THREE.DynamicDrawUsage);
      const bodyNormAttr = new THREE.BufferAttribute(bodyNormArr, 3);
      bodyNormAttr.setUsage(THREE.DynamicDrawUsage);

      bodyGeo.setAttribute('position', bodyPosAttr);
      bodyGeo.setAttribute('normal', bodyNormAttr);
      bodyGeo.setAttribute('uv', new THREE.BufferAttribute(bodyUvArr, 2));
      bodyGeo.setIndex(bodyIdx);

      const bodyMesh = new THREE.Mesh(
        bodyGeo,
        trackMat(new THREE.MeshStandardMaterial({
          map: bodyTex.map,
          bumpMap: bodyTex.bumpMap,
          bumpScale: 0.045,
          roughness: 0.38,
          metalness: 0.46
        }))
      );
      bodyMesh.frustumCulled = false;
      scene.add(bodyMesh);

      // 4. Lightweight Golden Embers (~42 points)
      const emberPos = new Float32Array(EMBER_COUNT * 3);
      const emberVel = new Float32Array(EMBER_COUNT);
      for (let i = 0; i < EMBER_COUNT; i++) {
        emberPos[i * 3] = (Math.random() - 0.5) * 4.4;
        emberPos[i * 3 + 1] = -3.8 + Math.random() * 7.2;
        emberPos[i * 3 + 2] = LADDER_Z + (Math.random() - 0.5) * 3.8;
        emberVel[i] = 0.65 + Math.random() * 1.15;
      }
      const emberGeo = trackGeo(new THREE.BufferGeometry());
      const emberPosAttr = new THREE.BufferAttribute(emberPos, 3);
      emberPosAttr.setUsage(THREE.DynamicDrawUsage);
      emberGeo.setAttribute('position', emberPosAttr);
      const embers = new THREE.Points(
        emberGeo,
        trackMat(new THREE.PointsMaterial({
          size: 0.095,
          map: emberTex,
          transparent: true,
          opacity: 0.62,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        }))
      );
      scene.add(embers);

      // Resize handler
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Animation state
      let rafId = 0;
      let animTime = 0;
      let lastTime = 0;
      let warmupFrames = 0;
      let headQuatInit = false;
      let disposed = false;
      let siteRevealed = false;
      let camShake = 0;

      function disposeAll() {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);

        for (let i = 0; i < geometries.length; i++) geometries[i].dispose();
        for (let i = 0; i < materials.length; i++) materials[i].dispose();
        for (let i = 0; i < textures.length; i++) textures[i].dispose();

        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      activeCleanup = disposeAll;

      /**
       * Updates continuous viper spine, damped head orientation, tail-to-head
       * gimbal-safe Bishop frame, and analytic vertex positions + unit normals.
       */
      function updateSerpentPose(t, dt) {
        for (let i = 0; i <= BODY_RINGS; i++) {
          evalSpine(i / BODY_RINGS, t, _spine[i]);
        }

        for (let i = 0; i <= BODY_RINGS; i++) {
          if (i === 0) _tangents[i].subVectors(_spine[1], _spine[0]).normalize();
          else if (i === BODY_RINGS) _tangents[i].subVectors(_spine[i], _spine[i - 1]).normalize();
          else _tangents[i].subVectors(_spine[i + 1], _spine[i - 1]).normalize();
        }

        // Smooth C2 orientation blend from helix tangent -> camera lock-on + damped slerp
        _vHeadPos.copy(_spine[BODY_RINGS]);
        headGroup.position.copy(_vHeadPos);

        const lockOn = smootherstep(1.38, 2.18, t);
        _vHeadTarget.copy(_vHeadPos).add(_tangents[BODY_RINGS]);
        _mLook.lookAt(_vHeadTarget, _vHeadPos, _worldUp);
        _qTangent.setFromRotationMatrix(_mLook);

        _mLook.lookAt(_camBasePos, _vHeadPos, _worldUp);
        _qCamLook.setFromRotationMatrix(_mLook);

        _qTarget.copy(_qTangent).slerp(_qCamLook, lockOn);
        if (!headQuatInit) {
          _qHeadSmooth.copy(_qTarget);
          headQuatInit = true;
        } else {
          _qHeadSmooth.slerp(_qTarget, 1.0 - Math.exp(-18.0 * dt));
        }
        headGroup.quaternion.copy(_qHeadSmooth);

        _vHeadFwd.set(0, 0, 1).applyQuaternion(_qHeadSmooth).normalize();
        _vHeadUp.set(0, 1, 0).applyQuaternion(_qHeadSmooth).normalize();
        _vHeadRight.set(1, 0, 0).applyQuaternion(_qHeadSmooth).normalize();

        // Seat neck cleanly inside rear skull socket
        _vNeckAnchor.copy(_vHeadPos)
          .addScaledVector(_vHeadFwd, -0.52 * HEAD_SCALE)
          .addScaledVector(_vHeadUp, 0.03 * HEAD_SCALE);
        _vOffsetDelta.subVectors(_vNeckAnchor, _spine[BODY_RINGS]);

        for (let k = 0; k < 8; k++) {
          const idx = BODY_RINGS - k;
          const w = (1 - k / 8) * (1 - k / 8);
          _spine[idx].addScaledVector(_vOffsetDelta, w);
        }

        for (let i = BODY_RINGS - 8; i <= BODY_RINGS; i++) {
          if (i === BODY_RINGS) _tangents[i].copy(_vHeadFwd);
          else _tangents[i].subVectors(_spine[i + 1], _spine[i - 1]).normalize();
        }

        // Twist-free Parallel Transport / Bishop frame starting from a fixed gimbal-safe tail frame
        const t0 = _tangents[0];
        if (Math.abs(t0.z) < 0.9) _vRef.set(0, 0, 1);
        else _vRef.set(1, 0, 0);
        _rightFrames[0].crossVectors(_vRef, t0).normalize();
        _upFrames[0].crossVectors(t0, _rightFrames[0]).normalize();

        for (let i = 1; i <= BODY_RINGS; i++) {
          const prevT = _tangents[i - 1];
          const currT = _tangents[i];
          _upFrames[i].copy(_upFrames[i - 1]);
          _vAxis.crossVectors(prevT, currT);
          const sinA = _vAxis.length();
          if (sinA > 1e-6) {
            _vAxis.divideScalar(sinA);
            const ang = Math.acos(Math.max(-1, Math.min(1, prevT.dot(currT))));
            _upFrames[i].applyAxisAngle(_vAxis, ang);
          }
          _rightFrames[i].crossVectors(_upFrames[i], currT).normalize();
          _upFrames[i].crossVectors(currT, _rightFrames[i]).normalize();
        }

        // Distribute residual holonomy twist smoothly so dorsal ridge aligns with top of skull
        const endUp = _upFrames[BODY_RINGS];
        const endT = _tangents[BODY_RINGS];
        const cosPhi = Math.max(-1, Math.min(1, endUp.dot(_vHeadUp)));
        _vCross.crossVectors(endUp, _vHeadUp);
        const sinPhi = _vCross.dot(endT);
        const totalTwist = Math.atan2(sinPhi, cosPhi);

        // Write vertex positions + exact analytic unit normals in one tight loop
        let ptr = 0;
        for (let i = 0; i <= BODY_RINGS; i++) {
          const frac = i / BODY_RINGS;
          const twist = totalTwist * frac;
          const ct = Math.cos(twist);
          const st = Math.sin(twist);

          const rBase = _rightFrames[i];
          const uBase = _upFrames[i];
          // Rotate (R, U) around +T by `twist`: U' = U*ct - R*st, R' = R*ct + U*st
          _vTmpR.set(
            rBase.x * ct + uBase.x * st,
            rBase.y * ct + uBase.y * st,
            rBase.z * ct + uBase.z * st
          );
          _vTmpU.set(
            uBase.x * ct - rBase.x * st,
            uBase.y * ct - rBase.y * st,
            uBase.z * ct - rBase.z * st
          );

          const cx = _spine[i].x;
          const cy = _spine[i].y;
          const cz = _spine[i].z;

          let rad;
          if (frac < 0.22) rad = 0.025 + Math.pow(frac / 0.22, 0.72) * 0.215;
          else if (frac < 0.88) rad = 0.24 + Math.sin(((frac - 0.22) / 0.66) * Math.PI) * 0.045;
          else rad = 0.24 - ((frac - 0.88) / 0.12) * 0.025;

          const rxVecX = _vTmpR.x, rxVecY = _vTmpR.y, rxVecZ = _vTmpR.z;
          const uyVecX = _vTmpU.x, uyVecY = _vTmpU.y, uyVecZ = _vTmpU.z;

          for (let j = 0; j <= BODY_RADIAL; j++) {
            const ox = _scaleXRad[j] * rad;
            const oy = _scaleYRad[j] * rad;
            bodyPosArr[ptr]     = cx + rxVecX * ox + uyVecX * oy;
            bodyPosArr[ptr + 1] = cy + rxVecY * ox + uyVecY * oy;
            bodyPosArr[ptr + 2] = cz + rxVecZ * ox + uyVecZ * oy;

            const nx = _nxRad[j];
            const ny = _nyRad[j];
            bodyNormArr[ptr]     = rxVecX * nx + uyVecX * ny;
            bodyNormArr[ptr + 1] = rxVecY * nx + uyVecY * ny;
            bodyNormArr[ptr + 2] = rxVecZ * nx + uyVecZ * ny;
            ptr += 3;
          }
        }
        bodyPosAttr.needsUpdate = true;
        bodyNormAttr.needsUpdate = true;
      }

      // Pre-populate geometry & compile all shaders while canvas is hidden (opacity: 0)
      updateSerpentPose(0.45, 1 / 60);
      updateMembranes(0, 0, 0);
      renderer.compile(scene, camera);

      // Main 60-120fps Transition Render Loop (3.70s total)
      function animate(now) {
        if (disposed) return;

        // 2 silent warm-up frames while canvas opacity is 0 so frame 1 never stutters
        if (warmupFrames < 2) {
          warmupFrames++;
          renderer.render(scene, camera);
          if (warmupFrames === 2) {
            headGroup.visible = false;
            bodyMesh.visible = false;
            headQuatInit = false;
            ladderMesh.position.y = -10.8;
            lastTime = now;
            renderer.domElement.style.opacity = '1';
          }
          rafId = requestAnimationFrame(animate);
          return;
        }

        // Clamped delta accumulation prevents teleporting while tracking real wall-clock time
        const dt = Math.min(Math.max((now - lastTime) * 0.001, 0), 1 / 15);
        lastTime = now;
        animTime += dt;
        const t = animTime;

        // -------------------------------------------------------------------
        // PHASE 5 — SEAMLESS GPU-COMPOSITED SITE REVEAL & CLEANUP (3.15s – 3.70s)
        // -------------------------------------------------------------------
        if (t >= 3.15) {
          if (!siteRevealed) {
            siteRevealed = true;
            siteRootEl.classList.add('revealed');
          }
          const easeFade = 1.0 - smootherstep(3.15, 3.70, t);
          overlayEl.style.opacity = String(easeFade);

          if (t >= 3.70) {
            overlayEl.style.opacity = '0';
            overlayEl.classList.add('is-done');
            disposeAll();
            activeCleanup = null;
            window.dispatchEvent(new CustomEvent('serpentTransitionComplete'));
            return;
          }
          rafId = requestAnimationFrame(animate);
          return;
        }

        // -------------------------------------------------------------------
        // PHASES 1–4 KINEMATICS (0.00s – 3.15s, ALL C2-CONTINUOUS)
        // -------------------------------------------------------------------

        // 1. Ladder Ascension (0.00s – 0.85s): smooth glide with gentle deceleration
        const ascU = Math.min(1, t / 0.85);
        const ascEase = 0.35 * (1.0 - Math.pow(1.0 - ascU, 4)) + 0.65 * smootherstep(0.0, 0.85, t);
        ladderMesh.position.y = -10.8 * (1.0 - ascEase);
        ladderGlow.intensity = ascEase * 2.8;

        // 2–4. Viper Emergence, Helical Coiling, S-Coil Lock-On & Strike
        const snakeVisible = t >= 0.42;
        headGroup.visible = snakeVisible;
        bodyMesh.visible = snakeVisible;

        // Continuous jaw gape (up to 74°), hinged fangs, tongue flick, vignette & blackout
        const gapeOpen = smootherstep(2.30, 2.82, t);
        const biteClose = smootherstep(2.86, 3.10, t);
        const jawOpen = Math.max(0, gapeOpen * (1.0 - biteClose));

        const fangOpen = smootherstep(2.26, 2.74, t);
        const fangRetract = smootherstep(2.90, 3.12, t);
        const fangExtend = Math.max(0, fangOpen * (1.0 - fangRetract * 0.85));

        const tonguePulse = smootherstep(1.78, 1.98, t) * (1.0 - smootherstep(2.02, 2.22, t));
        const vignettePulse = smootherstep(2.68, 2.94, t) * (1.0 - smootherstep(3.00, 3.15, t));
        const blackout = smootherstep(2.86, 3.14, t);

        vignetteEl.style.opacity = String(vignettePulse * 0.92);
        blackoutEl.style.opacity = String(blackout);

        if (t >= 2.85 && t <= 2.98) {
          camShake = Math.max(camShake, 0.19);
        }

        if (snakeVisible) {
          updateSerpentPose(t, dt);

          // Articulated Jaws (~74° total gape = 1.29 rad), Hinged Fangs, Membranes & Tongue
          const upperRotX = -jawOpen * 0.506;
          const lowerRotX = jawOpen * 0.785;
          upperJawGroup.rotation.x = upperRotX;
          lowerJawGroup.rotation.x = lowerRotX;

          const fangAng = -1.35 + 1.51 * fangExtend;
          fangL.rotation.x = fangAng;
          fangR.rotation.x = fangAng;
          const showFangs = jawOpen > 0.025;
          fangL.visible = showFangs;
          fangR.visible = showFangs;

          throatLight.intensity = jawOpen * 3.6;
          updateMembranes(upperRotX, lowerRotX, jawOpen);

          if (tonguePulse > 0.02 && jawOpen < 0.05) {
            tongueGroup.visible = true;
            tongueGroup.position.z = 0.28 + tonguePulse * 0.88;
            tongueGroup.rotation.x = Math.sin(t * 48) * 0.20 * tonguePulse;
          } else {
            tongueGroup.visible = false;
          }
        }

        // Update rising golden embers
        for (let i = 0; i < EMBER_COUNT; i++) {
          let y = emberPos[i * 3 + 1] + emberVel[i] * dt;
          if (y > 4.2) y = -3.8;
          emberPos[i * 3 + 1] = y;
        }
        emberPosAttr.needsUpdate = true;

        // Damped camera micro-shake on bite impact
        camera.position.copy(_camBasePos);
        if (camShake > 0.001) {
          camera.position.x += Math.sin(t * 95) * camShake * 0.65;
          camera.position.y += Math.cos(t * 112) * camShake * 0.65;
          camShake *= Math.exp(-16.0 * dt);
        }
        camera.lookAt(_camLookAt);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      }

      rafId = requestAnimationFrame(animate);
    }

    function skipSerpentTransition() {
      if (!siteRootEl) siteRootEl = document.getElementById('site-root');
      if (!overlayEl) overlayEl = document.getElementById('serpent-transition');
      if (siteRootEl) siteRootEl.classList.add('revealed');
      if (overlayEl) {
        overlayEl.style.transition = 'opacity 0.35s ease';
        overlayEl.style.opacity = '0';
        setTimeout(() => {
          overlayEl.classList.add('is-done');
          overlayEl.style.transition = '';
          if (typeof activeCleanup === 'function') {
            activeCleanup();
            activeCleanup = null;
          }
          window.dispatchEvent(new CustomEvent('serpentTransitionComplete'));
        }, 360);
      }
    }

    // Interactive shortcuts: 'R' to replay, 'Escape' / 'Space' / Click to skip
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'Escape' || e.key === ' ' || e.code === 'Space') && overlayEl && !overlayEl.classList.contains('is-done')) {
        skipSerpentTransition();
      }
      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        startSerpentTransition();
      }
    });

    // Fallback safety timeout (ensure site reveals even on low-end/slow devices)
    setTimeout(() => {
      const root = document.getElementById('site-root');
      const trans = document.getElementById('serpent-transition');
      if (root && !root.classList.contains('revealed')) {
        root.classList.add('revealed');
        if (trans) trans.classList.add('is-done');
      }
    }, 4500);

  // Export globally
  window.startSerpentTransition = startSerpentTransition;
  window.skipSerpentTransition = skipSerpentTransition;

  // Initialize transition on load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startSerpentTransition();
  } else {
    window.addEventListener('DOMContentLoaded', startSerpentTransition);
  }
})();