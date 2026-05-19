# Argo CD — Open Source

Contributions to [argoproj/argo-cd](https://github.com/argoproj/argo-cd) (GitOps).

**Status:** Planned  
**GitHub:** [AsifAd](https://github.com/AsifAd)  
**Fork:** *(create when starting)* https://github.com/AsifAd/argo-cd  
**Clone path:** `~/oss/argo-cd` (recommended — isolated from work dirs)

| Doc | What |
|-----|------|
| [setup.md](setup.md) | Fork, clone, Kind, isolated VM option |
| [testing.md](testing.md) | Unit / local / e2e tiers + isolation recipes |
| [backlog.md](backlog.md) | Planned issues (#21895, etc.) |

**Related work notes:** [../../Issues/fileparser-argo-issue/](../../Issues/fileparser-argo-issue/)

---

## Done / in flight

| Issue | PR | Status |
|-------|-----|--------|
| — | — | Not started |

---

## Next up

**[#21895](https://github.com/argoproj/argo-cd/issues/21895)** — unit test for `argocd admin export/import` CLI (good first PR, Tier 1 tests only)

→ [backlog.md](backlog.md)

---

## Isolation

**Do not install Go/Kind on main Mac** unless you want to. Use Multipass VM or Docker-only `make test`.

→ [ISOLATION.md](../ISOLATION.md) · [testing.md#isolated-setup-recipes](testing.md#isolated-setup-recipes)
