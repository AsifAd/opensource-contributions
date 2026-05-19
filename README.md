# Open Source Contributions

Personal hub for tracking upstream OSS work across Ansible, Argo CD, NiFi, Vault, Kubernetes, Docker, and Terraform.

**Live site:** [asifad.github.io/opensource-contributions](https://asifad.github.io/opensource-contributions)  
**Portfolio:** [asifad.github.io](https://asifad.github.io)  
**GitHub:** [AsifAd](https://github.com/AsifAd)

> **Working style:** update markdown notes and [`contributions.json`](docs/assets/data/contributions.json) in the **same commit** as you work — push to `main` and the site goes live in ~20s.  
> Full playbook → **[WORKFLOW.md](WORKFLOW.md)**

---

## What's here

| Area | Description |
|------|-------------|
| [`docs/`](docs/) | GitHub Pages site — animated dashboard of contributions & roadmap |
| [`ansible/`](ansible/) | **Active** — community.general PRs (#12083, #12085) |
| [`argocd/`](argocd/) | Planned — argoproj/argo-cd |
| [`nifi/`](nifi/) | Planned — Apache NiFi upstream |
| [`vault/`](vault/) | Planned — Vault / OpenBao |
| [`kubernetes/`](kubernetes/) | Placeholder |
| [`docker/`](docker/) | Placeholder — community.docker |
| [`terraform/`](terraform/) | Placeholder |
| [`_template/`](_template/) | Copy when adding a new tech stack |

---

## Per-tech layout

Every technology folder follows the same shape:

| File | Purpose |
|------|---------|
| `README.md` | Status, links, done work, quick nav |
| `setup.md` | Fork, clone, isolated dev environment |
| `testing.md` | How to run tests / validate changes |
| `backlog.md` | Planned & upcoming work |
| `work/` | *(optional)* Deep dives per issue/PR |

---

## Status dashboard

| Tech | Status | Open PRs | Next up |
|------|--------|----------|---------|
| **Ansible** | **Active** | [#12083](https://github.com/ansible-collections/community.general/pull/12083), [#12085](https://github.com/ansible-collections/community.general/pull/12085) | Keycloak #11747 |
| **Argo CD** | Planned | — | CLI unit test #21895 |
| **NiFi** | Planned | — | Provenance repo corruption upstream |
| **Vault** | Planned | — | hashi_vault docs or OpenBao |
| **Kubernetes** | Placeholder | — | k8s docs or kubernetes.core |
| **Docker** | Placeholder | — | community.docker #790 |
| **Terraform** | Placeholder | — | TBD |

---

## Site (live dashboard)

The [`docs/`](docs/) folder powers GitHub Pages. **It updates automatically on every push to `main`.**

| You do | Site shows |
|--------|------------|
| Start investigating an issue | *Investigating* badge on new card |
| Branch + tests, no PR yet | *In progress* |
| Open upstream PR | *PR Open*, stats + timeline update |
| Merge PR | *Merged*, timeline entry |

**Edit:** [`docs/assets/data/contributions.json`](docs/assets/data/contributions.json) — schema in [`docs/assets/data/README.md`](docs/assets/data/README.md)  
**How/when to edit:** [WORKFLOW.md](WORKFLOW.md)

Features: dark/light theme, contribution cards, filterable roadmap, timeline, portfolio links.

### E2E tests

**Required before every push** that touches JSON, HTML, CSS, or JS. Run the full suite — all 96 tests, all projects:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

Covers: homepage, theme, navigation, contributions, roadmap filters, timeline, stats, SEO, data integrity, mobile, reduced-motion. See [WORKFLOW.md](WORKFLOW.md#verify-before-you-walk-away-mandatory--miss-nothing) for the complete checklist.

---

## GitHub Pages setup

1. Create repo `opensource-contributions` on GitHub
2. Push this folder
3. **Settings → Pages → Build and deployment → GitHub Actions**
4. Push to `main` — the workflow deploys automatically

Site URL: `https://asifad.github.io/opensource-contributions/`

---

## Isolated environments

All OSS work stays off work/personal tooling. See [ISOLATION.md](ISOLATION.md).

---

## Adding a new tech

1. Copy `_template/` → `<tech-name>/`
2. Fill in README, setup, testing, backlog
3. Add roadmap row to `docs/assets/data/contributions.json`
4. Update this README status table
5. Commit + push → site deploys automatically

Details: [HOW-TO-ADD-TECH.md](HOW-TO-ADD-TECH.md) · live updates: [WORKFLOW.md](WORKFLOW.md)
