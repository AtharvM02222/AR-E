/* ════════════════════════════════════════════════════════════════
   AR ENTERPRISE — main.js  v4.0  (cross-browser + performance)
   ════════════════════════════════════════════════════════════════ */

const OWNER_WA_NUMBER = '918595237299';

// Add 'js' class immediately to avoid layout shifts and ensure reveal logic works
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const safely = (fn, name) => {
    try {
      fn();
    } catch (e) {
      console.warn(`Module failed to init: ${name}`, e);
    }
  };

  safely(initCursor, 'Cursor');
  safely(initNavigation, 'Navigation');
  safely(initHero, 'Hero');
  safely(initHeroUI, 'HeroUI');
  safely(initThreeHero, 'ThreeHero');
  safely(initUIWidgets, 'UIWidgets');
  safely(initVideoModal, 'VideoModal');
  safely(renderProducts, 'Products');
  safely(initStats, 'Stats');
  safely(initScrollReveals, 'ScrollReveals');
  safely(initForm, 'Form');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  safely(injectStructuredData, 'SEO');
  safely(initDroneFallbackCheck, 'DroneFallback');
  safely(registerServiceWorker, 'PWA');
});

/* ─── STUB: missing function definitions (prevents ReferenceError) ── */
function injectStructuredData() {
  /* Structured data injection — placeholder for future SEO enhancement */
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AR ENTERPRISE",
    "description": "Competition-grade robots, drones and RC kits.",
    "url": window.location.origin
  });
  document.head.appendChild(script);
}

function initDroneFallbackCheck() {
  /* Check if the hero 3D rendered; if not, ensure fallback is visible */
  const hero3d = document.getElementById('hero-3d');
  if (!hero3d) return;
  setTimeout(() => {
    if (!hero3d.querySelector('canvas')) {
      hero3d.style.display = 'none';
    }
  }, 3000);
}

/* ─── 1. CURSOR ────────────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursor || !cursorDot) return;

  let mx = 0, my = 0, cx = 0, cy = 0, targetX = 0, targetY = 0, isMagnetic = false;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const loop = () => {
    if (isMagnetic) {
      cx += (targetX - cx) * 0.15;
      cy += (targetY - cy) * 0.15;
    } else {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
    }
    cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
    cursorDot.style.transform = `translate(${mx - 3}px,  ${my - 3}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.body.addEventListener('pointerover', e => {
    const el = e.target.closest('a, button, .product-card, input, select, textarea');
    if (el) {
      cursor.classList.add('hover');
      if (el.classList.contains('btn-primary') || el.classList.contains('btn-ghost') || el.tagName === 'A') {
        const rect = el.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        isMagnetic = true;
      }
    }
  }, true);
  document.body.addEventListener('pointerout', e => {
    if (e.target.closest('a, button, .product-card, input, select, textarea')) {
      cursor.classList.remove('hover');
      isMagnetic = false;
    }
  }, true);
}

/* ─── 2. NAVIGATION ─────────────────────────────────────────────── */
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (toggle && menu) {
    const closeMobileMenu = () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMobileMenu();
    });
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open'))
        closeMobileMenu();
    });
  }
}

/* ─── 3. HERO ───────────────────────────────────────────────────── */
function initHero() {
  const title = document.getElementById('hero-title');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const subtitle = document.querySelector('.hero-subtitle');
  const actions = document.querySelector('.hero-actions');

  const revealHeroElements = () => {
    if (title) title.classList.add('revealed');
    if (eyebrow) eyebrow.classList.add('revealed');
    if (actions) actions.classList.add('revealed');
    if (subtitle) {
      const text = subtitle.textContent.trim();
      subtitle.textContent = '';
      subtitle.classList.add('revealed');
      void subtitle.offsetHeight; // force repaint — Safari needs this
      let i = 0;
      const type = () => {
        if (i < text.length) { subtitle.textContent += text.charAt(i++); setTimeout(type, 15); }
      };
      setTimeout(type, 600);
    }
  };

  // Primary reveal
  setTimeout(revealHeroElements, 80);

  // Hard safety net — if primary fails for any reason, force-show at 2.5s
  setTimeout(() => {
    [title, eyebrow, subtitle, actions].forEach(el => {
      if (el && !el.classList.contains('revealed')) {
        el.style.cssText += ';opacity:1!important;transform:none!important;transition:opacity 0.6s,transform 0.6s';
        el.classList.add('revealed');
      }
    });
  }, 2500);

  if (window.innerWidth < 768) return;

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      const menu = document.getElementById('mobile-menu');
      const toggle = document.getElementById('mobile-toggle');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open'); toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', false); menu.setAttribute('aria-hidden', true);
      }
    });
  });

  initScrollParallax();

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w, h;
  const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
  window.addEventListener('resize', throttleRAF(resize), { passive: true });
  resize();

  const COUNT = getAdaptiveCount(55, 30, 18);
  const particles = Array.from({ length: COUNT }, () => mkParticle(w, h));
  let mx = -1000, my = -1000;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  let heroVisible = true;
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    obs.observe(heroSection);
  }

  let particleVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => { particleVisible = !document.hidden; });

  const draw = () => {
    if (!particleVisible || !heroVisible) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    for (let j = 0; j < particles.length; j++) {
      const p = particles[j];
      p.x += p.vx; p.y += p.vy;
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) { const f = (130 - d) / 130; p.x += (dx / d) * f * 2.2; p.y += (dy / d) * f * 2.2; }
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.o})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  draw();
}

function initHeroUI() {
  const container = document.querySelector('.drone-static') || document.getElementById('hero');
  const feature = document.querySelector('.feature-card');
  const left = document.querySelector('.hero-ui-left');
  const ui = document.querySelector('.hero-ui');

  if (ui && !feature) { ui.classList.add('revealed'); return; }
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!feature || prefersReduced || !window.matchMedia('(pointer: fine)').matches) {
    if (ui) ui.classList.add('revealed'); return;
  }

  let px = 0, py = 0, tx = 0, ty = 0;
  container.addEventListener('pointermove', e => {
    const r = container.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });
  container.addEventListener('pointerleave', () => { px = 0; py = 0; });

  const loop = () => {
    tx += (px - tx) * 0.08; ty += (py - ty) * 0.08;
    try { feature.style.transform = `rotateX(${(-ty * 6).toFixed(2)}deg) rotateY(${(tx * 6).toFixed(2)}deg) translateY(${(-ty * 6)}px)`; } catch (e) { }
    if (left) left.style.transform = `translate3d(${tx * 12}px, ${ty * 8}px, 0)`;
    requestAnimationFrame(loop);
  };
  setTimeout(() => ui && ui.classList.add('revealed'), 120);
  loop();
}

/* ─── 3D COMBAT CORE HERO (cross-browser + performance) ────────── */
/* ─── 3D COMBAT CORE HERO (Ultra-Premium X-Config) ────────── */
function initThreeHero() {
  if (typeof THREE === 'undefined') {
    let tries = 0;
    const poll = setInterval(() => {
      if (typeof THREE !== 'undefined') { clearInterval(poll); initThreeHero(); }
      else if (++tries > 30) clearInterval(poll);
    }, 100);
    return;
  }
  const container = document.getElementById('hero-3d');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const W = rect.width || window.innerWidth;
  const H = rect.height || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace || 'srgb';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 2500);
  camera.position.set(0, 40, 300); 
  camera.lookAt(0, 0, 0);

  /* ── ENVIRONMENT MAP FOR HYPER-REAL REFLECTIONS ── */
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(100, 32, 32);
  const envMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec3 p = normalize(vWorldPosition);
        vec3 top = vec3(0.05, 0.15, 0.1); 
        vec3 mid = vec3(0.02, 0.02, 0.03); 
        vec3 bot = vec3(0.00, 0.08, 0.15); 
        vec3 col = mix(bot, mid, smoothstep(-1.0, 0.0, p.y));
        col = mix(col, top, smoothstep(0.0, 1.0, p.y));
        
        float light1 = smoothstep(0.96, 0.98, dot(p, normalize(vec3(1.0, 1.0, -1.0))));
        float light2 = smoothstep(0.96, 0.98, dot(p, normalize(vec3(-1.0, 1.2, 0.5))));
        col += vec3(1.0, 3.0, 2.0) * light1; 
        col += vec3(0.5, 2.0, 4.0) * light2; 

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  envScene.add(new THREE.Mesh(envGeo, envMat));
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  /* ── CLASSIC NEON LIGHTING ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(40, 100, 80);
  scene.add(keyLight);

  const rimBlue = new THREE.DirectionalLight(0x3b82f6, 5.0);
  rimBlue.position.set(-100, 50, -80);
  scene.add(rimBlue);

  const rimGreen = new THREE.PointLight(0x00ff88, 5.0, 400);
  rimGreen.position.set(120, -40, 40);
  scene.add(rimGreen);

  /* ── MATERIALS & DYNAMIC DECAL ── */
  const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x0f1419, metalness: 0.9, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.1 });
  const midMetal = new THREE.MeshStandardMaterial({ color: 0x242e39, metalness: 0.7, roughness: 0.5 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.2 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 2.5 });
  const neonBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 2.5 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x051a1a, metalness: 0.2, roughness: 0.0, transmission: 0.9, thickness: 2.0 });

  // Generate Canvas "AR ENTERPRISE" Decal
  const cvs = document.createElement('canvas');
  cvs.width = 1024; cvs.height = 256;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#0f1419';
  ctx.fillRect(0, 0, 1024, 256);
  ctx.font = '900 115px "Inter", "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00ff88'; // Neon Green Text
  ctx.fillText('AR ENTERPRISE', 512, 132);
  ctx.strokeStyle = '#3b82f6'; // Bright Blue Border
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, 964, 196);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(50, 60, 20, 136);
  ctx.fillRect(954, 60, 20, 136);

  const decalTex = new THREE.CanvasTexture(cvs);
  decalTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const decalMat = new THREE.MeshPhysicalMaterial({ map: decalTex, metalness: 0.6, roughness: 0.2, clearcoat: 0.8 });

  /* ── CONSTRUCT DRONE ── */
  const droneGroup = new THREE.Group();
  
  const calculateBaseX = (cam) => {
    const vFov = cam.fov * Math.PI / 180;
    const visibleWidth = 2 * Math.tan(vFov / 2) * cam.position.z * cam.aspect;
    return (visibleWidth / 2) * 0.52; // right side
  };
  let baseX = calculateBaseX(camera);
  droneGroup.position.set(baseX, -10, 0);

  // 1. Central Chassis (Max Detail Core)
  const chassisGroup = new THREE.Group();
  
  // Main Hull
  const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 34), darkMetal);
  chassisGroup.add(coreMesh);

  // Side Engraved Plates
  const decalPlaneGeom = new THREE.PlaneGeometry(32, 8);
  const decalR = new THREE.Mesh(decalPlaneGeom, decalMat);
  decalR.position.set(11.1, 0, 0);
  decalR.rotation.y = Math.PI / 2;
  chassisGroup.add(decalR);

  const decalL = new THREE.Mesh(decalPlaneGeom, decalMat);
  decalL.position.set(-11.1, 0, 0);
  decalL.rotation.y = -Math.PI / 2;
  // Flip texture horizontally for the left side so text isn't backwards
  decalL.scale.x = -1; 
  chassisGroup.add(decalL);

  // Top Armor & Battery Pack
  const topArmor = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 26), midMetal);
  topArmor.position.set(0, 8.5, -2);
  chassisGroup.add(topArmor);

  // Glowing Battery Cores
  const batt1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 14, 16), neonGreen);
  batt1.rotation.z = Math.PI / 2;
  batt1.position.set(0, 11, -5);
  chassisGroup.add(batt1);
  const batt2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 14, 16), neonBlue);
  batt2.rotation.z = Math.PI / 2;
  batt2.position.set(0, 11, 2);
  chassisGroup.add(batt2);

  // Heat Sinks
  for(let i=0; i<6; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 1.5), darkMetal);
    vent.position.set(0, 9, -12 + i*4);
    chassisGroup.add(vent);
  }

  droneGroup.add(chassisGroup);

  // 2. Gimbal Sensor Eye (Front)
  const gimbalGroup = new THREE.Group();
  gimbalGroup.position.set(0, -2, 19);
  
  const gimbalMount = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 16), silverMat);
  gimbalMount.rotation.z = Math.PI / 2;
  gimbalGroup.add(gimbalMount);

  const sensorHousing = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 32), darkMetal);
  sensorHousing.position.set(0, -4, 3);
  sensorHousing.scale.set(1, 0.9, 1.2);
  gimbalGroup.add(sensorHousing);

  const sensorGlass = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2, 32), glassMat);
  sensorGlass.rotation.x = Math.PI / 2;
  sensorGlass.position.set(0, -4, 7);
  gimbalGroup.add(sensorGlass);

  const eyeLight1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.4, 16, 32), neonBlue);
  eyeLight1.position.set(0, -4, 7.5);
  gimbalGroup.add(eyeLight1);
  const pLight = new THREE.PointLight(0x3b82f6, 3.0, 60);
  pLight.position.set(0, -4, 10);
  gimbalGroup.add(pLight);

  droneGroup.add(gimbalGroup);

  // 3. Exposed Mechanical Arms & Rotors (Classic X-Config)
  const dRotors = [];
  const armsData = [
    { x: 1, z: 1, rot: Math.PI / 4, colorMat: neonGreen, lCol: 0x00ff88 },   // FR
    { x:-1, z: 1, rot: -Math.PI / 4, colorMat: neonBlue, lCol: 0x3b82f6 },  // FL
    { x: 1, z:-1, rot: Math.PI * 0.75, colorMat: neonBlue, lCol: 0x3b82f6 }, // BR
    { x:-1, z:-1, rot: -Math.PI * 0.75, colorMat: neonGreen, lCol: 0x00ff88 } // BL
  ];

  armsData.forEach(armConf => {
    const armGroup = new THREE.Group();
    // Move base outwards from center
    armGroup.position.set(armConf.x * 8, 0, armConf.z * 12);
    armGroup.rotation.y = armConf.rot;

    // Heavy Truss main arm extending outward (along its local +Z)
    const truss = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 32), darkMetal);
    truss.position.set(0, 0, 16);
    armGroup.add(truss);

    // Hydraulic side cylinders
    const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 30, 12), silverMat);
    cyl1.rotation.x = Math.PI/2;
    cyl1.position.set(3, 0.5, 16);
    armGroup.add(cyl1);
    const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 30, 12), silverMat);
    cyl2.rotation.x = Math.PI/2;
    cyl2.position.set(-3, 0.5, 16);
    armGroup.add(cyl2);

    // Motor Hub
    const hub = new THREE.Group();
    hub.position.set(0, 3, 32);

    const baseMotor = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 6, 32), midMetal);
    hub.add(baseMotor);

    // Underside glowing thruster ring
    const thruster = new THREE.Mesh(new THREE.TorusGeometry(4.5, 1.0, 16, 32), armConf.colorMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.y = -3;
    hub.add(thruster);
    const thrustLight = new THREE.PointLight(armConf.lCol, 2.5, 50);
    thrustLight.position.set(0, -5, 0);
    hub.add(thrustLight);

    // Rotor Assembly
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 4;

    const spinner = new THREE.Mesh(new THREE.ConeGeometry(3, 4, 16), silverMat);
    spinner.position.y = 2;
    rotorGroup.add(spinner);

    const bladeGeom = new THREE.BoxGeometry(2, 0.2, 22);
    bladeGeom.translate(0, 0, 11); 
    const bladeMat = new THREE.MeshPhysicalMaterial({ color: 0x080808, metalness: 0.5, roughness: 0.2 });

    const blurMat = new THREE.MeshBasicMaterial({ color: armConf.lCol, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    const blurDisk = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 0.05, 32), blurMat);
    rotorGroup.add(blurDisk);

    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.rotation.y = (Math.PI / 2) * b;
      blade.rotation.x = 0.25; 
      
      const tip = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.25, 4), armConf.colorMat);
      tip.position.set(0, 0, 20);
      blade.add(tip);
      rotorGroup.add(blade);
    }

    hub.add(rotorGroup);
    armGroup.add(hub);
    droneGroup.add(armGroup);
    dRotors.push({ group: rotorGroup, dir: armConf.x * armConf.z > 0 ? 1 : -1 });
  });

  // 4. Combat Skids (Landing Gear)
  [-12, 12].forEach(x => {
    const skidGroup = new THREE.Group();
    skidGroup.position.set(x, -10, 0);

    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 36, 16), midMetal);
    pipe.rotation.x = Math.PI / 2;
    skidGroup.add(pipe);

    const pad1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 6), x > 0 ? neonGreen : neonBlue);
    pad1.position.set(0, -0.9, 14);
    skidGroup.add(pad1);
    const pad2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 6), x > 0 ? neonGreen : neonBlue);
    pad2.position.set(0, -0.9, -14);
    skidGroup.add(pad2);

    const strutGeom = new THREE.CylinderGeometry(0.8, 0.8, 12, 12);
    const strutF = new THREE.Mesh(strutGeom, silverMat);
    strutF.position.set(x > 0 ? -3 : 3, 5, 8);
    strutF.rotation.z = x > 0 ? Math.PI / 5 : -Math.PI / 5;
    skidGroup.add(strutF);

    const strutB = new THREE.Mesh(strutGeom, silverMat);
    strutB.position.set(x > 0 ? -3 : 3, 5, -8);
    strutB.rotation.z = x > 0 ? Math.PI / 5 : -Math.PI / 5;
    skidGroup.add(strutB);

    droneGroup.add(skidGroup);
  });

  droneGroup.scale.setScalar(W < 900 ? 0.6 : 0.85);
  scene.add(droneGroup);

  /* ── GRID/ORBIT EFFECT (Background Technological HUD) ── */
  const gridHelper = new THREE.PolarGridHelper(240, 32, 8, 64, 0x00ff88, 0x0a1a3a);
  gridHelper.position.set(baseX, -40, -80);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  scene.add(gridHelper);

  const ringGeo = new THREE.TorusGeometry(160, 0.3, 16, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.3 });
  const hudRing = new THREE.Mesh(ringGeo, ringMat);
  hudRing.position.set(baseX, 0, -120);
  scene.add(hudRing);

  /* ── AMBIENT PARTICLES (Spores/Dust) ── */
  const DUST = getAdaptiveCount(1000, 500, 200);
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 1600;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 1200 - 100;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xaaccff, size: 1.0, transparent: true, opacity: 0.2, sizeAttenuation: true });
  const dustSystem = new THREE.Points(dustGeo, dustMat);
  scene.add(dustSystem);

  /* ── MOUSE PARALLAX & VISIBILITY ── */
  let mxN = 0, myN = 0, smxN = 0, smyN = 0;
  document.addEventListener('mousemove', e => {
    mxN = (e.clientX / window.innerWidth - 0.5) * 2;
    myN = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let visible = !document.hidden;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  let heroInView = true;
  const heroEl = document.getElementById('hero');
  if (heroEl && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => { heroInView = entries[0].isIntersecting; }, { threshold: 0, rootMargin: '100px' });
    obs.observe(heroEl);
  }

  const gimbalTarget = new THREE.Vector3();

  /* ── MASTER ANIMATION LOOP ── */
  const animate = () => {
    if (visible && heroInView) {
      const t = Date.now() * 0.001;

      smxN += (mxN - smxN) * 0.05;
      smyN += (myN - smyN) * 0.05;

      const sweepX = Math.sin(t * 0.3) * 25;
      const sweepY = Math.sin(t * 0.5) * 15;
      const sweepZ = Math.cos(t * 0.4) * 20;
      const vibrate = Math.sin(t * 80) * 0.15; // Engine idle shake
      
      droneGroup.position.x = baseX + sweepX + smxN * 30;
      droneGroup.position.y = -10 + sweepY - smyN * 20 + vibrate;
      droneGroup.position.z = sweepZ;

      const velocityX = Math.cos(t * 0.3) * 25 * 0.3;
      const targetRoll = -velocityX * 0.03;

      droneGroup.rotation.y = -0.3 + smxN * 0.5;
      droneGroup.rotation.x = (smyN * -0.25);
      droneGroup.rotation.z += (targetRoll + (smxN * -0.15) - droneGroup.rotation.z) * 0.1;

      // Blur rotors
      dRotors.forEach(r => r.group.rotation.y += 0.9 * r.dir);

      // Gimbal tracks mouse aggressively
      gimbalTarget.set(smxN * 300, smyN * -300, 200);
      gimbalGroup.lookAt(gimbalTarget);

      // FX Animation
      gridHelper.rotation.y = t * 0.02;
      gridHelper.position.x = baseX + smxN * 20;
      hudRing.rotation.x = t * 0.15;
      hudRing.rotation.y = t * 0.1;
      dustSystem.rotation.y = t * 0.015;

      // Parallax camera
      camera.position.x = smxN * 20;
      camera.position.y = 40 + smyN * -20;
      camera.lookAt(baseX * 0.4, 0, 0);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', throttleRAF(() => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
    baseX = calculateBaseX(camera);
    droneGroup.scale.setScalar(W2 < 900 ? 0.6 : 0.85);
  }), { passive: true });

  animate();
}

function mkParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 0.8 + Math.random() * 0.6,
    o: 0.08 + Math.random() * 0.25,
  };
}

/* ─── 4. PRODUCTS ───────────────────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const select = document.getElementById('f-product');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  PRODUCTS.forEach((p, i) => {
    const cls = getBentoClass(p, i);
    const featured = (p.badge === 'PRO' || p.badge === 'BESTSELLER') ? 'featured' : '';

    const card = document.createElement('div');
    card.className = `product-card ${cls} ${featured}`;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${p.name} — ${p.tag}`);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.querySelector('.btn-card')?.click(); }
    });

    const badgeHTML = p.badge
      ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>`
      : '<span></span>';

    const mediaHTML = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="p-image" loading="lazy">`
      : `<div class="p-emoji-wrap">${p.icon}</div>`;

    const priceFormatted = '₹' + Number(p.price).toLocaleString('en-IN');

    card.innerHTML = `
      <div class="p-header"><span class="p-tag">${p.tag}</span>${badgeHTML}</div>
      <div class="p-media">${mediaHTML}</div>
      <div class="p-info">
        <h3 class="p-name">${p.name}</h3>
        <p class="p-desc">${p.desc}</p>
        <div class="p-footer">
          <span class="price">${priceFormatted}</span>
          <button type="button" class="btn-card" data-product="${p.name}">Order →</button>
        </div>
      </div>`;

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
    card.querySelector('.btn-card').addEventListener('click', () => selectProduct(p.name));

    grid.appendChild(card);

    if (select) {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = `${p.name}  —  ₹${Number(p.price).toLocaleString('en-IN')}`;
      select.appendChild(opt);
    }
  });
}

function getBentoClass(p, i) {
  if (p.badge === 'BESTSELLER' || p.badge === 'PRO') return 'large';
  if (p.badge === 'NEW') return 'wide';
  return 'std';
}

function smoothScrollTo(el) {
  if (!el) return;
  const nav = document.getElementById('nav');
  const navH = nav ? nav.offsetHeight : 0;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - Math.round(navH * 1.05), behavior: 'smooth' });
}

function selectProduct(name) {
  const s = document.getElementById('f-product');
  if (s) s.value = name;
  smoothScrollTo(document.getElementById('contact'));
  setTimeout(() => { document.getElementById('f-name')?.focus({ preventScroll: true }); }, 700);
  showToast(`Selected: ${name} ✓`);
}

/* ─── 5. STATS ──────────────────────────────────────────────────── */
function initScrollParallax() {
  const hero = document.getElementById('hero');
  const heroBg = document.querySelector('.hero-bg');
  const hC = document.querySelector('.hero-content');
  const hero3d = document.getElementById('hero-3d');
  if (!hero) return;

  let lastY = 0, ticking = false;
  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const sc = Math.max(0, lastY);
        const offset = Math.min(sc / 3, 200);
        if (heroBg) heroBg.style.transform = `translateY(${offset * 0.08}px)`;
        if (hC) hC.style.transform = `translateY(${offset * 0.02}px)`;
        if (hero3d) hero3d.style.transform = `translateY(${offset * 0.012}px) translateZ(0)`;
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initStats() {
  const els = document.querySelectorAll('.stat-number');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    /* Fallback for very old browsers: just set the values */
    els.forEach(el => { el.textContent = (+el.dataset.target).toLocaleString('en-IN'); });
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target, +e.target.dataset.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach(el => obs.observe(el));
}

function countUp(el, target) {
  const dur = 1800, start = performance.now();
  const run = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

/* ─── 6. SCROLL REVEALS ─────────────────────────────────────────── */
function initScrollReveals() {
  if (!('IntersectionObserver' in window)) {
    /* Fallback: just show everything immediately */
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('revealed'));
    return;
  }
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });

  document.querySelectorAll('#products, #about, #contact, .product-card, .stat-block, .pillar, .marquee-divider').forEach((el, i) => {
    el.classList.add('will-reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    obs.observe(el);
  });
}

/* ─── 7. FORM ───────────────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const waDisplay = document.getElementById('wa-display');
  if (waDisplay && OWNER_WA_NUMBER !== '91XXXXXXXXXX') {
    const n = OWNER_WA_NUMBER.replace(/^91/, '');
    waDisplay.textContent = `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = (form.querySelector('[name="name"]')?.value    || '').trim();
    const product = (form.querySelector('[name="product"]')?.value || '').trim();
    const message = (form.querySelector('[name="message"]')?.value || '').trim();

    if (!name || !product) { showToast('⚠️ Please fill all required fields.', true); return; }

    const text = [
      `Hi! I found *AR ENTERPRISE* 🚁`, ``,
      `*Name:* ${name}`,
      `*Interested in:* ${product}`,
      message ? `*Message:* ${message}` : '',
    ].filter(Boolean).join('\n');

    const win = window.open(`https://wa.me/${OWNER_WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
    showToast('Opening WhatsApp... 💬');
    form.reset();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        if (reg.waiting) showToast('Update available — refresh to apply');
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller)
                showToast('New version available — refresh to update');
            });
          }
        });
      }).catch(err => console.warn('SW failed:', err));
    });
  }
}

/* ─── 8. UTILS ──────────────────────────────────────────────────── */
function initUIWidgets() {
  const sw = document.getElementById('accent-switch');
  if (sw) {
    sw.addEventListener('change', () => {
      document.documentElement.classList.toggle('theme-alt', sw.checked);
      showToast(sw.checked ? '🔵 Blue accent active' : '🟢 Green accent restored');
    });
  }
}

function initVideoModal() {
  const btn = document.getElementById('watch-action');
  const modal = document.getElementById('video-modal');
  const backdrop = document.getElementById('video-backdrop');
  const close = document.getElementById('video-close');
  const ctaC = document.getElementById('modal-cta-contact');
  const ctaP = document.getElementById('modal-cta-products');
  if (!btn || !modal) return;

  const open = () => { modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; close?.focus(); };
  const closeModal = () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; btn.focus(); };

  btn.addEventListener('click', open);
  close?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
  ctaC?.addEventListener('click', () => { closeModal(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 600); });
  ctaP?.addEventListener('click', () => { closeModal(); document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); });
}

function open3DPreview(product) {
  const modal = document.getElementById('model-modal');
  const viewer = document.getElementById('model-viewer');
  const backdrop = document.getElementById('model-backdrop');
  const close = document.getElementById('model-close');
  if (!modal || !viewer) return;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (window._previewCleanup) { try { window._previewCleanup(); } catch (e) { } window._previewCleanup = null; }

  if (typeof THREE === 'undefined') {
    let tries = 0;
    const poll = setInterval(() => {
      if (typeof THREE !== 'undefined') { clearInterval(poll); open3DPreview(product); }
      else if (++tries > 30) {
        clearInterval(poll);
        viewer.innerHTML = '<div style="color:#fff;padding:1rem">3D not available</div>';
      }
    }, 100);
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    /* Cross-browser color space */
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace || 'srgb';
    } else if ('outputEncoding' in renderer) {
      renderer.outputEncoding = THREE.sRGBEncoding || 3001;
    }
    viewer.innerHTML = '';
    viewer.appendChild(renderer.domElement);
  } catch (e) {
    viewer.innerHTML = '<div style="color:#fff;padding:1rem">3D Preview blocked by browser privacy settings.</div>';
    console.warn('3D Preview blocked or unsupported.', e);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 120);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7.5);
  scene.add(dir);

  let activeObject = null;
  const loadFallback = () => {
    const geo = new THREE.BoxGeometry(48, 36, 24);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.2, roughness: 0.4 });
    activeObject = new THREE.Mesh(geo, mat);
    scene.add(activeObject);
  };

  const tryLoadGLTF = (url) => {
    if (!url || typeof THREE.GLTFLoader === 'undefined') { loadFallback(); return; }
    try {
      new THREE.GLTFLoader().load(url, gltf => {
        activeObject = gltf.scene;
        scene.add(activeObject);
        const box = new THREE.Box3().setFromObject(activeObject);
        const size = box.getSize(new THREE.Vector3()).length();
        activeObject.position.sub(box.getCenter(new THREE.Vector3()));
        activeObject.scale.setScalar(90 / Math.max(size, 1));
      }, undefined, () => loadFallback());
    } catch (e) { loadFallback(); }
  };
  tryLoadGLTF(product?.model);

  let px = 0, py = 0;
  viewer.addEventListener('pointermove', e => {
    const r = viewer.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });
  viewer.addEventListener('pointerleave', () => { px = 0; py = 0; });

  let previewVisible = !document.hidden;
  const visHandler = () => { previewVisible = !document.hidden; };
  document.addEventListener('visibilitychange', visHandler);

  const animatePreview = () => {
    if (previewVisible && activeObject) {
      activeObject.rotation.y += 0.01 + px * 0.02;
      activeObject.rotation.x += 0.005 + py * 0.01;
      renderer.render(scene, camera);
    }
    window._previewRAF = requestAnimationFrame(animatePreview);
  };
  animatePreview();

  const cleanup = () => {
    cancelAnimationFrame(window._previewRAF);
    document.removeEventListener('visibilitychange', visHandler);
    try { renderer.dispose(); } catch (e) { }
    viewer.innerHTML = '';
  };
  window._previewCleanup = cleanup;

  const closeModal = () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; cleanup(); };
  close?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  const esc = e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') { closeModal(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
  window.addEventListener('resize', throttleRAF(() => {
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
  }), { passive: true });
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = isError ? 'error show' : 'show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3200);
}

/* ─── 9. PERFORMANCE UTILITIES ─────────────────────────────────── */

/** Throttle a callback to run at most once per animation frame */
function throttleRAF(fn) {
  let ticking = false;
  return function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
    }
  };
}

/** Return adaptive counts based on device capability (high / mid / low) */
function getAdaptiveCount(high, mid, low) {
  /* Use hardware concurrency + devicePixelRatio as a rough proxy for GPU power */
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = window.devicePixelRatio || 1;
  if (cores >= 8 && dpr <= 2) return high;
  if (cores >= 4) return mid;
  return low;
}