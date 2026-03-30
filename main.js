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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const W = container.clientWidth;
  const H = container.clientHeight;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Make slightly brighter
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace || 'srgb';
    container.appendChild(renderer.domElement);
  } catch (e) {
    console.warn('3D Hero blocked.', e);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
  camera.position.set(0, 30, 220); // Closer view to appreciate the drone properly
  camera.lookAt(0, 0, 0);

  /* ── ENVIRONMENT MAP FOR DRONE REFLECTIONS ── */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(100, 32, 32);
  const envMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {},
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
        float y = normalize(vWorldPosition).y;
        vec3 top = vec3(0.04, 0.04, 0.08);
        vec3 mid = vec3(0.08, 0.08, 0.12);
        vec3 bot = vec3(0.02, 0.02, 0.03);
        vec3 col = mix(bot, mid, smoothstep(-1.0, 0.0, y));
        col = mix(col, top, smoothstep(0.0, 1.0, y));
        float spot = smoothstep(0.8, 1.0, dot(normalize(vWorldPosition), normalize(vec3(1.0, 0.8, 0.5))));
        col += vec3(0.5) * spot;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  envScene.add(new THREE.Mesh(envGeo, envMat));
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  /* ── LIGHTS ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(60, 100, 120);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.0);
  rimLight.position.set(-80, 60, -60);
  scene.add(rimLight);

  const underLight = new THREE.PointLight(0x00ff88, 1.2, 300);
  underLight.position.set(0, -60, 40);
  scene.add(underLight);

  const accentLight = new THREE.PointLight(0xa855f7, 2, 400);
  accentLight.position.set(100, 30, -80);
  scene.add(accentLight);

  /* ── DRONE ONLY ── */
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.98, roughness: 0.04 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.95, roughness: 0.08 });
  const glossMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.01 });

  const droneGroup = new THREE.Group();
  
  // Right side of screen position! (Same as widget)
  let baseX = W > 1000 ? W * 0.18 : W > 700 ? W * 0.10 : 0;
  droneGroup.position.set(baseX, -10, 0); 
  
  const dBody = new THREE.Mesh(new THREE.CapsuleGeometry(9, 24, 16, 32), bodyMat);
  dBody.rotation.z = Math.PI / 2;
  dBody.scale.set(1, 0.5, 0.65);
  droneGroup.add(dBody);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45), new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a, metalness: 0.3, roughness: 0.01, clearcoat: 1.0, clearcoatRoughness: 0.02, transparent: true, opacity: 0.85,
  }));
  canopy.position.set(5, 4, 0);
  canopy.scale.set(0.8, 0.45, 0.75);
  droneGroup.add(canopy);

  const dPlate = new THREE.Mesh(new THREE.BoxGeometry(30, 1.5, 15), darkMat);
  dPlate.position.set(0, -3.5, 0);
  droneGroup.add(dPlate);

  const lens = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12), new THREE.MeshPhysicalMaterial({ color: 0x111122, metalness: 0.4, roughness: 0.0, clearcoat: 1.0 }));
  lens.position.set(13, -1, 0);
  lens.scale.set(0.7, 0.5, 0.7);
  droneGroup.add(lens);

  const dRotors = [];
  [
    { x: 22, z: 22, angle: Math.PI / 4 }, { x: 22, z: -22, angle: -Math.PI / 4 },
    { x: -22, z: 22, angle: (Math.PI * 3) / 4 }, { x: -22, z: -22, angle: -(Math.PI * 3) / 4 },
  ].forEach(arm => {
    const armLen = Math.sqrt(arm.x * arm.x + arm.z * arm.z) * 0.5;
    const armMesh = new THREE.Mesh(new THREE.BoxGeometry(armLen, 2.2, 3.2), bodyMat);
    armMesh.position.set(arm.x * 0.5, 0.5, arm.z * 0.5);
    armMesh.rotation.y = arm.angle;
    droneGroup.add(armMesh);
    
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 4.5, 20), glossMat);
    motor.position.set(arm.x, 1.5, arm.z);
    droneGroup.add(motor);
    
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.8, 1.2, 20), darkMat);
    cap.position.set(arm.x, 4, arm.z);
    droneGroup.add(cap);

    const guard = new THREE.Mesh(new THREE.TorusGeometry(12, 0.8, 6, 40), darkMat);
    guard.position.set(arm.x, 3, arm.z);
    guard.rotation.x = Math.PI / 2;
    droneGroup.add(guard);
    
    const bladeGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.15, transparent: true, opacity: 0.6 });
    for (let b = 0; b < 2; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(20, 0.3, 2.4), bladeMat);
      blade.rotation.y = (Math.PI / 2) * b;
      bladeGroup.add(blade);
    }
    bladeGroup.position.set(arm.x, 4.5, arm.z);
    droneGroup.add(bladeGroup);
    dRotors.push(bladeGroup);
  });

  [-7, 7].forEach(z => {
    const skid = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 14, 4, 8), darkMat);
    skid.position.set(0, -9, z);
    skid.rotation.z = Math.PI / 2;
    droneGroup.add(skid);
    [-5, 5].forEach(x => {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 6), darkMat);
      strut.position.set(x, -6.5, z);
      strut.rotation.z = x > 0 ? -0.08 : 0.08;
      droneGroup.add(strut);
    });
  });

  const dLedGeo = new THREE.SphereGeometry(0.5, 8, 8);
  [
    { pos: [22, 1, 22], color: 0x00ff88 }, { pos: [22, 1, -22], color: 0x00ff88 },
    { pos: [-22, 1, 22], color: 0xff3b3b }, { pos: [-22, 1, -22], color: 0xff3b3b },
  ].forEach(led => {
    const mesh = new THREE.Mesh(dLedGeo, new THREE.MeshBasicMaterial({ color: led.color }));
    mesh.position.set(...led.pos);
    droneGroup.add(mesh);
  });

  droneGroup.scale.setScalar(1.6);
  scene.add(droneGroup);

  /* ── BACKGROUND DUST ── */
  const DUST = getAdaptiveCount(700, 350, 150);
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 1200;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 800;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 900 - 200;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.15, sizeAttenuation: true });
  scene.add(new THREE.Points(dustGeo, dustMat));

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

  /* ── ANIMATION LOOP ── */
  const animate = () => {
    if (visible && heroInView) {
      const t = Date.now() * 0.001;

      smxN += (mxN - smxN) * 0.04;
      smyN += (myN - smyN) * 0.04;

      // Drone sweeps organically around "baseX" location, effectively replacing core behavior with more movement
      const sweepX = Math.sin(t * 0.4) * 45;
      const sweepY = Math.sin(t * 0.7) * 12;
      const sweepZ = Math.cos(t * 0.5) * 15;
      
      droneGroup.position.x = baseX + sweepX + smxN * 20;
      droneGroup.position.y = sweepY - smyN * 15;
      droneGroup.position.z = sweepZ;

      const velocityX = Math.cos(t * 0.4) * 45 * 0.4;
      const targetRoll = -velocityX * 0.02;

      droneGroup.rotation.y = -0.3 + smxN * 0.3;
      droneGroup.rotation.x = -0.1 + (smyN * -0.2);
      droneGroup.rotation.z += (targetRoll + (smxN * -0.15) - droneGroup.rotation.z) * 0.1;

      dRotors.forEach((r, i) => r.rotation.y += 0.4 + (i * 0.06));

      camera.position.x = smxN * 10;
      camera.position.y = 30 + smyN * -10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', throttleRAF(() => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
    baseX = W2 > 1000 ? W2 * 0.18 : W2 > 700 ? W2 * 0.10 : 0;
    droneGroup.scale.setScalar(W2 < 900 ? 1.2 : 1.6);
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
      <div class="p-header">${badgeHTML}<span class="p-tag">${p.tag}</span></div>
      <div class="p-media">${mediaHTML}</div>
      <div class="p-info">
        <h3 class="p-name">${p.name}</h3>
        <p class="p-desc">${p.desc}</p>
        <div class="p-footer">
          <span class="price">${priceFormatted}</span>
          <div class="p-actions">
            <button type="button" class="btn-card" data-product="${p.name}">ORDER →</button>
            <button type="button" class="btn-ghost btn-3d" data-model="${p.model || ''}" aria-label="3D Preview">3D Preview</button>
          </div>
        </div>
      </div>`;

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
    card.querySelector('.btn-card').addEventListener('click', () => selectProduct(p.name));
    card.querySelector('.btn-3d')?.addEventListener('click', () => open3DPreview(p));

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
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const product = form.querySelector('[name="product"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !phone || !product) { showToast('⚠️ Please fill all required fields.', true); return; }

    const text = [
      `Hi! I found *AR ENTERPRISE* 🤖`, ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Product:* ${product}`,
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