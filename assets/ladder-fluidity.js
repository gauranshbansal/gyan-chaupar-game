/**
 * GYAN CHAUPAR · SACRED LADDER FLUIDITY BACKGROUND
 * 
 * Inspired by Gauransh Bansal Labs' harmonic water-fluidity engine, reimagined for
 * Gyan Chaupar with sacred ascending ladder geometry (Dharma Sopana):
 * - Vertical coupled ladder rails with horizontal golden rungs and junction pegs
 * - Inter-ladder harmonic weft strands evoking the cosmic web of karma & liberation
 * - Cursor plucking, expanding radial wave packets, spring-damper tension physics
 * - Meditative autonomous harmonic undulation and drifting golden dust motes
 */

(function () {
  'use strict';

  const canvas = document.getElementById('ladder-fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // --- PHYSICS & VISUAL TUNING ---
  const CONFIG = {
    rungSpacingY: 42,         // Vertical distance between ladder rungs
    railWidthDesktop: 64,     // Width between left & right rails
    railWidthMobile: 46,
    springTension: 0.038,     // Snap-back force to resting equilibrium
    damping: 0.925,           // Velocity decay
    spreadRail: 0.22,         // Tension spread along vertical ladder rails
    spreadRung: 0.28,         // Coupled tension across horizontal rungs
    spreadWeft: 0.12,         // Coupling across inter-ladder threads
    mouseRadius: 140,         // Cursor hover interaction reach
    mouseStrength: 0.22,      // Direct cursor pluck impulse
    rippleSpeed: 3.4,         // Expansion speed of wave ripples
    rippleStrength: 1.6,      // Peak displacement
    baseRailAlpha: 0.08,      // Resting opacity of ladder rails
    baseRungAlpha: 0.12,      // Resting opacity of ladder rungs
    baseWeftAlpha: 0.045,     // Resting opacity of horizontal weft threads
    highlightAlpha: 0.48,     // Max opacity under dynamic excitation
    
    // Autonomous ambient flow (meditative cosmic breath)
    waveSpeed: 0.0012,
    waveStrength: 0.036
  };

  let width = 0, height = 0;
  let isMobile = false;
  let ladders = []; // Array of ladder columns
  let weftRows = 0;
  let ripples = [];
  let dustParticles = [];

  function checkMobile() {
    return window.innerWidth <= 820 || window.matchMedia('(pointer: coarse)').matches;
  }

  const mouse = {
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    lastX: -9999,
    lastY: -9999,
    lastRippleTime: 0
  };

  function initGrid() {
    isMobile = checkMobile();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const railW = isMobile ? CONFIG.railWidthMobile : CONFIG.railWidthDesktop;
    const ladderGap = isMobile ? 130 : 210;
    
    // Compute number of ladder columns to span screen width plus safety margins
    const usableW = width + 240;
    const ladderStep = railW + ladderGap;
    const numLadders = Math.max(3, Math.ceil(usableW / ladderStep));
    const startX = (width - ((numLadders - 1) * ladderStep)) * 0.5;

    const marginRows = 2;
    weftRows = Math.ceil(height / CONFIG.rungSpacingY) + marginRows * 2 + 1;

    ladders = [];

    for (let col = 0; col < numLadders; col++) {
      const centerX = startX + col * ladderStep;
      const leftX = centerX - railW * 0.5;
      const rightX = centerX + railW * 0.5;

      const leftNodes = [];
      const rightNodes = [];

      for (let r = 0; r < weftRows; r++) {
        const baseY = (r - marginRows) * CONFIG.rungSpacingY;

        leftNodes.push({
          bx: leftX,
          by: baseY,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          energy: 0,
          col: col,
          row: r
        });

        rightNodes.push({
          bx: rightX,
          by: baseY,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          energy: 0,
          col: col,
          row: r
        });
      }

      ladders.push({
        centerX,
        railW,
        leftNodes,
        rightNodes
      });
    }

    // Initialize 24 subtle golden dust motes that float upwards
    dustParticles = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.6,
      alpha: Math.random() * 0.35 + 0.12,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: (Math.random() * -0.28) - 0.08
    }));
  }

  function handlePointer(clientX, clientY) {
    if (mouse.lastX === -9999) {
      mouse.lastX = clientX;
      mouse.lastY = clientY;
    }
    mouse.vx = clientX - mouse.lastX;
    mouse.vy = clientY - mouse.lastY;
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.lastX = clientX;
    mouse.lastY = clientY;

    const speed = Math.hypot(mouse.vx, mouse.vy);
    const now = performance.now();

    // Spawn harmonic ripple waves when moving quickly
    if (speed > 2.6 && now - mouse.lastRippleTime > 85) {
      ripples.push({
        x: mouse.x,
        y: mouse.y,
        radius: 6,
        maxRadius: 260 + Math.min(speed * 4.5, 180),
        strength: Math.min(speed * 0.09, CONFIG.rippleStrength),
        wavelength: 46
      });
      if (ripples.length > 10) ripples.shift();
      mouse.lastRippleTime = now;
    }
  }

  window.addEventListener('mousemove', (e) => {
    handlePointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('touchend', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', () => {
    initGrid();
  });

  // --- PHYSICS ENGINE ---
  function updatePhysics(timeNow) {
    // 1. Advance ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].radius += CONFIG.rippleSpeed;
      if (ripples[i].radius > ripples[i].maxRadius) {
        ripples.splice(i, 1);
      }
    }

    const t = timeNow * CONFIG.waveSpeed;
    const maxR = isMobile ? 110 : CONFIG.mouseRadius;

    // 2. Ladder node dynamics
    for (let col = 0; col < ladders.length; col++) {
      const lad = ladders[col];
      const leftNodes = lad.leftNodes;
      const rightNodes = lad.rightNodes;

      for (let r = 0; r < weftRows; r++) {
        const ln = leftNodes[r];
        const rn = rightNodes[r];

        // Hooke's restoring force to anchor
        ln.vx += -ln.dx * CONFIG.springTension;
        ln.vy += -ln.dy * CONFIG.springTension;
        rn.vx += -rn.dx * CONFIG.springTension;
        rn.vy += -rn.dy * CONFIG.springTension;

        // Ambient meditative harmonic undulation
        const phaseL = r * 0.18 + col * 0.28 + t;
        const phaseR = r * 0.18 + (col + 0.5) * 0.28 + t;
        ln.vx += Math.cos(phaseL) * CONFIG.waveStrength;
        ln.vy += Math.sin(phaseL * 0.9) * CONFIG.waveStrength * 0.6;
        rn.vx += Math.cos(phaseR) * CONFIG.waveStrength;
        rn.vy += Math.sin(phaseR * 0.9) * CONFIG.waveStrength * 0.6;

        // Cursor plucking on left rail node
        const ldx = ln.bx - mouse.x;
        const ldy = ln.by - mouse.y;
        const lDistSq = ldx * ldx + ldy * ldy;
        if (lDistSq < maxR * maxR) {
          const lDist = Math.sqrt(lDistSq) || 1;
          const falloff = Math.pow(1 - lDist / maxR, 2);
          ln.vx += mouse.vx * falloff * CONFIG.mouseStrength * 0.35;
          ln.vy += mouse.vy * falloff * CONFIG.mouseStrength * 0.25;
        }

        // Cursor plucking on right rail node
        const rdx = rn.bx - mouse.x;
        const rdy = rn.by - mouse.y;
        const rDistSq = rdx * rdx + rdy * rdy;
        if (rDistSq < maxR * maxR) {
          const rDist = Math.sqrt(rDistSq) || 1;
          const falloff = Math.pow(1 - rDist / maxR, 2);
          rn.vx += mouse.vx * falloff * CONFIG.mouseStrength * 0.35;
          rn.vy += mouse.vy * falloff * CONFIG.mouseStrength * 0.25;
        }

        // Radial ripples
        for (let i = 0; i < ripples.length; i++) {
          const rip = ripples[i];
          const distL = Math.hypot(ln.bx - rip.x, ln.by - rip.y) || 1;
          const deltaL = distL - rip.radius;
          if (Math.abs(deltaL) < rip.wavelength) {
            const life = 1 - rip.radius / rip.maxRadius;
            const wave = Math.sin((deltaL / rip.wavelength) * Math.PI);
            const force = wave * rip.strength * life * 0.16;
            ln.vx += ((ln.bx - rip.x) / distL) * force;
            ln.vy += ((ln.by - rip.y) / distL) * force;
          }

          const distR = Math.hypot(rn.bx - rip.x, rn.by - rip.y) || 1;
          const deltaR = distR - rip.radius;
          if (Math.abs(deltaR) < rip.wavelength) {
            const life = 1 - rip.radius / rip.maxRadius;
            const wave = Math.sin((deltaR / rip.wavelength) * Math.PI);
            const force = wave * rip.strength * life * 0.16;
            rn.vx += ((rn.bx - rip.x) / distR) * force;
            rn.vy += ((rn.by - rip.y) / distR) * force;
          }
        }
      }

      // Vertical tension along rails
      for (let r = 1; r < weftRows - 1; r++) {
        const lPrev = leftNodes[r - 1], lCurr = leftNodes[r], lNext = leftNodes[r + 1];
        const rPrev = rightNodes[r - 1], rCurr = rightNodes[r], rNext = rightNodes[r + 1];

        const avgLdx = (lPrev.dx + lNext.dx) * 0.5;
        const avgLdy = (lPrev.dy + lNext.dy) * 0.5;
        lCurr.vx += (avgLdx - lCurr.dx) * CONFIG.spreadRail;
        lCurr.vy += (avgLdy - lCurr.dy) * CONFIG.spreadRail;

        const avgRdx = (rPrev.dx + rNext.dx) * 0.5;
        const avgRdy = (rPrev.dy + rNext.dy) * 0.5;
        rCurr.vx += (avgRdx - rCurr.dx) * CONFIG.spreadRail;
        rCurr.vy += (avgRdy - rCurr.dy) * CONFIG.spreadRail;
      }

      // Horizontal tension across ladder rungs (binds Left & Right rails together)
      for (let r = 0; r < weftRows; r++) {
        const ln = leftNodes[r];
        const rn = rightNodes[r];

        const diffX = rn.dx - ln.dx;
        const diffY = rn.dy - ln.dy;
        ln.vx += diffX * CONFIG.spreadRung;
        ln.vy += diffY * CONFIG.spreadRung;
        rn.vx -= diffX * CONFIG.spreadRung;
        rn.vy -= diffY * CONFIG.spreadRung;
      }
    }

    // Coupling across inter-ladder threads (adjacent ladders pull each other gently)
    for (let col = 0; col < ladders.length - 1; col++) {
      const ladA = ladders[col];
      const ladB = ladders[col + 1];
      for (let r = 0; r < weftRows; r += 2) { // Every 2nd row connects
        const nodeA = ladA.rightNodes[r];
        const nodeB = ladB.leftNodes[r];
        const diffX = nodeB.dx - nodeA.dx;
        const diffY = nodeB.dy - nodeA.dy;
        nodeA.vx += diffX * CONFIG.spreadWeft;
        nodeA.vy += diffY * CONFIG.spreadWeft;
        nodeB.vx -= diffX * CONFIG.spreadWeft;
        nodeB.vy -= diffY * CONFIG.spreadWeft;
      }
    }

    // Integrate velocities & calculate node excitation energy
    for (let col = 0; col < ladders.length; col++) {
      const lad = ladders[col];
      for (let r = 0; r < weftRows; r++) {
        const ln = lad.leftNodes[r];
        const rn = lad.rightNodes[r];

        ln.vx *= CONFIG.damping;
        ln.vy *= CONFIG.damping;
        ln.dx += ln.vx;
        ln.dy += ln.vy;
        ln.energy = Math.min(1, Math.hypot(ln.dx, ln.dy) / 7.5);

        rn.vx *= CONFIG.damping;
        rn.vy *= CONFIG.damping;
        rn.dx += rn.vx;
        rn.dy += rn.vy;
        rn.energy = Math.min(1, Math.hypot(rn.dx, rn.dy) / 7.5);
      }
    }

    mouse.vx *= 0.82;
    mouse.vy *= 0.82;
  }

  // --- RENDER ENGINE ---
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Render inter-ladder connecting weft threads (cosmic weaver lines)
    for (let col = 0; col < ladders.length - 1; col++) {
      const ladA = ladders[col];
      const ladB = ladders[col + 1];

      for (let r = 0; r < weftRows; r += 2) {
        const nA = ladA.rightNodes[r];
        const nB = ladB.leftNodes[r];

        const x1 = nA.bx + nA.dx;
        const y1 = nA.by + nA.dy;
        const x2 = nB.bx + nB.dx;
        const y2 = nB.by + nB.dy;

        const avgEnergy = (nA.energy + nB.energy) * 0.5;
        const alpha = CONFIG.baseWeftAlpha + avgEnergy * (CONFIG.highlightAlpha * 0.5 - CONFIG.baseWeftAlpha);

        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const midX = (x1 + x2) * 0.5;
        const midY = (y1 + y2) * 0.5 + 4.0; // Gentle catenary sag
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.stroke();
      }
    }

    // 2. Render Ladders: Rails + Rungs + Junction Mortise Knots
    for (let col = 0; col < ladders.length; col++) {
      const lad = ladders[col];
      const leftNodes = lad.leftNodes;
      const rightNodes = lad.rightNodes;

      // Draw Horizontal Rungs
      for (let r = 0; r < weftRows; r++) {
        const ln = leftNodes[r];
        const rn = rightNodes[r];

        const lx = ln.bx + ln.dx;
        const ly = ln.by + ln.dy;
        const rx = rn.bx + rn.dx;
        const ry = rn.by + rn.dy;

        const rungEnergy = Math.max(ln.energy, rn.energy);
        const alpha = CONFIG.baseRungAlpha + rungEnergy * (CONFIG.highlightAlpha - CONFIG.baseRungAlpha);

        // Gold Rung Beam
        ctx.strokeStyle = `rgba(250, 232, 184, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        const midX = (lx + rx) * 0.5;
        const midY = (ly + ry) * 0.5;
        ctx.quadraticCurveTo(midX, midY, rx, ry);
        ctx.stroke();

        // Junction Pegs (little golden joints at rail intersections)
        if (rungEnergy > 0.05 || (r % 2 === 0)) {
          const pegAlpha = Math.min(1, 0.18 + rungEnergy * 0.7);
          ctx.fillStyle = `rgba(250, 232, 184, ${pegAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(lx, ly, 1.6, 0, Math.PI * 2);
          ctx.arc(rx, ry, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Left Vertical Rail
      ctx.beginPath();
      let leftRailEnergy = 0;
      for (let r = 0; r < weftRows; r++) {
        const n = leftNodes[r];
        const x = n.bx + n.dx;
        const y = n.by + n.dy;
        if (n.energy > leftRailEnergy) leftRailEnergy = n.energy;

        if (r === 0) {
          ctx.moveTo(x, y);
        } else {
          const prev = leftNodes[r - 1];
          const cx = (prev.bx + prev.dx + x) * 0.5;
          const cy = (prev.by + prev.dy + y) * 0.5;
          ctx.quadraticCurveTo(prev.bx + prev.dx, prev.by + prev.dy, cx, cy);
        }
      }
      const lAlpha = CONFIG.baseRailAlpha + leftRailEnergy * (CONFIG.highlightAlpha - CONFIG.baseRailAlpha);
      ctx.strokeStyle = `rgba(212, 175, 55, ${lAlpha.toFixed(3)})`;
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Draw Right Vertical Rail
      ctx.beginPath();
      let rightRailEnergy = 0;
      for (let r = 0; r < weftRows; r++) {
        const n = rightNodes[r];
        const x = n.bx + n.dx;
        const y = n.by + n.dy;
        if (n.energy > rightRailEnergy) rightRailEnergy = n.energy;

        if (r === 0) {
          ctx.moveTo(x, y);
        } else {
          const prev = rightNodes[r - 1];
          const cx = (prev.bx + prev.dx + x) * 0.5;
          const cy = (prev.by + prev.dy + y) * 0.5;
          ctx.quadraticCurveTo(prev.bx + prev.dx, prev.by + prev.dy, cx, cy);
        }
      }
      const rAlpha = CONFIG.baseRailAlpha + rightRailEnergy * (CONFIG.highlightAlpha - CONFIG.baseRailAlpha);
      ctx.strokeStyle = `rgba(212, 175, 55, ${rAlpha.toFixed(3)})`;
      ctx.lineWidth = 1.35;
      ctx.stroke();
    }

    // 3. Render Drifting Sacred Embers / Dust Motes
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.fill();
    }
  }

  function loop(timeNow) {
    updatePhysics(timeNow || performance.now());
    render();
    requestAnimationFrame(loop);
  }

  initGrid();
  loop(performance.now());
})();
