/* Mouth details for the interactive Sarpa Dansha model only. */
(() => {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) return;

  function tongueTextures() {
    const color = document.createElement('canvas'), bump = document.createElement('canvas');
    color.width = bump.width = 128; color.height = bump.height = 512;
    const c = color.getContext('2d'), b = bump.getContext('2d');
    const gradient = c.createLinearGradient(0, 0, 128, 0);
    gradient.addColorStop(0, '#460d09'); gradient.addColorStop(.45, '#8e251e');
    gradient.addColorStop(.58, '#842018'); gradient.addColorStop(1, '#4a100a');
    c.fillStyle = gradient; c.fillRect(0, 0, 128, 512);
    b.fillStyle = '#808080'; b.fillRect(0, 0, 128, 512);
    let seed = 37;
    const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 2600; i++) {
      const x = random() * 128, y = random() * 512, r = .3 + random() * .75;
      c.fillStyle = i % 2 ? '#d69b6633' : '#310b0633';
      c.beginPath(); c.ellipse(x, y, r, r * 1.7, 0, 0, Math.PI * 2); c.fill();
      b.fillStyle = i % 2 ? '#999999' : '#6a6a6a';
      b.beginPath(); b.ellipse(x, y, r, r * 1.7, 0, 0, Math.PI * 2); b.fill();
    }
    for (let i = 0; i < 18; i++) {
      c.beginPath(); c.moveTo(i * 7, 0);
      c.bezierCurveTo(i * 7 + 2, 150, i * 7 - 3, 350, i * 7 + 1, 512);
      c.strokeStyle = '#e8b27b19'; c.lineWidth = .6; c.stroke();
    }
    const map = new THREE.CanvasTexture(color), bumpMap = new THREE.CanvasTexture(bump);
    map.anisotropy = bumpMap.anisotropy = 4;
    return { map, bumpMap };
  }

  function createTongue() {
    // One continuous, thin Y-shaped ribbon; no cylinder caps or separate cones.
    const outline = new THREE.Shape();
    outline.moveTo(-.033, -.42);
    outline.bezierCurveTo(-.038, .20, -.032, .58, -.028, .78);
    outline.bezierCurveTo(-.045, .98, -.090, 1.16, -.110, 1.30);
    outline.bezierCurveTo(-.112, 1.31, -.105, 1.31, -.100, 1.30);
    outline.bezierCurveTo(-.066, 1.16, -.025, 1.04, 0, .92);
    outline.bezierCurveTo(.025, 1.04, .066, 1.16, .100, 1.30);
    outline.bezierCurveTo(.105, 1.31, .112, 1.31, .110, 1.30);
    outline.bezierCurveTo(.090, 1.16, .045, .98, .028, .78);
    outline.bezierCurveTo(.032, .58, .038, .20, .033, -.42);
    outline.closePath();
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: .010, steps: 1, curveSegments: 32,
      bevelEnabled: true, bevelSize: .0015, bevelThickness: .0015, bevelSegments: 2
    });
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, .004, 0);
    const positions = geometry.attributes.position, uv = geometry.attributes.uv;
    const shades = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i);
      const t = Math.max(0, Math.min(1, (z + .42) / 1.73));
      const sway = .035 * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI);
      const arch = .024 * Math.sin(t * Math.PI) * (1 + Math.cos(t * Math.PI));
      positions.setXYZ(i, x + sway, positions.getY(i) + arch, z);
      uv.setXY(i, Math.max(0, Math.min(1, .5 + x / .24)), t);
      const shade = .72 + .28 * (1 - Math.min(1, Math.abs(x) / (z < .78 ? .035 : .12)));
      shades.set([shade, shade, shade], i * 3);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(shades, 3));
    geometry.computeVertexNormals();
    const texture = tongueTextures();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      // Pigment and fine grain remain visible instead of clipping to orange
      // under the close inspection lights. Curved geometry supplies the depth.
      color: 0xbf7b6c, map: texture.map, vertexColors: true
    }));
    mesh.name = 'Sarpa continuous forked tongue';
    return mesh;
  }

  function createThroat(bumpMap, hingeZ, halfWidthAt) {
    // A single U-shaped lining: roof -> rear wall -> floor. Its only exposed
    // perimeter lies under the lips and cheeks; there is no floating throat rim.
    const roofRows = 24, backRows = 12, floorRows = 24, sides = 28;
    const rows = roofRows + backRows + floorRows;
    const positions = new Float32Array((rows + 1) * (sides + 1) * 3);
    const colors = new Float32Array(positions.length);
    const uvs = new Float32Array((rows + 1) * (sides + 1) * 2);
    const indices = [];
    const front = new THREE.Color(0x7e3025), back = new THREE.Color(0x1e0603);
    for (let row = 0; row <= rows; row++) {
      const depth = row <= roofRows ? row / roofRows
        : row <= roofRows + backRows ? 1 : 1 - (row - roofRows - backRows) / floorRows;
      const shade = front.clone().lerp(back, Math.pow(depth, 1.4));
      for (let side = 0; side <= sides; side++) {
        const at = row * (sides + 1) + side;
        colors.set([shade.r, shade.g, shade.b], at * 3);
        uvs.set([side / sides, row / rows * 3], at * 2);
        if (row < rows && side < sides) {
          const next = at + sides + 1;
          indices.push(at, next, at + 1, at + 1, next, next + 1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    const walls = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      // Stable depth shading avoids the nearby mouth light bleaching the lining.
      vertexColors: true, side: THREE.DoubleSide
    }));
    walls.name = 'Continuous jaw-attached oral lining';
    const group = new THREE.Group();
    group.name = 'Sarpa continuous mouth lining';
    group.add(walls);
    const backZ = -.34;
    function surface(z, nx, upper, angle) {
      const t = upper ? (z + .88) / 2.2 : (z + .82) / 2.06;
      const width = halfWidthAt(t) * (upper ? .74 : .70);
      const lip = Math.sin(Math.min(1, Math.max(0, (1.14 - z) / .18)) * Math.PI / 2);
      const x = nx * width * lip;
      const y = upper ? .015 + (1 - nx * nx) * .055 : .018 + Math.pow(Math.abs(nx), 2.4) * .025;
      const dz = z - hingeZ;
      return [x, y * Math.cos(angle) - dz * Math.sin(angle), hingeZ + y * Math.sin(angle) + dz * Math.cos(angle)];
    }
    function update(upperAngle, lowerAngle) {
      for (let row = 0; row <= rows; row++) {
        for (let side = 0; side <= sides; side++) {
          const nx = side / sides * 2 - 1;
          let point;
          if (row <= roofRows) {
            point = surface(1.10 + (backZ - 1.10) * row / roofRows, nx, true, upperAngle);
          } else if (row <= roofRows + backRows) {
            const t = (row - roofRows) / backRows;
            const top = surface(backZ, nx, true, upperAngle);
            const bottom = surface(backZ, nx, false, lowerAngle);
            point = top.map((value, axis) => value + (bottom[axis] - value) * t);
            point[2] -= .025 * Math.sin(t * Math.PI) * (1 - nx * nx);
          } else {
            const t = (row - roofRows - backRows) / floorRows;
            point = surface(backZ + (1.04 - backZ) * t, nx, false, lowerAngle);
          }
          positions.set(point, (row * (sides + 1) + side) * 3);
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    }
    update(0, 0);
    return { group, update };
  }
  window.GyanSerpentMouth = { createTongue, createThroat };
})();
