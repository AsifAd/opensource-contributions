# How to Add a New Technology

When you start contributing to a new stack (e.g. Terraform, Prometheus, Helm), add a folder under `OpenSource/` using this pattern.

---

## 1. Create the folder

```bash
cd OpenSource
cp -r _template my-new-tech    # rename to lowercase: docker, terraform, prometheus, etc.
```

Or manually:

```
OpenSource/my-new-tech/
├── README.md
├── setup.md
├── testing.md
└── backlog.md
```

Optional: `work/` subfolder for per-issue write-ups (like Ansible `work/ini-file-11919.md`).

---

## 2. Fill in each file

### README.md
- One-line description
- Status: `Active` | `Planned` | `Placeholder`
- Upstream repo URL + your fork
- Links to setup, testing, backlog
- Table of **done work** (PRs merged/open)
- Related work notes in this repo (e.g. `../../Issues/...`)

### setup.md
- Prerequisites (language version, tools)
- Fork + clone path (use `~/oss/<tech>/` or `~/dev/`)
- **Isolation** — how to avoid touching main machine (link [ISOLATION.md](../ISOLATION.md))
- One-time install commands

### testing.md
- Unit / integration / manual test commands
- What CI runs on PRs
- Minimal test plan for PR description
- Isolated test recipes if non-obvious

### backlog.md
- **Next up** (single recommended item)
- **Planned** (table: issue, why, blocker)
- **Done** (tracking table)
- **Follow-ups** from your own PRs

---

## 3. Update the hub (site + docs — same commit)

Per [WORKFLOW.md](../WORKFLOW.md), update **in parallel**:

| File | Action |
|------|--------|
| [README.md](README.md) | Add row to **Status dashboard** + folder tree |
| [docs/assets/data/contributions.json](../docs/assets/data/contributions.json) | Add `roadmap[]` entry (`placeholder` → `planned` when issue picked) |
| `<tech>/README.md` | Set status Active/Planned when you start |

When you begin work on an issue, add a `contributions[]` entry with `"status": "investigating"` and push — the [live site](https://asifad.github.io/opensource-contributions/) updates in ~20s.

JSON schema: [docs/assets/data/README.md](../docs/assets/data/README.md)

---

## 4. Naming conventions

| Item | Convention |
|------|------------|
| Folder name | lowercase, no spaces: `argocd`, `kubernetes`, `hashicorp-vault` |
| Work files | `work/<short-name>-<issue-number>.md` |
| Branches (upstream) | follow each project's rules |

---

## Template files

See [_template/](_template/) for copy-paste starters.
