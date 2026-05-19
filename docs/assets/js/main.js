/**
 * OSS Tracker — application logic
 */

const REPO_BASE = 'https://github.com/AsifAd/opensource-contributions/blob/main/';

// ── Theme ───────────────────────────────────────────────────────────────────
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('oss-theme', theme);
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = getComputedStyle(root).getPropertyValue('--meta-theme').trim() || '#15130f';
    }
  }

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
  });
}

// ── Loader ──────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.page-loader')?.classList.add('hidden'), 400);
});

// ── Data ────────────────────────────────────────────────────────────────────
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
    <article class="contrib-card reveal" data-testid="contrib-${c.id}" data-delay="${i * 80}">
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
        <a href="${c.links.pr}" target="_blank" rel="noopener" class="contrib-link">PR #${c.pr}</a>
        <a href="${c.links.issue}" target="_blank" rel="noopener" class="contrib-link">Issue #${c.issue}</a>
        <a href="${REPO_BASE}${c.deepDive}" target="_blank" rel="noopener" class="contrib-link">Deep dive</a>
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
    <article class="roadmap-card reveal" data-testid="roadmap-${r.tech}" data-delay="${i * 60}" data-status="${r.status}">
      <div class="roadmap-card-header">
        <span class="roadmap-icon" aria-hidden="true">${r.icon}</span>
        <span class="roadmap-label">${r.label}</span>
        <span class="roadmap-status ${r.status}">${r.status}</span>
      </div>
      <p class="roadmap-next"><strong>Next</strong> ${r.nextUp}</p>
      <div class="roadmap-meta">
        <span class="roadmap-prs">${r.openPRs} open PR${r.openPRs !== 1 ? 's' : ''}</span>
        <a href="${REPO_BASE}${r.docs}" target="_blank" rel="noopener" class="roadmap-docs-link">Docs</a>
      </div>
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
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.classList.toggle('hidden-filter', filter !== 'all' && card.dataset.status !== filter);
      });
    });
  });
}

// ── Timeline ────────────────────────────────────────────────────────────────
function renderTimeline(timeline) {
  const list = document.getElementById('timeline-list');
  if (!list) return;

  list.innerHTML = timeline.map(item => `
    <div class="timeline-item type-${item.type}" data-testid="timeline-${item.type}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}">
      <div class="timeline-date">${item.date}</div>
      <h3 class="timeline-title">${item.title}</h3>
      <p class="timeline-desc">${item.description}</p>
      ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener" class="timeline-link">View</a>` : ''}
    </div>
  `).join('');

  observeTimeline(list.querySelectorAll('.timeline-item'));
}

// ── Scroll reveals ──────────────────────────────────────────────────────────
function observeReveals(elements) {
  const pending = elements.length
    ? elements
    : document.querySelectorAll('.reveal:not(.visible)');

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
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  pending.forEach(el => observer.observe(el));
}

function observeTimeline(items) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
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
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(c => observer.observe(c));
}

// ── Navigation ──────────────────────────────────────────────────────────────
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Active section highlight ────────────────────────────────────────────────
function initSectionHighlight() {
  const navLinks = document.querySelectorAll('.nav-links a, .quick-nav a');
  const sections = ['contributions', 'roadmap', 'timeline']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            const match = a.getAttribute('href') === `#${id}`;
            a.style.color = match ? 'var(--text)' : '';
            a.style.background = match ? 'var(--accent-soft)' : '';
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

// ── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  init();
  initNav();
  initSectionHighlight();
  animateCounters();
  observeReveals(document.querySelectorAll('.hero .reveal, .stats-section .reveal, .section-header.reveal, .filter-bar.reveal, .cta-card.reveal'));
});
