/* ════════════════════════════════════════════════════════════════
   ROBOVERSE.ENGINEERING — drone.js
   Procedural Three.js Quadcopter — No model files needed
   Replaces the Spline iframe — fully self-contained
   ════════════════════════════════════════════════════════════════ */

(function () {
  const container = document.getElementById('drone-viewer');
  const canvas    = document.getElementById('drone-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ─────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  function setSize() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ── Scene & Camera ───────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x030712, 0.055);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 1.8, 6.5);
  camera.lookAt(0, -0.2, 0);

  window.addEventListener('resize', setSize);
  setSize();

  /* ── Materials ────────────────────────────────────────────────── */
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0a1628, metalness: 0.88, roughness: 0.12,
    emissive: 0x00ff88, emissiveIntensity: 0.04
  });
  const armMat = new THREE.MeshStandardMaterial({
    color: 0x060c1a, metalness: 0.92, roughness: 0.18,
    emissive: 0x00ff88, emissiveIntensity: 0.02
  });
  const motorMat = new THREE.MeshStandardMaterial({
    color: 0x0d1b3e, metalness: 1.0, roughness: 0.05,
    emissive: 0x3b82f6, emissiveIntensity: 0.3
  });
  const propMat = new THREE.MeshStandardMaterial({
    color: 0x0a1f0a, metalness: 0.4, roughness: 0.5,
    transparent: true, opacity: 0.92, side: THREE.DoubleSide,
    emissive: 0x00ff88, emissiveIntensity: 0.12
  });
  const emblemMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.9,
    metalness: 0.3, roughness: 0.4
  });

  /* ── Drone Group ──────────────────────────────────────────────── */
  const drone = new THREE.Group();

  // Top octagonal plate
  const topPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.072, 8), bodyMat
  );
  topPlate.position.y = 0.055;
  drone.add(topPlate);

  // Bottom plate
  const botPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.56, 0.06, 8), bodyMat
  );
  botPlate.position.y = -0.125;
  drone.add(botPlate);

  // Center column
  drone.add(Object.assign(
    new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 0.21, 12), bodyMat),
    { position: new THREE.Vector3(0, -0.045, 0) }
  ));

  // Emblem (glowing hex on top)
  const emblem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.012, 6), emblemMat
  );
  emblem.position.y = 0.098;
  drone.add(emblem);

  // Detail ridges on top plate
  for (let i = 0; i < 8; i++) {
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.01, 0.55), armMat
    );
    ridge.rotation.y = (i / 8) * Math.PI * 2;
    ridge.position.y = 0.096;
    drone.add(ridge);
  }

  /* ── Camera Gimbal ─────────────────────────────────────────────── */
  const gimbalPivot = new THREE.Group();
  gimbalPivot.position.set(0, -0.19, 0.1);

  const gimbalArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.2, 0.07), armMat
  );
  gimbalArm.position.y = -0.1;
  gimbalPivot.add(gimbalArm);

  const camBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.155, 0.21),
    new THREE.MeshStandardMaterial({ color: 0x060c1a, metalness: 0.95, roughness: 0.1, emissive: 0x0d1b3e, emissiveIntensity: 0.2 })
  );
  camBody.position.set(0, -0.25, 0.02);
  gimbalPivot.add(camBody);

  // Lens assembly
  const lensOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.075, 0.07, 20), motorMat
  );
  lensOuter.rotation.x = Math.PI / 2;
  lensOuter.position.set(0, -0.25, 0.145);
  gimbalPivot.add(lensOuter);

  const lensInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 0.045, 20),
    new THREE.MeshStandardMaterial({ color: 0x020408, metalness: 1, roughness: 0, emissive: 0x1a4080, emissiveIntensity: 1.2 })
  );
  lensInner.rotation.x = Math.PI / 2;
  lensInner.position.set(0, -0.25, 0.165);
  gimbalPivot.add(lensInner);

  // Lens glint
  const glint = new THREE.Mesh(
    new THREE.CircleGeometry(0.012, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
  );
  glint.position.set(0.015, -0.237, 0.188);
  gimbalPivot.add(glint);

  drone.add(gimbalPivot);

  /* ── Arms, Motors & Propellers ─────────────────────────────────── */
  const propGroups  = [];
  const motorMeshes = [];
  const ARM_LEN     = 1.5;

  // Angles: front-right, front-left, rear-right, rear-left
  const armConfigs = [
    { angle: Math.PI * 0.25,  cw: true  },
    { angle: -Math.PI * 0.25, cw: false },
    { angle: Math.PI * 0.75,  cw: false },
    { angle: -Math.PI * 0.75, cw: true  },
  ];

  armConfigs.forEach(({ angle, cw }) => {
    const tipX = Math.sin(angle) * ARM_LEN;
    const tipZ = Math.cos(angle) * ARM_LEN;

    // Arm
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.055, ARM_LEN), armMat
    );
    arm.position.set(tipX / 2, 0, tipZ / 2);
    arm.rotation.y = angle;
    drone.add(arm);

    // Arm taper detail
    const armTip = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.035, 0.3), armMat
    );
    armTip.position.set(tipX * 0.82, 0, tipZ * 0.82);
    armTip.rotation.y = angle;
    drone.add(armTip);

    // Motor housing
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.175, 0.175, 0.145, 16), motorMat
    );
    motor.position.set(tipX, 0, tipZ);
    drone.add(motor);

    // Motor top cap
    const motorCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.165, 0.165, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 1, roughness: 0.05 })
    );
    motorCap.position.set(tipX, 0.088, tipZ);
    drone.add(motorCap);

    // LED ring (alternating green/blue)
    const ledRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.018, 8, 32),
      new THREE.MeshBasicMaterial({ color: cw ? 0x00ff88 : 0x3b82f6, transparent: true, opacity: 0.9 })
    );
    ledRing.position.set(tipX, 0.075, tipZ);
    motorMeshes.push({ mesh: ledRing, cw });
    drone.add(ledRing);

    /* Propeller group */
    const propGroup = new THREE.Group();
    propGroup.position.set(tipX, 0.14, tipZ);

    // Blur disc
    const blurDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.56, 40),
      new THREE.MeshBasicMaterial({ color: cw ? 0x00ff88 : 0x3b82f6, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    blurDisc.rotation.x = -Math.PI / 2;
    propGroup.add(blurDisc);

    // 2 blades
    for (let b = 0; b < 2; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.014, 0.1), propMat
      );
      blade.position.x = b === 0 ? 0.275 : -0.275;
      blade.rotation.z = b === 0 ? 0.06 : -0.06;
      propGroup.add(blade);

      // Blade tip detail
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.014, 8),
        propMat
      );
      tip.rotation.z = Math.PI / 2;
      tip.position.x = b === 0 ? 0.53 : -0.53;
      propGroup.add(tip);
    }

    propGroups.push({ group: propGroup, dir: cw ? 1 : -1 });
    drone.add(propGroup);
  });

  /* ── Landing Gear ──────────────────────────────────────────────── */
  [-0.35, 0.35].forEach(x => {
    // Diagonal strut
    const strut = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.34, 0.04), armMat
    );
    strut.position.set(x, -0.46, 0);
    drone.add(strut);

    // Foot rail
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.82), armMat
    );
    rail.position.set(x, -0.62, 0);
    drone.add(rail);

    // End caps
    [-0.38, 0.38].forEach(z => {
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 8, 8), armMat
      );
      cap.position.set(x, -0.62, z);
      drone.add(cap);
    });
  });

  scene.add(drone);

  /* ── Ground Grid ───────────────────────────────────────────────── */
  const grid = new THREE.GridHelper(14, 28, 0x00ff88, 0x060d1f);
  grid.position.y = -2.8;
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  scene.add(grid);

  const shadowDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 64),
    new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.045, side: THREE.DoubleSide })
  );
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = -2.79;
  scene.add(shadowDisc);

  /* ── Lights ────────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x0a1628, 2.0));

  const keyLight = new THREE.DirectionalLight(0x00ff88, 2.2);
  keyLight.position.set(4, 6, 3);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x3b82f6, 1.4);
  fillLight.position.set(-5, 1, -3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
  rimLight.position.set(0, -4, -5);
  scene.add(rimLight);

  const underGlow = new THREE.PointLight(0x00ff88, 2.5, 8);
  underGlow.position.set(0, -1.2, 0);
  scene.add(underGlow);

  const topSpot = new THREE.PointLight(0xffffff, 0.8, 5);
  topSpot.position.set(0, 4, 2);
  scene.add(topSpot);

  /* ── Mouse Tilt ────────────────────────────────────────────────── */
  let tgtX = 0, tgtZ = 0, curX = 0, curZ = 0;

  container.addEventListener('mousemove', e => {
    const r  = container.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  - 0.5;
    const ny = (e.clientY - r.top)   / r.height - 0.5;
    tgtZ = -nx * 0.38;
    tgtX =  ny * 0.38;
  });
  container.addEventListener('mouseleave', () => { tgtX = 0; tgtZ = 0; });

  /* ── Animation ─────────────────────────────────────────────────── */
  let t = 0;
  let active = true;

  // Pause when off-screen
  new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.05 })
    .observe(container);

  function tick() {
    requestAnimationFrame(tick);
    if (!active) return;

    t += 0.014;

    // Float
    drone.position.y = Math.sin(t * 0.85) * 0.2;

    // Smooth tilt
    curX += (tgtX - curX) * 0.055;
    curZ += (tgtZ - curZ) * 0.055;
    drone.rotation.x = curX;
    drone.rotation.z = curZ;

    // Gentle auto-yaw
    drone.rotation.y += 0.005;

    // Spin propellers
    propGroups.forEach(({ group, dir }) => {
      group.rotation.y += dir * 0.32;
    });

    // LED pulse
    motorMeshes.forEach(({ mesh, cw }, i) => {
      mesh.material.opacity = 0.55 + Math.sin(t * 5 + i * 1.57) * 0.45;
    });

    // Underglow breathe
    underGlow.intensity = 2.0 + Math.sin(t * 2.2) * 0.6;

    // Shadow disc follow
    shadowDisc.position.x = drone.position.x * 0.15;
    shadowDisc.material.opacity = 0.04 + Math.sin(t * 0.85) * 0.015;

    renderer.render(scene, camera);
  }
  tick();
})();
