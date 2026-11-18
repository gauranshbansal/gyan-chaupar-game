// Figurine geometry and materials reused from the bundled Token Studio.
(() => {
  const THREE = window.THREE;
  if (!THREE) return;
  const haloGlow = true;
    const YAKSHA_DEFS = [
      {
        id: 0,
        name: 'Kubera',
        sanskrit: 'कु',
        color: 0xb9770b,
        metalness: 0.78,
        roughness: 0.18,
        gemColor: 0xfef08a,
        dotHex: '#f59e0b',
        archetype: 'Fortune · Sovereign Gold',
        epithet: 'Sovereign of Golden Abundance & Auspicious Wealth',
        haloColor: 0xfacc15
      },
      {
        id: 1,
        name: 'Śaṅkha',
        sanskrit: 'शं',
        color: 0x087c73,
        metalness: 0.55,
        roughness: 0.22,
        gemColor: 0x5eead4,
        dotHex: '#14b8a6',
        archetype: 'Guardian · Sacred Teal',
        epithet: 'Guardian of Sacred Dharma & Cosmic Conch Resonance',
        haloColor: 0x2dd4bf
      },
      {
        id: 2,
        name: 'Padma',
        sanskrit: 'प',
        color: 0xb32232,
        metalness: 0.42,
        roughness: 0.24,
        gemColor: 0xfca5a5,
        dotHex: '#ef4444',
        archetype: 'Sprinter · Solar Crimson',
        epithet: 'Blossoming Solar Lotus of Mobility & Swift Ascension',
        haloColor: 0xf87171
      },
      {
        id: 3,
        name: 'Guhyaka',
        sanskrit: 'गु',
        color: 0x82909e,
        metalness: 0.72,
        roughness: 0.28,
        gemColor: 0xfde047,
        dotHex: '#e7e5e4',
        archetype: 'Trickster · Astral Silver',
        epithet: 'Mystic Keeper of Astral Shadows & Sacred Secrets',
        haloColor: 0xe2e8f0
      }
    ];

    function createYakshaFigurineMesh(def, mode = 'color') {
      const group = new THREE.Group();

      let bodyMat, goldMat, gemMat, haloMat;

      if (mode === 'sketch') {
        // High-contrast clean clay/alabaster material with crisp edge shadowing - ideal for sketches!
        bodyMat = new THREE.MeshStandardMaterial({
          color: 0xf3f1ec,
          roughness: 0.55,
          metalness: 0.05
        });
        goldMat = new THREE.MeshStandardMaterial({
          color: 0xd6d0c2,
          roughness: 0.45,
          metalness: 0.12
        });
        gemMat = new THREE.MeshStandardMaterial({
          color: 0x242424,
          roughness: 0.25,
          metalness: 0.1
        });
        haloMat = new THREE.MeshStandardMaterial({
          color: 0xbdb7a8,
          roughness: 0.4,
          metalness: 0.1
        });
      } else if (mode === 'wireframe') {
        bodyMat = new THREE.MeshBasicMaterial({ color: 0xd4a96a, wireframe: true });
        goldMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
        gemMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
        haloMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      } else {
        // Authentic Game PBR Materials
        bodyMat = new THREE.MeshStandardMaterial({
          color: def.color,
          metalness: def.metalness,
          roughness: def.roughness
        });

        goldMat = new THREE.MeshStandardMaterial({
          color: 0xc5943c,
          metalness: 0.80,
          roughness: 0.30
        });

        gemMat = new THREE.MeshStandardMaterial({
          color: def.gemColor,
          emissive: def.gemColor,
          emissiveIntensity: haloGlow ? 0.22 : 0.10,
          roughness: 0.10
        });

        haloMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: def.haloColor || def.gemColor,
          emissiveIntensity: haloGlow ? 0.14 : 0.06,
          roughness: 0.20,
          metalness: 0.90
        });
      }

      // Match sRGB palette values to the viewer's linear lighting pipeline.
      if (mode === 'color') {
        [bodyMat, goldMat, gemMat, haloMat].forEach(material => {
          material.color.convertSRGBToLinear();
          if (material.emissive) material.emissive.convertSRGBToLinear();
        });
      }

      // 1. Heavy Bronze Plinth & 12-Petalled Padma Pedestal
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.40, 0.12, 32), goldMat);
      plinth.position.y = 0.06;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      group.add(plinth);

      const petalGeo = new THREE.SphereGeometry(0.09, 14, 14);
      petalGeo.scale(0.85, 0.45, 1.75);
      for (let p = 0; p < 12; p++) {
        const ang = (p / 12) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeo, bodyMat);
        petal.position.set(Math.cos(ang) * 0.28, 0.125, Math.sin(ang) * 0.28);
        petal.rotation.y = -ang + Math.PI / 2;
        petal.rotation.x = 0.28;
        petal.castShadow = true;
        group.add(petal);
      }

      // 2. Cross-Legged Asana & Auspicious Tundila Belly
      const legs = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.085, 16, 32), bodyMat);
      legs.rotation.x = Math.PI / 2;
      legs.position.y = 0.20;
      legs.castShadow = true;
      group.add(legs);

      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 28, 24), bodyMat);
      belly.scale.set(1.06, 0.92, 1.10);
      belly.position.set(0, 0.38, 0.02);
      belly.castShadow = true;
      group.add(belly);

      const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.20, 24), bodyMat);
      chest.position.y = 0.56;
      chest.castShadow = true;
      group.add(chest);

      const torque = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 12, 28), goldMat);
      torque.rotation.x = Math.PI / 2 + 0.18;
      torque.position.set(0, 0.64, 0.02);
      torque.castShadow = true;
      group.add(torque);

      // 3. Arms Holding Glowing Chintamani Jewel
      [-1, 1].forEach(side => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.26, 16), bodyMat);
        arm.position.set(side * 0.21, 0.48, 0.06);
        arm.rotation.z = side * 0.38;
        arm.rotation.x = -0.45;
        arm.castShadow = true;
        group.add(arm);
      });

      const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.095, 1), gemMat);
      jewel.position.set(0, 0.45, 0.23);
      jewel.castShadow = true;
      group.add(jewel);

      // 4. Head, Kundala Earrings & Tiered Karanda Mukuta Crown
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 24), bodyMat);
      head.position.y = 0.80;
      head.castShadow = true;
      group.add(head);

      [-1, 1].forEach(side => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.015, 12, 20), goldMat);
        ring.position.set(side * 0.16, 0.77, 0);
        ring.castShadow = true;
        group.add(ring);
      });

      [0, 1, 2].forEach(tier => {
        const cRing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11 - tier * 0.028, 0.13 - tier * 0.028, 0.08, 24),
          goldMat
        );
        cRing.position.y = 0.95 + tier * 0.075;
        cRing.castShadow = true;
        group.add(cRing);
      });

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 18), goldMat);
      finial.position.y = 1.24;
      finial.castShadow = true;
      group.add(finial);

      // 5. Prabhamandala Halo Behind Head
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.024, 14, 32), haloMat);
      halo.position.set(0, 0.92, -0.10);
      halo.castShadow = true;
      group.add(halo);

      return group;
    }


  window.GyanYakshaModels = { definitions: YAKSHA_DEFS, create: createYakshaFigurineMesh };
})();
