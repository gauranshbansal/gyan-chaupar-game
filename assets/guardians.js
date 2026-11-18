/* The download page's interactive viewer for the four bundled Yaksha models. */
(() => {
  'use strict';
  const viewport = document.getElementById('tokenViewport');
  if (!viewport) return;
  const canvas = document.getElementById('tokenCanvas');
  const fallback = document.getElementById('tokenFallback');
  const status = document.getElementById('tokenStatus');
  const cards = [...document.querySelectorAll('.yaksha-mini[data-yaksha]')];
  const meshButton = document.getElementById('tokenModeWire');
  const explodeButton = document.getElementById('tokenBtnExplode');
  const spinButton = document.getElementById('tokenBtnAutoSpin');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, mode = 'color', exploded = false, spin = !reduced.matches;
  let renderer, scene, camera, controls, model, frame = 0, visible = false, last = 0;
  let explosion = 0, initialized = false, failed = false;
  const names = ['Kubera', 'Śaṅkha', 'Padma', 'Guhyaka'];
  const slugs = ['kubera', 'sankha', 'padma', 'guhyaka'];
  const titles = ['SOVEREIGN GOLD', 'SACRED TEAL', 'SOLAR CRIMSON', 'ASTRAL SILVER'];
  const colors = ['#f59e0b', '#14b8a6', '#ef4444', '#e2e8f0'];

  function updateLabels() {
    document.getElementById('tokenTagText').textContent = `${names[selected].toUpperCase()} · ${titles[selected]}`;
    const dot = document.getElementById('tokenDot');
    dot.style.background = colors[selected];
    dot.style.boxShadow = `0 0 10px ${colors[selected]}`;
    canvas.setAttribute('aria-label', `Interactive 3D ${names[selected]} guardian figurine`);
    fallback.src = `assets/token_stills/token_${slugs[selected]}_front_color_2048px.png`;
    fallback.alt = `${names[selected]} guardian figurine`;
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === selected);
      card.setAttribute('aria-pressed', String(i === selected));
    });
    meshButton.classList.toggle('active', mode === 'wireframe');
    meshButton.setAttribute('aria-pressed', String(mode === 'wireframe'));
    meshButton.title = mode === 'wireframe' ? 'Show solid sculpture' : 'Show mesh';
    meshButton.setAttribute('aria-label', meshButton.title);
    explodeButton.classList.toggle('active', exploded);
    explodeButton.setAttribute('aria-pressed', String(exploded));
    explodeButton.title = exploded ? 'Assemble anatomy' : 'Separate anatomy';
    explodeButton.setAttribute('aria-label', explodeButton.title);
    spinButton.classList.toggle('active', spin);
    spinButton.setAttribute('aria-pressed', String(spin));
    spinButton.title = spin ? 'Pause auto orbit' : 'Start auto orbit';
    spinButton.setAttribute('aria-label', spinButton.title);
  }

  function disposeModel() {
    if (!model) return;
    scene.remove(model);
    const geometries = new Set(), materials = new Set();
    model.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m));
    });
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
  }

  function loadModel() {
    if (!renderer || failed) return;
    disposeModel();
    const library = window.GyanYakshaModels;
    model = library.create(library.definitions[selected], mode);
    model.userData.explosion = explosion;
    model.children.forEach(part => {
      part.userData.assembled = part.position.clone();
      part.userData.separation = new THREE.Vector3(part.position.x * .7, (part.position.y - .6) * .7, part.position.z * .8);
    });
    scene.add(model);
    render();
  }

  function render() {
    if (!renderer || failed) return;
    model.children.forEach(part => {
      part.position.copy(part.userData.assembled).addScaledVector(part.userData.separation, explosion);
    });
    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer) return;
    const width = Math.max(1, viewport.clientWidth), height = Math.max(1, viewport.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || failed) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .06) : 0;
    last = now;
    const target = exploded ? 1 : 0;
    explosion = reduced.matches ? target : THREE.MathUtils.lerp(explosion, target, 1 - Math.exp(-dt * 8));
    // Fit the separated anatomy while preserving the visitor's orbit and zoom.
    const delta = explosion - (model.userData.explosion || 0);
    const offset = camera.position.clone().sub(controls.target);
    offset.multiplyScalar((1 + explosion * .35) / (1 + (explosion - delta) * .35));
    camera.position.copy(controls.target).add(offset);
    model.userData.explosion = explosion;
    controls.autoRotate = spin && !reduced.matches;
    controls.update();
    render();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (renderer && visible && !document.hidden && !failed) frame = requestAnimationFrame(tick);
  }

  function showFallback(message) {
    failed = true;
    canvas.style.visibility = 'hidden';
    fallback.hidden = false;
    status.textContent = message;
    status.hidden = false;
    [meshButton, explodeButton, spinButton].forEach(button => { button.disabled = true; });
    sync();
  }

  function init() {
    if (initialized) return;
    initialized = true;
    try {
      if (!window.THREE || !THREE.OrbitControls || !window.GyanYakshaModels) throw new Error('Missing local 3D dependencies');
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, .05, 30);
      camera.position.set(0, .76, 2.85);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .9;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      controls = new THREE.OrbitControls(camera, canvas);
      controls.target.set(0, .66, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 1.7;
      controls.maxDistance = 5.5;
      controls.minPolarAngle = .15;
      controls.maxPolarAngle = Math.PI * .88;
      controls.autoRotateSpeed = 1.2;
      controls.addEventListener('start', () => { spin = false; updateLabels(); });
      controls.update();
      scene.add(new THREE.HemisphereLight(0xfff1d8, 0x211710, .75));
      const key = new THREE.DirectionalLight(0xffedcf, 1.65);
      key.position.set(2, 3, 3); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = key.shadow.camera.bottom = -2;
      key.shadow.camera.right = key.shadow.camera.top = 2;
      key.shadow.bias = -.0005;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xc9e4ff, .55);
      fill.position.set(-2, 1, 2); scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffd688, 1.3);
      rim.position.set(0, 2, -2); scene.add(rim);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(1.05, 64), new THREE.ShadowMaterial({ opacity: .35 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -.005;
      floor.receiveShadow = true; scene.add(floor);
      loadModel(); resize();
      fallback.hidden = true;
      new ResizeObserver(resize).observe(viewport);
      sync();
    } catch (error) {
      console.error('Guardian viewer could not start:', error);
      showFallback('3D is unavailable in this browser. You can still explore all four guardian portraits below.');
    }
  }

  cards.forEach((card, i) => {
    card.setAttribute('role', 'button'); card.tabIndex = 0;
    card.setAttribute('aria-label', `View ${names[i]} in 3D`);
    const select = () => { selected = i; updateLabels(); loadModel(); };
    card.addEventListener('click', select);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
    });
  });
  meshButton.addEventListener('click', () => {
    mode = mode === 'wireframe' ? 'color' : 'wireframe';
    updateLabels(); loadModel();
  });
  explodeButton.addEventListener('click', () => { exploded = !exploded; updateLabels(); });
  spinButton.addEventListener('click', () => { spin = !spin; updateLabels(); });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); showFallback('The 3D view was interrupted. Reload the page to restore it.');
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => { if (reduced.matches) spin = false; updateLabels(); sync(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) init();
    sync();
  }, { rootMargin: '200px' }).observe(viewport);
  updateLabels();
})();
