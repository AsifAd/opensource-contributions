# Argo CD — Backlog

Contributions to [argoproj/argo-cd](https://github.com/argoproj/argo-cd).

**Status:** **Active** — [#27928](https://github.com/argoproj/argo-cd/issues/27928) investigating.

---

## In flight

| Issue | PR | Status | Notes |
|-------|-----|--------|-------|
| [#27928](https://github.com/argoproj/argo-cd/issues/27928) | [#27931](https://github.com/argoproj/argo-cd/pull/27931) | **PR Open** | AppSet UI namespaced namespace → [work/27928.md](work/27928.md) |

---

## Next up (after #27928)

| Priority | Issue | Why | Test tier |
|----------|-------|-----|-----------|
| **1** | [#21895](https://github.com/argoproj/argo-cd/issues/21895) CLI unit test for `admin export/import` | DR coverage; import lane crowded (#22780) | Tier 1 |
| **2** | Docs PR | Filter [documentation label](https://github.com/argoproj/argo-cd/issues?q=is%3Aopen+label%3Adocumentation) | Tier 4 |
| **3** | [#21052](https://github.com/argoproj/argo-cd/issues/21052) CLI filter improvements | 3 open PRs — avoid unless scoped | Tier 1–2 |

---

## Planned (later)

| Issue | Description | Blocker |
|-------|-------------|---------|
| [#27878](https://github.com/argoproj/argo-cd/issues/27878) | AppSet UI “missing” app health inconsistent | PR #27880 open |
| [#24065](https://github.com/argoproj/argo-cd/issues/24065) | `ARGOCD_OPTS` multi `--header` | Go + CLI |
| [#21059](https://github.com/argoproj/argo-cd/issues/21059) | CLI diff desired vs live state | Go + CLI |

---

## Done / tracking

| Issue | PR | Status | Notes |
|-------|-----|--------|-------|
| — | — | — | |

---

## Workflow

1. Comment on issue → repro in `~/oss/argo-cd` (isolated)
2. `make test TEST_MODULE=./ui` (Docker) while developing
3. Open PR from `AsifAd/argo-cd` → `argoproj/argo-cd`

→ [testing.md](testing.md) · [setup.md](setup.md)
