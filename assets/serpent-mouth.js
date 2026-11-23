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
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
      color: 0x7a1821, roughness: .32, metalness: 0, clearcoat: .65,
      clearcoatRoughness: .24
    }));
    mesh.name = 'Sarpa continuous forked tongue';
    return mesh;
  }

  function createThroat(bumpMap, hingeZ) {
    const rings = 18, sides = 48;
    const positions = new Float32Array((rings + 1) * (sides + 1) * 3);
    const colors = new Float32Array(positions.length);
    const uvs = new Float32Array((rings + 1) * (sides + 1) * 2);
    const indices = [];
    const front = new THREE.Color(0x4c1517), back = new THREE.Color(0x050102);
    for (let ring = 0; ring <= rings; ring++) {
      const depth = ring / rings;
      const shade = front.clone().lerp(back, Math.min(1, depth * 1.3));
      for (let side = 0; side <= sides; side++) {
        const at = ring * (sides + 1) + side;
        colors.set([shade.r, shade.g, shade.b], at * 3);
        uvs.set([side / sides * 2, depth * 2], at * 2);
        if (ring < rings && side < sides) {
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
    // Open at the front: the viewer sees recessed walls, never a flat disk.
    const walls = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      // Baked depth shading stays dark under the mouth's very close point light.
      vertexColors: true, side: THREE.DoubleSide
    }));
    walls.name = 'Recessed open throat walls';
    const darkness = new THREE.Mesh(new THREE.SphereGeometry(.08, 20, 14),
      new THREE.MeshBasicMaterial({ color: 0x050102 }));
    darkness.scale.set(1, .88, .7);
    darkness.position.z = -.47;
    const group = new THREE.Group();
    group.name = 'Sarpa recessed mouth cavity';
    group.add(walls, darkness);
    function update(upperAngle, lowerAngle) {
      const frontZ = .42, dz = frontZ - hingeZ;
      const upperY = .05 * Math.cos(upperAngle) - dz * Math.sin(upperAngle);
      const lowerY = -.025 * Math.cos(lowerAngle) - dz * Math.sin(lowerAngle);
      const upperZ = hingeZ + .05 * Math.sin(upperAngle) + dz * Math.cos(upperAngle);
      const lowerZ = hingeZ - .025 * Math.sin(lowerAngle) + dz * Math.cos(lowerAngle);
      const middle = (upperY + lowerY) / 2;
      const radiusY = Math.max(.035, (upperY - lowerY) / 2);
      for (let ring = 0; ring <= rings; ring++) {
        const depth = ring / rings;
        const taper = Math.sqrt(Math.max(0, 1 - depth * depth));
        for (let side = 0; side <= sides; side++) {
          const theta = side / sides * Math.PI * 2;
          const vertical = Math.sin(theta);
          const fold = 1 + .035 * Math.cos(theta * 7 + depth * 5) * Math.sin(depth * Math.PI);
          const lateral = Math.cos(theta);
          const x = Math.sign(lateral) * Math.pow(Math.abs(lateral), .5) * .46 * taper * fold;
          const roundedOpening = Math.sign(vertical) * Math.pow(Math.abs(vertical), .5);
          const y = middle * (1 - depth * .82) + roundedOpening * (radiusY * (1 - depth) + .055 * depth) * taper * fold;
          const lipZ = lowerZ + (upperZ - lowerZ) * (vertical + 1) / 2;
          // End before the neck socket at -.52 so its exterior cap stays hidden.
          const z = lipZ * (1 - depth) - .43 * depth;
          const at = (ring * (sides + 1) + side) * 3;
          positions[at] = x; positions[at + 1] = y; positions[at + 2] = z;
        }
      }
      darkness.position.y = middle * .18;
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    }
    update(0, 0);
    return { group, update };
  }
  window.GyanSerpentMouth = { createTongue, createThroat };
})();
