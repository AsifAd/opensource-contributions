# Working Style — Keep the Site Live as You Work

This repo is **two things at once**: your private engineering notes *and* a public dashboard at [asifad.github.io/opensource-contributions](https://asifad.github.io/opensource-contributions).

**Rule:** update the hub in the **same commit** as your notes — not after the PR merges, not “when you remember.” The site deploys automatically on every push to `main` (~20 seconds).

**Account rule:** all commits, pushes, and upstream PRs use GitHub account **`AsifAd` only**. Verify before every git/gh action. Wrong account → stop and switch (`gh auth switch`).

**Isolation rule (most important):** all upstream tests and repros run in **isolated envs only** (venv, VM, Docker under `~/dev/` or `~/oss/`). **Never install global tools or modify this machine's work/system setup.** See [ISOLATION.md](ISOLATION.md).

---

## Philosophy

| Habit | Why |
|-------|-----|
| **Docs and site move together** | Markdown in `ansible/` (etc.) is the deep dive; `contributions.json` is the public summary. Both change in one push. |
| **Status reflects reality today** | If you're reproducing a bug locally, the site says *Investigating*. When the PR is open, it says *PR Open*. When merged, *Merged*. |
| **Commit often, push often** | Each push to `main` → GitHub Actions deploys Pages. Your portfolio audience sees progress without you doing anything extra. |
| **One issue = one trail** | Folder docs + optional `work/` deep dive + JSON entry + timeline event. Same shape every time. |

---

## What deploys automatically

```
git push origin main
        │
        ├── .github/workflows/pages.yml  →  GitHub Pages (live site)
        └── .github/workflows/e2e.yml    →  Playwright tests (CI gate)
```

No manual deploy. No separate “publish” step. Edit → commit → push → live.

---

## GitHub identity (strict)

**Only `AsifAd` may commit, push, or open PRs** for OSS hub and upstream work.

Before any commit, push, or `gh pr create`:

```bash
gh api user -q .login   # must output: AsifAd
```

If the result is anything else — **STOP**. Do not commit. Do not push. Do not open a PR.

```text
❌ Wrong GitHub account: <current> — required: AsifAd
   Run: gh auth switch
   Verify: gh api user -q .login
```

Re-check identity again immediately before push, even if you checked at the start of the session.

Upstream forks must be under `AsifAd/` (e.g. `AsifAd/community.general`).

---

## Status lifecycle

Use these **contribution** statuses in `docs/assets/data/contributions.json`:

| Status | `statusLabel` example | When to set |
|--------|----------------------|-------------|
| `investigating` | Investigating | Commented on issue, reproducing locally, no branch yet |
| `in-progress` | In progress | Branch exists, coding/testing, PR not opened |
| `open` | PR Open | PR opened upstream, awaiting review |
| `merged` | Merged | Upstream merged your PR |
| `closed` | Closed | PR closed without merge (note why in summary) |

**Roadmap** stack statuses (`roadmap[].status`):

| Status | When |
|--------|------|
| `placeholder` | Stack listed but no concrete issue picked |
| `planned` | Issue chosen, setup docs filled, not coding yet |
| `active` | At least one contribution in flight on this stack |

When a stack becomes **active**, set its roadmap `openPRs` count and bump `stats.activeProjects` if it's your only active stack.

---

## Checklist by stage

### 1 — Starting work (issue claimed, reproducing)

**Do in one commit:**

- [ ] Comment on upstream issue (“reproducing locally…”)
- [ ] `<tech>/backlog.md` — move item to “in flight” table
- [ ] `<tech>/README.md` — add row: Issue, branch name (or “TBD”), status *Investigating*
- [ ] Optional: `<tech>/work/<issue>.md` — repro notes, root cause sketch
- [ ] `contributions.json` — add contribution object:

```json
{
  "id": "keycloak-11747",
  "tech": "ansible",
  "techLabel": "Ansible",
  "module": "keycloak_user",
  "title": "email_verified idempotency + check mode",
  "issue": 11747,
  "pr": null,
  "branch": "fix/keycloak-user-email-verified-11747",
  "status": "investigating",
  "statusLabel": "Investigating",
  "repo": "ansible-collections/community.general",
  "fork": "AsifAd/community.general",
  "summary": "Reproducing with Keycloak in Docker. email_verified resets on second run.",
  "highlights": ["Repro in progress"],
  "deepDive": "ansible/work/keycloak-11747.md",
  "links": {
    "issue": "https://github.com/ansible-collections/community.general/issues/11747",
    "pr": null
  }
}
```

- [ ] `contributions.json` → set roadmap entry for that tech to `"status": "active"`
- [ ] Root `README.md` — status dashboard row
- [ ] Commit + push

```bash
git add ansible/ docs/ README.md
git commit -m "Start Keycloak #11747 — investigating email_verified idempotency"
git push origin main
```

Site updates within ~20s.

---

### 2 — Coding (branch + tests, no PR yet)

- [ ] Update `work/<issue>.md` with root cause, files touched, test plan
- [ ] `contributions.json` — change `"status": "in-progress"`, `"statusLabel": "In progress"`
- [ ] Update `highlights` array as you land tests
- [ ] Commit + push (even WIP — shows you're building in public)

---

### 3 — PR opened upstream

- [ ] Open PR on upstream fork
- [ ] `<tech>/README.md` + `backlog.md` — add PR link
- [ ] `contributions.json`:
  - `"status": "open"`, `"statusLabel": "PR Open"`
  - `"pr": 12099`
  - `"links.pr": "https://github.com/.../pull/12099"`
  - bump `stats.openPRs`
- [ ] `timeline[]` — prepend new event (date, title, link to PR)
- [ ] Commit + push

---

### 4 — Review feedback / new commits on PR

- [ ] Update `work/<issue>.md` if approach changed
- [ ] `contributions.json` — refresh `summary` or `highlights` if scope changed (optional)
- [ ] Push upstream PR commits separately; **hub repo** push only if notes/site need updating

---

### 5 — PR merged

- [ ] `<tech>/README.md` — move row to “Done”, note merge date
- [ ] `backlog.md` — remove from in-flight, pick next up
- [ ] `contributions.json`:
  - `"status": "merged"`, `"statusLabel": "Merged"`
  - decrement `stats.openPRs` (remove from active count or move to archived section — see below)
- [ ] `timeline[]` — add “Merged: …” entry
- [ ] If no other open PRs on that stack, consider setting roadmap back to `planned` or keep `active` if next issue started
- [ ] Commit + push

**Merged contributions:** keep the card on the site with `merged` status for visibility, or remove from `contributions[]` and leave only in `timeline[]` — your choice. Keeping merged cards builds a track record.

---

### 6 — Activating a new technology stack

See [HOW-TO-ADD-TECH.md](HOW-TO-ADD-TECH.md). Additionally:

- [ ] Add roadmap object in `contributions.json`
- [ ] Set `"status": "planned"` → `"active"` when you start investigating
- [ ] Commit + push with the new folder

---

## Files to touch (quick reference)

| What changed | Files |
|--------------|-------|
| Any OSS work | `<tech>/backlog.md`, `<tech>/README.md` |
| Deep dive | `<tech>/work/<issue>.md` |
| **Public site** | `docs/assets/data/contributions.json` |
| Hub overview | Root `README.md` |
| New stack | Copy `_template/`, JSON roadmap row |

**Single source for the live dashboard:** [`docs/assets/data/contributions.json`](docs/assets/data/contributions.json)  
Schema reference: [`docs/assets/data/README.md`](docs/assets/data/README.md)

---

## Commit message style (hub repo)

Keep hub commits separate from upstream PR commits. Examples:

```
Start nmcli #11762 — investigating blank ifname
WIP Keycloak #11747 — Docker repro + failing test
Open PR #12100 — keycloak_user email_verified fix
Update site — merge ini_file #12083, Keycloak next up
```

Funny is fine. Clear is better.

---

## Verify before you walk away (mandatory — miss nothing)

Testing is **not optional**. Do not push until every applicable section below is green.

### Upstream code (when coding or opening PR)

**Isolated env only** — read [ISOLATION.md](ISOLATION.md) and `<tech>/setup.md` first. Never run ansible-test, integration repro, or runtime validation on system Python, work kube contexts, or global installs on this Mac.

Follow `<tech>/testing.md`. Run **all** relevant tests inside the isolated env:

- Repro: fails before fix, passes after
- New regression tests for the exact bug + every edge case in the issue
- Idempotency, check mode, diff mode (when the module supports them)
- Full module unit test file — not just the new test
- Manual repro on real runtime when the issue requires it (document commands in `work/<issue>.md`)

**No upstream PR until upstream tests pass.**

### Hub site — full E2E (when JSON, HTML, CSS, or JS changed)

```bash
cd OpenSource
npm run test:e2e    # all 96 tests — desktop + mobile + reduced-motion
```

Do not run a subset. Do not skip for "small JSON edits." All spec files must pass:

`homepage` · `theme` · `navigation` · `contributions` · `roadmap` · `timeline` · `stats` · `seo` · `data` · `mobile` · `reduced-motion`

### JSON sanity (every `contributions.json` edit)

- `stats.openPRs` === count of `status: "open"` contributions
- Roadmap `openPRs` per stack match reality
- `pr` / `links.pr` null until PR exists; set when opened
- `meta.updated` bumped to today
- Timeline entries correct (type, link, date)
- Hero status line matches JSON after reload

### Manual smoke (after E2E green)

```bash
npm run preview   # → http://localhost:4173
```

Hard refresh. Toggle dark/light. Click all roadmap filters. Verify changed cards, links, and stats. Check mobile hamburger menu.

### After push

1. [Actions → E2E Tests](https://github.com/AsifAd/opensource-contributions/actions) — green
2. [Actions → Deploy GitHub Pages](https://github.com/AsifAd/opensource-contributions/actions) — green
3. [Live site](https://asifad.github.io/opensource-contributions/) — hard refresh, spot-check

**If CI fails after push, fix immediately. Do not leave red.**

---

## Parallel work example (typical week)

| Day | Upstream work | Hub push (same day) |
|-----|---------------|---------------------|
| Mon | Comment on #11747, Docker Keycloak | `investigating` entry + work doc |
| Tue | Branch + unit test failing | `in-progress` + highlights |
| Wed | Open PR #12100 | `open` + timeline + openPRs: 3 |
| Thu | Address review comments | work doc update only |
| Fri | PR merges | `merged` + timeline + pick next in backlog |

Your [portfolio](https://asifad.github.io) links here — keeping this repo current is keeping your public OSS story current.

**Cursor:** type `/oss-flow` in chat to run the live-sync workflow (see `~/.cursor/commands/oss-flow.md`).

---

## Related

- [HOW-TO-ADD-TECH.md](HOW-TO-ADD-TECH.md) — new stack folder shape
- [ISOLATION.md](ISOLATION.md) — dev environments off main machine
- [ansible/workflow.md](ansible/workflow.md) — upstream PR process for community.general
- [docs/assets/data/README.md](docs/assets/data/README.md) — JSON field reference
