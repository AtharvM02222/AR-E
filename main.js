/* ════════════════════════════════════════════════════════════════
   AR ENTERPRISE — main.js
   Sections:
   1. CURSOR
   2. NAVIGATION
   3. HERO (particles + text reveal)
   4. PRODUCTS (render bento grid)
   5. STATS (number ticker)
   6. SCROLL REVEALS
   7. FORM (WhatsApp redirect)
   8. UTILS
   ════════════════════════════════════════════════════════════════ */

/* ── OWNER CONFIG ────────────────────────────────────────────────
   Change the number below to your WhatsApp number (with country
   code, no spaces, no + sign). Example: 919876543210
   ──────────────────────────────────────────────────────────────── */
const OWNER_WA_NUMBER = '918595237299'; // ← CHANGE THIS

document.addEventListener('DOMContentLoaded', () => {
  // Add a marker class to indicate JS is running; keeps hero content visible if JS fails
  try { document.documentElement.classList.add('js'); } catch (e) { /* noop */ }

  initCursor();
  initNavigation();
  initHero();
  initHeroUI();
  initThreeHero();
  initUIWidgets();
  initVideoModal();
  renderProducts();
  initStats();
  initScrollReveals();
  initForm();
  document.getElementById('year').textContent = new Date().getFullYear();

  // Inject structured data for SEO and ensure drone fallback is checked
  try { injectStructuredData(); } catch (err) { /* noop */ }
  try { initDroneFallbackCheck(); } catch (err) { /* noop */ }
  try { registerServiceWorker(); } catch (err) { /* noop */ }
});

/* ─── 1. CURSOR ────────────────────────────────────────────────── */
function initCursor() {
  // Skip on touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursor || !cursorDot) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  let targetX = 0, targetY = 0;
  let isMagnetic = false;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const loop = () => {
    if (isMagnetic) {
      cx += (targetX - cx) * 0.15;
      cy += (targetY - cy) * 0.15;
    } else {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
    }
    cursor.style.transform    = `translate(${cx - 20}px, ${cy - 20}px)`;
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
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('mobile-toggle');
  const menu   = document.getElementById('mobile-menu');

  // Glassmorphism on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile menu toggle
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

    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMobileMenu();
    });

    // Close when clicking outside the menu (on small screens)
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }
}

/* ─── 3. HERO ───────────────────────────────────────────────────── */
function initHero() {
  // Text reveal — staggered via CSS transition-delay
  const title    = document.getElementById('hero-title');
  const eyebrow  = document.querySelector('.hero-eyebrow');
  const subtitle = document.querySelector('.hero-subtitle');
  const actions  = document.querySelector('.hero-actions');

  setTimeout(() => {
    if (title)    title.classList.add('revealed');
    if (eyebrow)  eyebrow.classList.add('revealed');
    if (actions)  actions.classList.add('revealed');
    
    // Typewriter for subtitle
    if (subtitle) {
      const text = subtitle.textContent.trim();
      subtitle.textContent = '';
      subtitle.classList.add('revealed');
      let i = 0;
      const type = () => {
        if (i < text.length) {
          subtitle.textContent += text.charAt(i);
          i++;
          setTimeout(type, 15);
        }
      };
      setTimeout(type, 800);
    }
  }, 80);

  // Particle canvas (desktop only)
  if (window.innerWidth < 768) return;

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Add smooth scroll handler for internal nav links to avoid sharp jumps
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#' ) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      // close mobile menu if open
      const menu = document.getElementById('mobile-menu');
      const toggle = document.getElementById('mobile-toggle');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open'); toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', false); menu.setAttribute('aria-hidden', true);
      }
    });
  });

  // Initialize scroll parallax
  initScrollParallax();

  const ctx = canvas.getContext('2d');
  let w, h;

  const resize = () => {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT = 55;
  const particles = Array.from({ length: COUNT }, () => mkParticle(w, h));

  let mx = -1000, my = -1000;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  let particleVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => { particleVisible = !document.hidden; });

  const draw = () => {
    if (!particleVisible) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;

      // Mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        const f = (130 - d) / 130;
        p.x += (dx / d) * f * 2.2;
        p.y += (dy / d) * f * 2.2;
      }

      // Wrap
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

// Lightweight hero UI interactivity: pointer parallax + reveal
function initHeroUI() {
  const container = document.querySelector('.drone-static') || document.getElementById('hero');
  const feature = document.querySelector('.feature-card');
  const left = document.querySelector('.hero-ui-left');
  const ui = document.querySelector('.hero-ui');

  // Reveal immediately if we don't have the small UI pieces
  if (ui && !feature) ui.classList.add('revealed');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!feature || prefersReduced) {
    if (ui) ui.classList.add('revealed');
    return;
  }

  // Skip on coarse pointers (touch)
  if (!window.matchMedia('(pointer: fine)').matches) {
    if (ui) ui.classList.add('revealed');
    return;
  }

  let px = 0, py = 0, tx = 0, ty = 0;

  container.addEventListener('pointermove', e => {
    const r = container.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });

  container.addEventListener('pointerleave', () => { px = 0; py = 0; });

  const loop = () => {
    tx += (px - tx) * 0.08;
    ty += (py - ty) * 0.08;
    const rotX = (-ty * 6).toFixed(2);
    const rotY = (tx * 6).toFixed(2);

    try { feature.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${(-ty * 6)}px)`; } catch(e){}
    if (left) left.style.transform = `translate3d(${tx * 12}px, ${ty * 8}px, 0)`;

    requestAnimationFrame(loop);
  };

  // Reveal now that we have interactivity
  setTimeout(() => ui && ui.classList.add('revealed'), 120);
  loop();
}

function initThreeHero() {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('hero-3d');
  if (!container) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const w = container.clientWidth, h = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 2000);
  camera.position.set(0, 0, 350);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir = new THREE.DirectionalLight(0x00ff88, 2.5);
  dir.position.set(50, 50, 75);
  scene.add(dir);
  const dir2 = new THREE.DirectionalLight(0x3b82f6, 1.5);
  dir2.position.set(-50, -50, 30);
  scene.add(dir2);
  const spot = new THREE.SpotLight(0xa855f7, 4, 1000, 0.4, 0.5);
  spot.position.set(0, 200, 100);
  scene.add(spot);

  // Main Robotic Structure (Spline-style)
  const group = new THREE.Group();
  group.position.set(w > 768 ? 180 : 0, 0, -50);
  scene.add(group);

  // Core Sphere (Glowing)
  const coreGeo = new THREE.IcosahedronGeometry(60, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x030712, metalness: 0.9, roughness: 0.1,
    emissive: 0x00ff88, emissiveIntensity: 0.8
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Inner Glow
  const glowGeo = new THREE.SphereGeometry(58, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.2 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  group.add(glow);

  // Floating Mechanical Plates
  const plateGeo = new THREE.BoxGeometry(40, 4, 20);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.2 });
  const plates = [];
  for (let i = 0; i < 18; i++) {
    const plate = new THREE.Mesh(plateGeo, plateMat);
    const angle = (i / 18) * Math.PI * 2;
    const dist = 90;
    plate.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, (Math.random() - 0.5) * 40);
    plate.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(plate);
    plates.push({ mesh: plate, angle, speed: 0.005 + Math.random() * 0.01, dist });
  }

  // Outer Orbital Rings (Robotic Precision)
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const rGeo = new THREE.TorusGeometry(120 + i * 30, 0.6, 16, 120);
    const rMat = new THREE.MeshStandardMaterial({ color: i === 1 ? 0x3b82f6 : 0x00ff88, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = (i * Math.PI) / 3;
    group.add(ring);
    rings.push(ring);
  }

  // Tech Grid Background (Faint 3D Grid)
  const gridGeo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.03 });
  const techGrid = new THREE.Mesh(gridGeo, gridMat);
  techGrid.position.z = -400;
  scene.add(techGrid);

  // Floating Data Particles
  const partGeo = new THREE.BufferGeometry();
  const partCount = 500;
  const partPos = new Float32Array(partCount * 3);
  const partVels = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount; i++) {
    partPos[i*3] = (Math.random() - 0.5) * 2000;
    partPos[i*3+1] = (Math.random() - 0.5) * 1200;
    partPos[i*3+2] = (Math.random() - 0.5) * 1000;
    partVels[i*3] = (Math.random() - 0.5) * 0.4;
    partVels[i*3+1] = (Math.random() - 0.5) * 0.4;
    partVels[i*3+2] = (Math.random() - 0.5) * 0.4;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  const partMat = new THREE.PointsMaterial({ color: 0x00ff88, size: 1.5, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  let px = 0, py = 0;
  container.addEventListener('pointermove', e => {
    const r = container.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });

  let visible = !document.hidden;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const animate = () => {
    if (visible) {
      const time = Date.now() * 0.001;
      
      group.rotation.y += 0.002 + px * 0.01;
      group.rotation.x += 0.001 + py * 0.01;
      
      core.rotation.y -= 0.01;
      glow.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
      
      plates.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.dist;
        p.mesh.position.y = Math.sin(p.angle) * p.dist;
        p.mesh.rotation.x += 0.01;
        p.mesh.rotation.y += 0.015;
      });
      
      rings.forEach((r, i) => {
        r.rotation.z += 0.004 * (i + 1);
        r.rotation.x += 0.002 * (i + 1);
      });
      
      techGrid.position.x = px * 100;
      techGrid.position.y = -py * 100;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < partCount; i++) {
        positions[i*3] += partVels[i*3];
        positions[i*3+1] += partVels[i*3+1];
        positions[i*3+2] += partVels[i*3+2];
        
        if (Math.abs(positions[i*3]) > 1000) positions[i*3] *= -0.99;
        if (Math.abs(positions[i*3+1]) > 600) positions[i*3+1] *= -0.99;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', () => {
    const W = container.clientWidth, H = container.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
    group.position.set(W > 768 ? 180 : 0, 0, -50);
  }, { passive: true });

  animate();
}

function mkParticle(w, h) {
  return {
    x:  Math.random() * w,
    y:  Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r:  0.8 + Math.random() * 0.6,
    o:  0.08 + Math.random() * 0.25,
  };
}

/* ─── 4. PRODUCTS ───────────────────────────────────────────────── */
function renderProducts() {
  const grid   = document.getElementById('products-grid');
  const select = document.getElementById('f-product');

  // BUG FIX: use typeof check, not window.PRODUCTS
  if (!grid || typeof PRODUCTS === 'undefined') return;

  PRODUCTS.forEach((p, i) => {
    const cls     = getBentoClass(p, i);
    const featured = (p.badge === 'PRO' || p.badge === 'BESTSELLER') ? 'featured' : '';

    const card = document.createElement('div');
    card.className = `product-card ${cls} ${featured}`;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${p.name} — ${p.tag}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.btn-card');
        if (btn) btn.click();
      }
    });

    const badgeHTML = p.badge
      ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>`
      : '<span></span>';

    const mediaHTML = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="p-image" loading="lazy">`
      : `<div class="p-emoji-wrap">${p.icon}</div>`;

    // BUG FIX: ₹ rendered in JS, not CSS ::before (avoids gradient transparency issue)
    const priceFormatted = '₹' + Number(p.price).toLocaleString('en-IN');

    card.innerHTML = `
      <div class="p-header">
        ${badgeHTML}
        <span class="p-tag">${p.tag}</span>
      </div>
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
      </div>
    `;

    // Spotlight effect
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });

    // Order button
    card.querySelector('.btn-card').addEventListener('click', () => {
      selectProduct(p.name);
    });

    // 3D preview button (if present)
    const b3d = card.querySelector('.btn-3d');
    if (b3d) {
      b3d.addEventListener('click', () => {
        // pass the product object (p) so open3DPreview can use p.model
        open3DPreview(p);
      });
    }

    grid.appendChild(card);

    // Populate contact form select
    if (select) {
      const opt = document.createElement('option');
      opt.value       = p.name;
      opt.textContent = `${p.name}  —  ₹${Number(p.price).toLocaleString('en-IN')}`;
      select.appendChild(opt);
    }
  });
}

function getBentoClass(p, i) {
  if (p.badge === 'BESTSELLER' || p.badge === 'PRO') return 'large';
  if (p.badge === 'NEW')                              return 'wide';
  return 'std';
}

function smoothScrollTo(el) {
  if (!el) return;
  const nav = document.getElementById('nav');
  const navH = nav ? nav.offsetHeight : 0;
  const top = el.getBoundingClientRect().top + window.scrollY - Math.round(navH * 1.05);
  window.scrollTo({ top, behavior: 'smooth' });
}

function selectProduct(name) {
  const s = document.getElementById('f-product');
  if (s) s.value = name;
  smoothScrollTo(document.getElementById('contact'));
  // Focus the name input after the scroll for a smoother ordering flow
  setTimeout(() => {
    const nameEl = document.getElementById('f-name');
    if (nameEl) nameEl.focus({ preventScroll: true });
  }, 700);
  showToast(`Selected: ${name} ✓`);
}

/* ─── 5. STATS ──────────────────────────────────────────────────── */
function initScrollParallax() {
  const hero = document.getElementById('hero');
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  const hero3d = document.getElementById('hero-3d');
  const fg = document.getElementById('hero-foreground');
  if (!hero) return;

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const sc = Math.max(0, lastY);
        const heroRect = hero.getBoundingClientRect();
        const offset = Math.min(Math.max(sc / 3, 0), 200);
        if (heroBg) heroBg.style.transform = `translateY(${offset * 0.08}px)`;
        if (heroContent) heroContent.style.transform = `translateY(${offset * 0.02}px)`;
        if (hero3d) hero3d.style.transform = `translateY(${offset * 0.012}px) translateZ(0)`;
        if (fg) fg.style.transform = `translateY(${Math.min(offset * -0.12, 0)}px)`;
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

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target, +e.target.dataset.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  els.forEach(el => obs.observe(el));
}

function countUp(el, target) {
  const dur   = 1800;
  const start = performance.now();
  const run   = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.floor(e * target).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

/* ─── 6. SCROLL REVEALS ─────────────────────────────────────────── */
function initScrollReveals() {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  // BUG FIX: exclude #hero — it reveals itself on load, not scroll
  document.querySelectorAll(
    '#products, #about, #contact, .product-card, .stat-block, .pillar, .marquee-divider'
  ).forEach((el, i) => {
    el.classList.add('will-reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    obs.observe(el);
  });
}

/* ─── 7. FORM — WhatsApp redirect ───────────────────────────────── */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Show owner's number in the badge
  const waDisplay = document.getElementById('wa-display');
  if (waDisplay && OWNER_WA_NUMBER !== '91XXXXXXXXXX') {
    // Format nicely: 919876543210 → +91 98765 43210
    const n = OWNER_WA_NUMBER.replace(/^91/, '');
    waDisplay.textContent = `+91 ${n.slice(0,5)} ${n.slice(5)}`;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const product = form.querySelector('[name="product"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !phone || !product) {
      showToast('⚠️ Please fill all required fields.', true);
      return;
    }

    const text = [
      `Hi! I found *AR ENTERPRISE* 🤖`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Product:* ${product}`,
      message ? `*Message:* ${message}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${OWNER_WA_NUMBER}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;

    showToast('Opening WhatsApp... 💬');
    form.reset();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('Service worker registered:', reg);
        // Show a simple toast when an update is waiting; no banner UI
        if (reg.waiting) showToast('Update available — refresh to apply');
        reg.addEventListener('updatefound', () => {
          const inst = reg.installing;
          inst.addEventListener('statechange', () => {
            if (inst.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('New version available — refresh to update');
            }
          });
        });
      }).catch(err => console.warn('SW registration failed:', err));
    });
  }
}

/* ─── 8. UTILS ──────────────────────────────────────────────────── */

/* ─── 8. UTILS ──────────────────────────────────────────────────── */
function initUIWidgets() {
  // Accent switch in nav — toggles CSS theme-alt class
  const switchEl = document.getElementById('accent-switch');
  if (switchEl) {
    switchEl.addEventListener('change', () => {
      document.documentElement.classList.toggle('theme-alt', switchEl.checked);
      showToast(switchEl.checked ? '🔵 Blue accent active' : '🟢 Green accent restored');
    });
  }
}

function initVideoModal() {
  const btn = document.getElementById('watch-action');
  const modal = document.getElementById('video-modal');
  const backdrop = document.getElementById('video-backdrop');
  const close = document.getElementById('video-close');
  const ctaContact = document.getElementById('modal-cta-contact');
  const ctaProducts = document.getElementById('modal-cta-products');
  if (!btn || !modal) return;

  const open = () => {
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if (close) close.focus();
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    btn.focus();
  };

  btn.addEventListener('click', open);
  if (close) close.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

  if (ctaContact) ctaContact.addEventListener('click', () => {
    closeModal();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { const nameEl = document.getElementById('f-name'); if (nameEl) nameEl.focus({ preventScroll: true }); }, 600);
  });

  if (ctaProducts) ctaProducts.addEventListener('click', () => {
    closeModal();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
}

// 3D Preview: open a modal and render a glTF or fallback mesh
function open3DPreview(product) {
  const modal = document.getElementById('model-modal');
  const viewer = document.getElementById('model-viewer');
  const backdrop = document.getElementById('model-backdrop');
  const close = document.getElementById('model-close');
  if (!modal || !viewer) return;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';

  // cleanup previous
  if (window._previewCleanup) { try { window._previewCleanup(); } catch(e){} window._previewCleanup = null; }

  if (typeof THREE === 'undefined') {
    viewer.innerHTML = '<div style="color:#fff;padding:1rem">3D not available</div>';
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  viewer.innerHTML = '';
  viewer.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 120);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7.5);
  scene.add(ambient, dir);

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
      const loader = new THREE.GLTFLoader();
      loader.load(url, gltf => {
        activeObject = gltf.scene;
        scene.add(activeObject);
        const box = new THREE.Box3().setFromObject(activeObject);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        activeObject.position.sub(center);
        const scale = 90 / Math.max(size, 1);
        activeObject.scale.setScalar(scale);
      }, undefined, err => { console.warn('gltf load err', err); loadFallback(); });
    } catch (e) { console.warn('gltf loader err', e); loadFallback(); }
  };

  tryLoadGLTF(product && product.model);

  let px = 0, py = 0;
  viewer.addEventListener('pointermove', e => {
    const r = viewer.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });
  viewer.addEventListener('pointerleave', () => { px = 0; py = 0; });

  let visible = !document.hidden;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const animate = () => {
    if (visible) {
      if (activeObject) {
        activeObject.rotation.y += 0.01 + px * 0.02;
        activeObject.rotation.x += 0.005 + py * 0.01;
      }
      renderer.render(scene, camera);
    }
    window._previewRAF = requestAnimationFrame(animate);
  };
  animate();

  const cleanup = () => {
    cancelAnimationFrame(window._previewRAF);
    try { renderer.dispose(); } catch (e) {}
    if (activeObject) try { scene.remove(activeObject); } catch (e) {}
    viewer.innerHTML = '';
  };
  window._previewCleanup = cleanup;

  const closeModal = () => {
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    cleanup();
  };

  if (close) close.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  const escHandler = (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') { closeModal(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);

  window.addEventListener('resize', () => { if (renderer && viewer) { renderer.setSize(viewer.clientWidth, viewer.clientHeight); camera.aspect = viewer.clientWidth / viewer.clientHeight; camera.updateProjectionMatrix(); } }, { passive: true });
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = isError ? 'error show' : 'show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3200);
}
