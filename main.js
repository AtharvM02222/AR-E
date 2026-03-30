/* ════════════════════════════════════════════════════════════════
   ROBOVERSE.ENGINEERING — main.js  v5.0
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
  initCursor();
  initNavigation();
  initHero();
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

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const loop = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform    = `translate(${cx - 20}px, ${cy - 20}px)`;
    cursorDot.style.transform = `translate(${mx - 3}px,  ${my - 3}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.body.addEventListener('pointerover', e => {
    if (e.target.closest('a, button, .product-card, input, select, textarea')) {
      cursor.classList.add('hover');
    }
  }, true);

  document.body.addEventListener('pointerout', e => {
    if (e.target.closest('a, button, .product-card, input, select, textarea')) {
      cursor.classList.remove('hover');
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
    if (subtitle) subtitle.classList.add('revealed');
    if (actions)  actions.classList.add('revealed');
  }, 80);

  // Particle canvas (desktop only)
  if (window.innerWidth < 768) return;

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

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
          <button type="button" class="btn-card" data-product="${p.name}">ORDER →</button>
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

function selectProduct(name) {
  const s = document.getElementById('f-product');
  if (s) s.value = name;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  // Focus the name input after the scroll for a smoother ordering flow
  setTimeout(() => {
    const nameEl = document.getElementById('f-name');
    if (nameEl) nameEl.focus({ preventScroll: true });
  }, 600);
  showToast(`Selected: ${name} ✓`);
}

/* ─── 5. STATS ──────────────────────────────────────────────────── */
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
      `Hi! I found *ROBOVERSE.ENGINEERING* 🤖`,
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

        const promptForUpdate = (registration) => {
          const el = document.getElementById('sw-update');
          if (!el) { showToast('Update available — refresh to apply'); return; }
          el.hidden = false;
          const refreshBtn = document.getElementById('sw-refresh');
          const dismissBtn = document.getElementById('sw-dismiss');

          const onRefresh = () => {
            if (registration.waiting) {
              // Tell SW to activate immediately
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              showToast('Updating…');
            }
          };

          refreshBtn && refreshBtn.addEventListener('click', onRefresh, { once: true });
          dismissBtn && dismissBtn.addEventListener('click', () => { el.hidden = true; });

          // When the new SW takes control, reload to apply update
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          }, { once: true });
        };

        if (reg.waiting) {
          promptForUpdate(reg);
        }

        reg.addEventListener('updatefound', () => {
          const inst = reg.installing;
          inst.addEventListener('statechange', () => {
            if (inst.state === 'installed' && navigator.serviceWorker.controller) {
              promptForUpdate(reg);
            }
          });
        });

      }).catch(err => console.warn('SW registration failed:', err));
    });
  }
}

/* ─── 8. UTILS ──────────────────────────────────────────────────── */
function showToast(msg, isError) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = isError ? 'error show' : 'show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3200);
}
