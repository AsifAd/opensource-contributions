# contributions.json — Site Data Reference

This file powers the live dashboard. Edit it **in parallel** with your markdown docs whenever status changes.

**Path:** `docs/assets/data/contributions.json`  
**Deploy:** auto on push to `main` via GitHub Pages workflow  
**Working style:** [WORKFLOW.md](../../../WORKFLOW.md)

---

## Top-level shape

```json
{
  "meta": { ... },
  "stats": { ... },
  "contributions": [ ... ],
  "roadmap": [ ... ],
  "timeline": [ ... ]
}
```

---

## `meta`

| Field | Purpose |
|-------|---------|
| `name` | Display name |
| `github` | GitHub username |
| `portfolio` | Portfolio URL |
| `updated` | ISO date (`YYYY-MM-DD`) — bump on every site-affecting push |

---

## `stats`

Displayed in hero + stat cards. Keep in sync with reality:

| Field | Meaning |
|-------|---------|
| `activeProjects` | Count of roadmap stacks with `"status": "active"` |
| `openPRs` | Count of contributions with `"status": "open"` |
| `plannedStacks` | Optional; not shown if omitted |
| `unitTests` | Optional highlight stat (e.g. nmcli test count) |

---

## `contributions[]`

One object per in-flight or recently merged item.

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | kebab-case slug, e.g. `ini-file-11919` |
| `tech` | yes | folder name: `ansible`, `argocd`, … |
| `techLabel` | yes | display label |
| `module` | yes | upstream module/binary name |
| `title` | yes | short headline |
| `issue` | yes | upstream issue number |
| `pr` | no | `null` until PR opened |
| `branch` | yes | your working branch name |
| `status` | yes | `investigating` \| `in-progress` \| `open` \| `merged` \| `closed` |
| `statusLabel` | yes | human label shown on card |
| `repo` | yes | upstream `org/repo` |
| `fork` | yes | your fork |
| `summary` | yes | 1–2 sentences for the card |
| `highlights` | yes | string array, 2–4 tags |
| `deepDive` | yes | path to markdown in this repo |
| `links.issue` | yes | full GitHub issue URL |
| `links.pr` | no | `null` until PR exists |

---

## `roadmap[]`

One object per technology stack.

| Field | Notes |
|-------|-------|
| `tech` | folder name (used as `data-testid`) |
| `label` | display name |
| `status` | `placeholder` \| `planned` \| `active` |
| `icon` | single emoji |
| `color` | hex accent for card bar |
| `nextUp` | one-line next action |
| `fork` | fork URL or `null` |
| `docs` | path to `<tech>/README.md` |
| `openPRs` | count of open PRs on this stack |

---

## `timeline[]`

Newest-first recommended. Prepend when something happens.

| Field | Notes |
|-------|-------|
| `date` | `YYYY-MM` or `Next` |
| `title` | short event name |
| `description` | one sentence |
| `type` | `pr` \| `milestone` \| `planned` |
| `link` | URL or `null` |

---

## Status → site behaviour

| `contributions[].status` | Badge colour | Counted in `stats.openPRs` |
|--------------------------|--------------|----------------------------|
| `investigating` | amber | no |
| `in-progress` | amber | no |
| `open` | green | yes |
| `merged` | muted green | no |
| `closed` | muted | no |

Hero line is computed from JSON: open PR count + first active roadmap stack.

---

## Minimal edit examples

**Start investigating:**
```json
"status": "investigating",
"statusLabel": "Investigating",
"pr": null,
"links": { "issue": "...", "pr": null }
```

**PR opened:**
```json
"status": "open",
"statusLabel": "PR Open",
"pr": 12100,
"links": { "issue": "...", "pr": "https://github.com/.../pull/12100" }
```
Also: `stats.openPRs++`, add `timeline` entry, bump `meta.updated`.

**Merged:**
```json
"status": "merged",
"statusLabel": "Merged"
```
Also: `stats.openPRs--`, add `timeline` entry, bump `meta.updated`.
