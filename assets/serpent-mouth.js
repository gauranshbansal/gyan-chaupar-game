/* Mouth details for the interactive Sarpa Dansha model only. */
(() => {
  'use strict';
  const THREE = window.THREE;
  if (!THREE) return;

  function createTongue() {
    // One continuous, thin Y-shaped ribbon; no cylinder caps or separate cones.
    const outline = new THREE.Shape();
    outline.moveTo(-.025, -.42);
    outline.bezierCurveTo(-.030, .20, -.025, .58, -.022, .78);
    outline.bezierCurveTo(-.045, .98, -.090, 1.16, -.110, 1.30);
    outline.bezierCurveTo(-.112, 1.31, -.105, 1.31, -.100, 1.30);
    outline.bezierCurveTo(-.066, 1.16, -.025, 1.04, 0, .92);
    outline.bezierCurveTo(.025, 1.04, .066, 1.16, .100, 1.30);
    outline.bezierCurveTo(.105, 1.31, .112, 1.31, .110, 1.30);
    outline.bezierCurveTo(.090, 1.16, .045, .98, .022, .78);
    outline.bezierCurveTo(.025, .58, .030, .20, .025, -.42);
    outline.closePath();
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: .008, steps: 1, curveSegments: 16,
      bevelEnabled: true, bevelSize: .0015, bevelThickness: .0015, bevelSegments: 2
    });
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, .004, 0);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x46101c }));
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
    const front = new THREE.Color(0x6b2831), back = new THREE.Color(0x170407);
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
