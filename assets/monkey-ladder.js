/* Small SVG ornament. Each hand stays planted while the other reaches a rung. */
(() => {
  'use strict';
  const stage = document.querySelector('.monkey-ladder');
  if (!stage) return;
  const svg = stage.querySelector('svg');
  svg.innerHTML = `
    <defs>
      <linearGradient id="monkeyFur" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#b98c49"/><stop offset=".5" stop-color="#775027"/>
        <stop offset="1" stop-color="#3c2819"/>
      </linearGradient>
      <linearGradient id="monkeyFace" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#ebce8c"/><stop offset="1" stop-color="#bd9255"/>
      </linearGradient>
    </defs>
    <g data-monkey stroke="#d1ab65" stroke-linecap="round" stroke-linejoin="round">
      <path data-tail fill="none" stroke="#9b713b" stroke-width="5"/>
      <path data-tail-line fill="none" stroke="#e1ba72" stroke-width="1"/>
      <path data-arm-back fill="none" stroke="#78512c" stroke-width="7"/>
      <path data-arm-back-line fill="none" stroke-width="1.2"/>
      <path data-leg-back fill="none" stroke="#80572d" stroke-width="7"/>
      <g data-body>
        <ellipse cx="0" cy="87" rx="11" ry="17" fill="url(#monkeyFur)" stroke-width="1.1"/>
        <ellipse cx="2" cy="88" rx="6.6" ry="11" fill="#c8a166" stroke="none" opacity=".65"/>
        <circle cx="-12" cy="65" r="5" fill="url(#monkeyFur)" stroke-width="1"/>
        <circle cx="12" cy="65" r="5" fill="url(#monkeyFur)" stroke-width="1"/>
        <circle cx="-12" cy="65" r="2.7" fill="#c29b62" stroke="none"/>
        <circle cx="12" cy="65" r="2.7" fill="#c29b62" stroke="none"/>
        <path d="M-12 64 Q-13 52 -3 52 L0 48 L3 52 Q14 52 13 65 Q13 78 0 79 Q-12 77 -12 64Z"
          fill="url(#monkeyFur)" stroke-width="1.1"/>
        <path d="M0 60 C-11 53 -12 69 -5 71 Q-8 78 1 78 Q11 77 9 71 C16 64 8 54 0 60Z"
          fill="url(#monkeyFace)" stroke="none"/>
        <ellipse cx="-4" cy="65" rx="1.4" ry="2" fill="#261b13" stroke="none"/>
        <ellipse cx="6" cy="65" rx="1.4" ry="2" fill="#261b13" stroke="none"/>
        <path d="M0 70 L2 70 M-2 73 Q2 76 6 72" fill="none" stroke="#62401f" stroke-width="1.1"/>
        <path d="M-7 55 Q-3 52 -1 54" fill="none" stroke="#e2be7d" stroke-width=".8"/>
      </g>
      <path data-leg-front fill="none" stroke="#a67a40" stroke-width="7"/>
      <path data-leg-line fill="none" stroke-width="1"/>
      <path data-arm-front fill="none" stroke="#ab7f43" stroke-width="7"/>
      <path data-arm-front-line fill="none" stroke="#e4bf7c" stroke-width="1.2"/>
      <g data-hand-back><ellipse rx="3.8" ry="3" fill="#c6a16a" stroke-width="1"/>
        <path d="M-2-1 V2 M0-1 V2 M2-1 V1" stroke="#6b4827" stroke-width=".65"/></g>
      <g data-hand-front><ellipse rx="3.8" ry="3" fill="#e0bc7c" stroke-width="1"/>
        <path d="M-2-1 V2 M0-1 V2 M2-1 V1" stroke="#6b4827" stroke-width=".65"/></g>
    </g>`;

  const parts = {};
  svg.querySelectorAll('[data-monkey], [data-body], path[data-tail], path[data-tail-line], [data-arm-back], [data-arm-back-line], [data-arm-front], [data-arm-front-line], [data-leg-back], [data-leg-front], [data-leg-line], [data-hand-back], [data-hand-front]').forEach(el => {
    parts[el.attributes[0].name.slice(5)] = el;
  });
  const path = (key, value) => parts[key].setAttribute('d', value);
  // Zero velocity and acceleration at release and contact, without a hard stop.
  const smooth = t => t * t * t * (t * (t * 6 - 15) + 10);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Each new grip randomly uses the next rung or skips one.
  const rungSpacing = 42;
  let width = 0, last = 0, frame = 0, visible = false;
  let hands = [63, 105], direction = 1, moving = 0, from = 63, to = 147;
  let progress = 0, duration = 1000, time = 0;
  let flight = null;
  const body = { x: 84, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 };

  function reachPose() {
    // Briefly share the load on both hands before releasing the trailing hand.
    const reach = Math.max(0, Math.min(1, (progress - .08) / .80));
    const positions = hands.slice();
    positions[moving] = from + (to - from) * smooth(reach);
    return { positions, lift: Math.sin(reach * Math.PI) ** 2 };
  }

  function nextGrip() {
    const upper = 21 + Math.floor((width - 63 - 21) / rungSpacing) * rungSpacing;
    let gap = Math.random() < .5 ? rungSpacing : rungSpacing * 2;
    const trailing = () => direction === 1 ? (hands[0] < hands[1] ? 0 : 1) : (hands[0] > hands[1] ? 0 : 1);
    moving = trailing();
    let anchor = hands[1 - moving];
    if (anchor + direction * rungSpacing > upper || anchor + direction * rungSpacing < 63) {
      // Turn around the vertical axis, mirroring the whole pose for the return.
      flight = { elapsed: 0, duration: 1.15, startX: body.x,
        hands: hands.map(x => (x - body.x) * direction) };
      return;
    }
    if (anchor + direction * gap > upper || anchor + direction * gap < 63) gap = rungSpacing;
    from = hands[moving];
    to = anchor + direction * gap;
    duration = (900 + Math.abs(to - from) * 4.5) * (.96 + Math.random() * .08);
    progress = 0;
  }

  function size() {
    const newWidth = stage.clientWidth;
    if (newWidth === width) return;
    const firstSize = width === 0;
    width = newWidth;
    svg.setAttribute('viewBox', `0 0 ${width} 144`);
    if (firstSize || Math.max(...hands, to) > width - 42) {
      hands = [63, 105];
      direction = 1;
      flight = null;
      Object.assign(body, { x: 84, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 });
      nextGrip();
    }
    draw();
  }

  function draw() {
    const { positions, lift } = reachPose();
    const radians = body.angle * Math.PI / 180;
    const cosine = Math.cos(radians), sine = Math.sin(radians);
    const airborne = flight ? Math.min(1, flight.elapsed / flight.duration) : 0;
    const facing = flight ? Math.cos(Math.PI * smooth(airborne)) * direction : direction;
    const tuck = flight ? Math.sin(airborne * Math.PI) ** 2 : 0;
    parts.monkey.setAttribute('transform', `translate(${body.x} 0) scale(${facing} 1)`);
    parts.body.setAttribute('transform', `translate(0 ${body.y}) rotate(${body.angle} 0 87)`);
    function joint(x, y) {
      return [x * cosine - (y - 87) * sine,
        87 + body.y + x * sine + (y - 87) * cosine];
    }

    function hand(index) {
      if (flight) {
        const target = index === 0 ? -14 : 14;
        const grip = flight.hands[index] * (1 - 2 * smooth(airborne));
        return [grip + (target - grip) * tuck, 37 + tuck * 34];
      }
      return [(positions[index] - body.x) * direction, 37 - (index === moving ? lift * 17 : 0)];
    }
    const a = hand(0), b = hand(1);
    function arm(h, shoulder, side) {
      const s = joint(shoulder, 77);
      const dx = h[0] - s[0], dy = h[1] - s[1];
      const distance = Math.max(1, Math.hypot(dx, dy));
      const length = Math.max(30, distance * .505);
      const bend = Math.sqrt(Math.max(0, length * length - distance * distance / 4));
      const elbow = [(s[0] + h[0]) / 2 - dy / distance * bend * side,
        (s[1] + h[1]) / 2 + dx / distance * bend * side];
      return `M${s} L${elbow} L${h}`;
    }
    const back = arm(a, -7, -1), front = arm(b, 8, 1);
    path('arm-back', back); path('arm-back-line', back);
    path('arm-front', front); path('arm-front-line', front);
    parts['hand-back'].setAttribute('transform', `translate(${a})`);
    parts['hand-front'].setAttribute('transform', `translate(${b})`);
    // The legs and tail lag the torso, with a small independent pendulum motion.
    const trail = Math.max(-8, Math.min(8, -body.vx * direction * .12));
    const kick = Math.sin(time * 3.1 - .7) * 3;
    path('leg-back', `M${joint(-5, 98)} Q${-13 + trail - kick} ${110 + body.y - tuck * 12} ${-9 + trail - kick} ${120 + body.y - tuck * 15} l7 0`);
    const foot = `M${joint(6, 98)} Q${14 + trail + kick} ${109 + body.y - tuck * 12} ${12 + trail + kick} ${120 + body.y - tuck * 15} l6 -2`;
    path('leg-front', foot); path('leg-line', foot);
    const curl = Math.sin(time * 2.4 - 1.2) * 3 + trail * .5;
    const tail = `M${joint(-8, 95)} C${-31 + trail} ${101 + body.y} ${-37 + curl} ${76 + body.y} ${-29 + curl} ${73 + body.y} C${-20 + curl} ${69 + body.y} ${-17 + curl} ${82 + body.y} ${-25 + curl} ${84 + body.y}`;
    path('tail', tail); path('tail-line', tail);
  }

  function advance(dt) {
    // Small integration steps keep spring motion stable at different refresh rates.
    const count = Math.ceil(dt / (1 / 120));
    const step = dt / Math.max(1, count);
    for (let i = 0; i < count; i++) {
      time += step;
      if (flight) {
        flight.elapsed += step;
        const p = Math.min(1, flight.elapsed / flight.duration);
        body.x = flight.startX;
        if (p >= 1) {
          // Re-grip the same rungs; stay visible and head back the other way.
          flight = null;
          direction *= -1;
          nextGrip();
        }
        continue;
      }
      progress += step * 1000 / duration;
      if (progress >= 1) {
        const remainder = (progress - 1) * duration;
        hands[moving] = to;
        nextGrip();
        progress = remainder / duration;
        if (flight) continue;
      }
      const { positions, lift } = reachPose();
      const targetX = (positions[0] + positions[1]) / 2;
      body.vx += ((targetX - body.x) * 105 - body.vx * 19) * step;
      body.vy += ((lift * 2.5 - body.y) * 90 - body.vy * 16) * step;
      body.x += body.vx * step;
      body.y += body.vy * step;
      const targetAngle = Math.max(-7, Math.min(7, -body.vx * direction * .10)) + Math.sin(time * 2.8) * 1.3;
      body.angularVelocity += ((targetAngle - body.angle) * 55 - body.angularVelocity * 13) * step;
      body.angle += body.angularVelocity * step;
    }
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) { last = 0; return; }
    if (last) advance(Math.min((now - last) / 1000, .05));
    last = now;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (reduced.matches) draw();
    else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  new ResizeObserver(size).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { rootMargin: '120px' }).observe(stage);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  size();
})();
