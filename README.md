# Open Source Contributions

Personal hub for tracking upstream OSS work across Ansible, Argo CD, NiFi, Vault, Kubernetes, Docker, and Terraform.

**Live site:** [asifad.github.io/opensource-contributions](https://asifad.github.io/opensource-contributions)  
**Portfolio:** [asifad.github.io](https://asifad.github.io)  
**GitHub:** [AsifAd](https://github.com/AsifAd)

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

## Site

The [`docs/`](docs/) folder powers the GitHub Pages dashboard:

- Animated hero with particle network background
- Live contribution cards with PR/issue links
- Filterable technology roadmap
- Contribution timeline
- Links to [portfolio](https://asifad.github.io) and GitHub

**Update site data:** edit [`docs/assets/data/contributions.json`](docs/assets/data/contributions.json)

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
3. Add a row to `docs/assets/data/contributions.json` roadmap
4. Update this README status table

Details: [HOW-TO-ADD-TECH.md](HOW-TO-ADD-TECH.md)
