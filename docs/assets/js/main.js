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
function runBootSequence() {
  const loader = document.getElementById('page-loader');
  const bootText = document.getElementById('boot-text');
  if (!loader || !bootText) return;

  const lines = [
    '> Booting system... [OK]',
    '> Fetching upstream PRs... [OK]',
    '> Resolving dependencies... [OK]',
    '> Systems nominal.'
  ];
  
  let i = 0;
  function showNextLine() {
    if (i < lines.length) {
      const line = document.createElement('div');
      line.textContent = lines[i];
      bootText.appendChild(line);
      i++;
      setTimeout(showNextLine, 120 + Math.random() * 150);
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 400);
    }
  }
  showNextLine();
}

window.addEventListener('load', runBootSequence);

// ── Data ────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('assets/data/contributions.json');
    const data = await res.json();
    renderContributions(data.contributions);
    renderRoadmap(data.roadmap);
    updateStats(data.stats, data.roadmap);
    updateMeta(data.meta, data.stats, data.contributions, data.roadmap);
    initCmdPalette(buildOssSearchIndex(data));
  } catch (err) {
    console.error('Failed to load contributions data:', err);
  }
}

function updateStats(stats, roadmap = []) {
  const cards = document.querySelectorAll('.stat-card .stat-value[data-count]');
  if (!cards.length) return;

  const values = [
    stats.activeProjects ?? roadmap.filter((r) => r.status === 'active').length,
    stats.openPRs ?? 0,
    roadmap.length,
    stats.unitTests ?? 0,
  ];

  cards.forEach((el, i) => {
    if (values[i] !== undefined) {
      el.dataset.count = String(values[i]);
    }
  });
}

function updateMeta(meta, stats, contributions = [], roadmap = []) {
  const heroStatus = document.getElementById('hero-status');
  if (heroStatus) {
    const openPRs = stats.openPRs ?? contributions.filter(c => c.status === 'open').length;
    const inProgress = contributions.filter(c =>
      c.status === 'investigating' || c.status === 'in-progress'
    ).length;
    const activeStack = roadmap.find(r => r.status === 'active');

    const parts = [];
    if (openPRs > 0) parts.push(`${openPRs} open PR${openPRs !== 1 ? 's' : ''}`);
    if (inProgress > 0) parts.push(`${inProgress} in progress`);
    if (activeStack) parts.push(`${activeStack.label} active`);
    heroStatus.textContent = parts.length ? parts.join(' · ') : 'OSS tracker — building in public';
  }
  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated && meta.updated) {
    const d = new Date(meta.updated);
    lastUpdated.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}

function getStatusIcon(status) {
  if (status === 'merged') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-merge"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="21"/></svg>`;
}

// ── Contributions ───────────────────────────────────────────────────────────
function renderContributions(contributions) {
  const grid = document.getElementById('contributions-grid');
  if (!grid) return;

  grid.innerHTML = contributions.map((c, i) => `
    <article class="contrib-card reveal" data-testid="contrib-${c.id}" data-delay="${i * 80}">
      <div class="contrib-header">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="contrib-icon status-${c.status}">${getStatusIcon(c.status)}</span>
          <span class="contrib-tech">${c.techLabel} · ${c.repo.split('/').pop()}</span>
        </div>
        <span class="contrib-status ${c.status}">${c.statusLabel}</span>
      </div>
      <h3 class="contrib-title">${c.title}</h3>
      <div class="contrib-module">${c.module}()</div>
      <p class="contrib-summary">${c.summary}</p>
      <div class="contrib-highlights">
        ${c.highlights.map(h => `<span class="contrib-tag">${h}</span>`).join('')}
      </div>
      <div class="contrib-links">
        ${c.links.pr && c.pr ? `<a href="${c.links.pr}" target="_blank" rel="noopener" class="contrib-link">PR #${c.pr}</a>` : ''}
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
    <article id="roadmap-${r.tech}" class="roadmap-card reveal" data-testid="roadmap-${r.tech}" data-delay="${i * 60}" data-status="${r.status}">
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
  const sections = ['contributions', 'roadmap']
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
  init().then(() => animateCounters());
  initNav();
  initSectionHighlight();
  observeReveals(document.querySelectorAll('.hero .reveal, .stats-section .reveal, .section-header.reveal, .filter-bar.reveal, .cta-card.reveal'));
  initSpotlight();
});

function initSpotlight() {
  document.querySelectorAll('.contrib-card, .roadmap-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function buildOssSearchIndex(data) {
  const items = [];

  const add = (entry) => {
    const text = [entry.title, entry.subtitle, entry.group, ...(entry.keywords || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    items.push({ ...entry, searchText: text });
  };

  add({
    id: 'page-contributions',
    title: 'Active contributions',
    subtitle: 'In-flight upstream PRs',
    group: 'Pages',
    keywords: ['contributions', 'prs', 'open', 'merged'],
    action: 'nav',
    target: '#contributions',
  });
  add({
    id: 'page-roadmap',
    title: 'Technology roadmap',
    subtitle: 'Stacks, status, and docs',
    group: 'Pages',
    keywords: ['roadmap', 'stacks', 'ansible', 'argocd', 'planned'],
    action: 'nav',
    target: '#roadmap',
  });

  (data.contributions || []).forEach((c) => {
    add({
      id: `contrib-${c.id}`,
      title: c.title,
      subtitle: `${c.statusLabel} · ${c.techLabel} · ${c.module}`,
      group: 'Contributions',
      keywords: [c.title, c.module, c.tech, c.techLabel, c.status, c.statusLabel, c.repo, c.summary, ...(c.highlights || [])],
      action: 'nav',
      target: '#contributions',
    });
    if (c.links?.pr) {
      add({
        id: `contrib-pr-${c.id}`,
        title: `PR #${c.pr}`,
        subtitle: c.title,
        group: 'Pull requests',
        keywords: [`pr ${c.pr}`, c.repo, c.module],
        action: 'external',
        url: c.links.pr,
      });
    }
    if (c.links?.issue) {
      add({
        id: `contrib-issue-${c.id}`,
        title: `Issue #${c.issue}`,
        subtitle: c.title,
        group: 'Issues',
        keywords: [`issue ${c.issue}`, c.repo],
        action: 'external',
        url: c.links.issue,
      });
    }
  });

  (data.roadmap || []).forEach((r) => {
    add({
      id: `roadmap-${r.tech}`,
      title: r.label,
      subtitle: `${r.status} · ${r.nextUp}`,
      group: 'Roadmap',
      keywords: [r.tech, r.label, r.status, r.nextUp, 'roadmap'],
      action: 'nav',
      target: `#roadmap-${r.tech}`,
    });
  });

  add({ id: 'action-theme', title: 'Toggle light / dark theme', group: 'Actions', keywords: ['theme', 'dark', 'light'], action: 'theme' });
  add({ id: 'link-portfolio', title: 'Open portfolio', subtitle: data.meta?.portfolio, group: 'Links', keywords: ['portfolio', 'asif'], action: 'external', url: data.meta?.portfolio || 'https://asifad.github.io' });
  add({ id: 'link-github', title: 'GitHub profile', group: 'Links', keywords: ['github', 'asifad'], action: 'external', url: `https://github.com/${data.meta?.github || 'AsifAd'}` });
  add({ id: 'link-repo', title: 'View source repository', group: 'Links', keywords: ['source', 'repo'], action: 'external', url: 'https://github.com/AsifAd/opensource-contributions' });

  return items;
}

function renderCmdResults(container, items, footerEl) {
  const groups = new Map();
  items.forEach((item) => {
    const list = groups.get(item.group) || [];
    list.push(item);
    groups.set(item.group, list);
  });

  container.innerHTML = [...groups.entries()]
    .map(
      ([group, entries]) => `
    <div class="cmd-group">
        <div class="spotlight-group-label">${group}</div>
      ${entries
        .map(
          (item) => `
        <button type="button" class="cmd-item cmd-spotlight-item" role="option"
          data-id="${item.id}"
          data-action="${item.action}"
          ${item.target ? `data-target="${item.target}"` : ''}
          ${item.url ? `data-url="${item.url}"` : ''}
          data-search-text="${item.searchText.replace(/"/g, '&quot;')}">
          <span class="cmd-item-icon" aria-hidden="true">◈</span>
          <span class="cmd-item-text">
            <span class="cmd-item-title">${item.title}</span>
            ${item.subtitle ? `<span class="cmd-item-sub">${item.subtitle}</span>` : ''}
          </span>
        </button>`,
        )
        .join('')}
    </div>`,
    )
    .join('');

  if (footerEl) {
    footerEl.innerHTML = `
      <span>${items.length} items</span>
      <div class="spotlight-shortcuts">
        <span class="spotlight-kbd">↑</span>
        <span class="spotlight-kbd">↓</span>
        <span>navigate</span>
        <span class="spotlight-kbd">↵</span>
        <span>open</span>
        <span class="spotlight-kbd">esc</span>
      </div>`;
  }
}

function initCmdPalette(searchIndex) {
  const root = document.getElementById('cmd-root');
  const backdrop = document.getElementById('cmd-backdrop');
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');
  const empty = document.getElementById('cmd-empty');
  const footer = document.getElementById('cmd-footer');
  let items = [];
  let selectedIndex = 0;

  if (!root || !palette || !results) return;

  renderCmdResults(results, searchIndex, footer);

  function getItemNodes() {
    return Array.from(results.querySelectorAll('.cmd-spotlight-item'));
  }

  function runItem(item) {
    const action = item.dataset.action;
    if (action === 'nav') {
      const target = document.querySelector(item.dataset.target);
      if (target) {
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - (navHeight + 24);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else if (action === 'theme') {
      document.getElementById('theme-toggle')?.click();
    } else if (action === 'external' && item.dataset.url) {
      window.open(item.dataset.url, '_blank', 'noopener,noreferrer');
    }
    toggle();
  }

  function toggle() {
    const isHidden = root.classList.contains('hidden');
    if (isHidden) {
      root.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => root.classList.add('is-open'));
      input.focus();
      input.value = '';
      filterItems('');
    } else {
      root.classList.remove('is-open');
      root.classList.add('hidden');
      document.body.style.overflow = '';
      input.blur();
    }
  }

  function filterItems(query) {
    const q = query.trim().toLowerCase();
    items = getItemNodes();
    let visibleCount = 0;
    items.forEach((item) => {
      const match = !q || item.dataset.searchText.includes(q);
      item.style.display = match ? 'flex' : 'none';
      item.classList.remove('selected');
      if (match) visibleCount++;
    });
    empty?.classList.toggle('hidden', visibleCount > 0);
    const visibleItems = items.filter((i) => i.style.display !== 'none');
    if (visibleItems.length > 0) {
      selectedIndex = 0;
      visibleItems[0].classList.add('selected');
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape' && !root.classList.contains('hidden')) toggle();

    if (!root.classList.contains('hidden')) {
      items = getItemNodes().filter((i) => i.style.display !== 'none');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((i) => i.classList.remove('selected'));
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((i) => i.classList.remove('selected'));
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) runItem(items[selectedIndex]);
      }
    }
  });

  input.addEventListener('input', (e) => filterItems(e.target.value));

  results.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-spotlight-item');
    if (item) runItem(item);
  });

  results.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.cmd-spotlight-item');
    if (!item || item.style.display === 'none') return;
    getItemNodes().forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
    selectedIndex = items.filter((i) => i.style.display !== 'none').indexOf(item);
  });

  backdrop.addEventListener('click', toggle);

  document.querySelectorAll('[data-cmd-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (root.classList.contains('hidden')) toggle();
      else input.focus();
    });
  });
}
