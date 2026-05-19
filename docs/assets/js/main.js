/**
 * OSS Contributions Hub — Main Application
 */

const REPO_BASE = 'https://github.com/AsifAd/opensource-contributions/blob/main/';

// ── Loader ──────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.page-loader')?.classList.add('hidden');
    document.body.classList.add('loaded');
  }, 600);
});

// ── Data fetch & render ─────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('assets/data/contributions.json');
    const data = await res.json();
    renderContributions(data.contributions);
    renderRoadmap(data.roadmap);
    renderTimeline(data.timeline);
    updateMeta(data.meta, data.stats);
  } catch (err) {
    console.error('Failed to load contributions data:', err);
  }
}

function updateMeta(meta, stats) {
  const heroStatus = document.getElementById('hero-status');
  if (heroStatus) {
    heroStatus.textContent = `${stats.openPRs} open PR${stats.openPRs !== 1 ? 's' : ''} · Ansible active`;
  }
  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated && meta.updated) {
    const d = new Date(meta.updated);
    lastUpdated.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}

// ── Contributions ───────────────────────────────────────────────────────────
function renderContributions(contributions) {
  const grid = document.getElementById('contributions-grid');
  if (!grid) return;

  grid.innerHTML = contributions.map((c, i) => `
    <article class="contrib-card reveal" data-delay="${i * 100}" style="--card-accent: linear-gradient(135deg, #EE0000, #ff4444)">
      <div class="contrib-header">
        <span class="contrib-tech">${c.techLabel} · ${c.repo.split('/').pop()}</span>
        <span class="contrib-status ${c.status}">${c.statusLabel}</span>
      </div>
      <h3 class="contrib-title">${c.title}</h3>
      <div class="contrib-module">${c.module}()</div>
      <p class="contrib-summary">${c.summary}</p>
      <div class="contrib-highlights">
        ${c.highlights.map(h => `<span class="contrib-tag">${h}</span>`).join('')}
      </div>
      <div class="contrib-links">
        <a href="${c.links.pr}" target="_blank" rel="noopener" class="contrib-link">
          PR #${c.pr}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
        <a href="${c.links.issue}" target="_blank" rel="noopener" class="contrib-link">
          Issue #${c.issue}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
        <a href="${REPO_BASE}${c.deepDive}" target="_blank" rel="noopener" class="contrib-link">
          Deep dive
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
      </div>
    </article>
  `).join('');

  observeReveals(grid.querySelectorAll('.reveal'));
}

// ── Roadmap ─────────────────────────────────────────────────────────────────
function renderRoadmap(roadmap) {
  const grid = document.getElementById('roadmap-grid');
  if (!grid) return;

  grid.innerHTML = roadmap.map((r, i) => `
    <article class="roadmap-card reveal" data-delay="${i * 80}" data-status="${r.status}" style="--card-color: ${r.color}">
      <div class="roadmap-card-header">
        <span class="roadmap-icon">${r.icon}</span>
        <span class="roadmap-label">${r.label}</span>
        <span class="roadmap-status ${r.status}">${r.status}</span>
      </div>
      <p class="roadmap-next"><strong>Next:</strong> ${r.nextUp}</p>
      <div class="roadmap-meta">
        <span class="roadmap-prs">${r.openPRs} open PR${r.openPRs !== 1 ? 's' : ''}</span>
        <a href="${REPO_BASE}${r.docs}" target="_blank" rel="noopener" class="roadmap-docs-link">Docs →</a>
      </div>
      <div class="roadmap-accent-bar"></div>
    </article>
  `).join('');

  observeReveals(grid.querySelectorAll('.reveal'));
  initFilters();
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.roadmap-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.status === filter) {
          card.classList.remove('hidden-filter');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
}

// ── Timeline ────────────────────────────────────────────────────────────────
function renderTimeline(timeline) {
  const list = document.getElementById('timeline-list');
  if (!list) return;

  list.innerHTML = timeline.map(item => `
    <div class="timeline-item type-${item.type}">
      <div class="timeline-date">${item.date}</div>
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-desc">${item.description}</p>
      ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener" class="timeline-link">View →</a>` : ''}
    </div>
  `).join('');

  observeTimeline(list.querySelectorAll('.timeline-item'));
}

// ── Scroll reveals ──────────────────────────────────────────────────────────
function observeReveals(elements) {
  const allReveals = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  allReveals.forEach(el => observer.observe(el));
}

function observeTimeline(items) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach(el => observer.observe(el));
}

// ── Counter animation ───────────────────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

// ── Navigation ──────────────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links?.querySelectorAll('a:not([target])').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
    });
  });
}

// ── Cursor glow ─────────────────────────────────────────────────────────────
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let x = 0, y = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    x = e.clientX;
    y = e.clientY;
  }, { passive: true });

  function animate() {
    cx += (x - cx) * 0.08;
    cy += (y - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Particle canvas ─────────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor(w * h / 15000), 80);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
}

// ── Magnetic buttons ────────────────────────────────────────────────────────
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-primary').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();
  initNav();
  initCursorGlow();
  initParticles();
  animateCounters();
  observeReveals(document.querySelectorAll('.hero .reveal, .stats-section .reveal, .section-header.reveal, .filter-bar.reveal, .cta-card.reveal'));

  // Delay magnetic for cards rendered async
  setTimeout(initMagneticButtons, 1000);
});
