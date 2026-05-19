# Argo CD — Backlog

Contributions to [argoproj/argo-cd](https://github.com/argoproj/argo-cd).

**Status:** **Active** — [#27931](https://github.com/argoproj/argo-cd/pull/27931) and [#27932](https://github.com/argoproj/argo-cd/pull/27932) open.

---

## In flight

| Issue | PR | Status | Notes |
|-------|-----|--------|-------|
| [#27928](https://github.com/argoproj/argo-cd/issues/27928) | [#27931](https://github.com/argoproj/argo-cd/pull/27931) | **PR Open** | AppSet UI namespaced namespace → [work/27928.md](work/27928.md) |
| [#27798](https://github.com/argoproj/argo-cd/issues/27798) | [#27932](https://github.com/argoproj/argo-cd/pull/27932) | **PR Open** | AppSet Refresh button (API + UI) → [work/27798.md](work/27798.md) |

---

## Next up (after #27798)

| Priority | Issue | Why | Test tier |
|----------|-------|-----|-----------|
| **1** | [#27878](https://github.com/argoproj/argo-cd/issues/27878) AppSet UI missing app health | PR #27880 open — review/collab | Tier 1 UI |
| **2** | [#21895](https://github.com/argoproj/argo-cd/issues/21895) CLI unit test for `admin export/import` | DR coverage; import lane crowded | Tier 1 |
| **3** | Docs PR | Filter [documentation label](https://github.com/argoproj/argo-cd/issues?q=is%3Aopen+label%3Adocumentation) | Tier 4 |

---

## Planned (later)

| Issue | Description | Blocker |
|-------|-------------|---------|
| [#26428](https://github.com/argoproj/argo-cd/issues/26428) | Repo-server monorepo ref resolution perf | Heavy repro (510k commits) |
| [#24065](https://github.com/argoproj/argo-cd/issues/24065) | `ARGOCD_OPTS` multi `--header` | 4 open PRs |
| [#21059](https://github.com/argoproj/argo-cd/issues/21059) | CLI diff desired vs live state | Work in progress upstream |

---

## Done / tracking

| Issue | PR | Status | Notes |
|-------|-----|--------|-------|
| — | — | — | |

---

## Workflow

1. Comment on issue → repro in `~/oss/argo-cd` (isolated)
2. `make test TEST_MODULE=./server/applicationset/...` (Docker) while developing
3. Open PR from `AsifAd/argo-cd` → `argoproj/argo-cd`

→ [testing.md](testing.md) · [setup.md](setup.md)
