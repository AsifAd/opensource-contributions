# Argo CD — Backlog

Planned contributions to [argoproj/argo-cd](https://github.com/argoproj/argo-cd).

**Status:** Planned — start after Ansible PRs merge or in isolated VM in parallel.

---

## Next up

| Priority | Issue | Why | Test tier |
|----------|-------|-----|-----------|
| **1** | [#21895](https://github.com/argoproj/argo-cd/issues/21895) CLI unit test for `admin export/import` | Good first issue; no cluster for unit tests | Tier 1 |
| **2** | Docs PR | Filter [documentation label](https://github.com/argoproj/argo-cd/issues?q=is%3Aopen+label%3Adocumentation) | Tier 4 |
| **3** | [#21052](https://github.com/argoproj/argo-cd/issues/21052) CLI filter improvements | Slightly larger CLI work | Tier 1–2 |

---

## Planned (later)

| Issue | Description | Blocker |
|-------|-------------|---------|
| [#24065](https://github.com/argoproj/argo-cd/issues/24065) | `ARGOCD_OPTS` multi `--header` | Go + CLI |
| [#21059](https://github.com/argoproj/argo-cd/issues/21059) | CLI diff desired vs live state | Go + CLI |
| AppSet / fileparser area | From work notes | Repro from internal issue |

---

## Done / tracking

| Issue | PR | Status | Notes |
|-------|-----|--------|-------|
| — | — | — | Update when fork created |

---

## First PR workflow

1. Comment on issue
2. `make test TEST_MODULE=./cmd/argocd/commands/admin` (Docker) or inside VM
3. Implement + re-run tests
4. Open PR from `AsifAd/argo-cd` → `argoproj/argo-cd`

→ [testing.md](testing.md) · [setup.md](setup.md)
