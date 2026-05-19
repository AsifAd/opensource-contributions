# Argo CD — Open Source

Contributions to [argoproj/argo-cd](https://github.com/argoproj/argo-cd) (GitOps).

**Status:** **Active** — PRs [#27931](https://github.com/argoproj/argo-cd/pull/27931), [#27932](https://github.com/argoproj/argo-cd/pull/27932) open  
**GitHub:** [AsifAd](https://github.com/AsifAd)  
**Fork:** https://github.com/AsifAd/argo-cd  
**Clone path:** `~/oss/argo-cd` (isolated from work dirs)

| Doc | What |
|-----|------|
| [setup.md](setup.md) | Fork, clone, Kind, isolated VM option |
| [testing.md](testing.md) | Unit / local / e2e tiers + isolation recipes |
| [backlog.md](backlog.md) | Planned & in-flight issues |
| [work/27928.md](work/27928.md) | AppSet UI namespaced namespace — PR #27931 |
| [work/27798.md](work/27798.md) | AppSet Refresh — PR #27932 CI green |

**Related work notes:** [../../Issues/fileparser-argo-issue/](../../Issues/fileparser-argo-issue/) (internal infra; not upstream)

---

## Done / in flight

| Issue | PR | Status |
|-------|-----|--------|
| [#27928](https://github.com/argoproj/argo-cd/issues/27928) | [#27931](https://github.com/argoproj/argo-cd/pull/27931) | **PR Open** — AppSet UI outside default namespace |
| [#27798](https://github.com/argoproj/argo-cd/issues/27798) | [#27932](https://github.com/argoproj/argo-cd/pull/27932) | **PR Open** — AppSet Refresh (CI green after mixed-list fix) |

---

## Next up (backlog)

After #27798: [#27878](https://github.com/argoproj/argo-cd/issues/27878) (AppSet health UI), [#21895](https://github.com/argoproj/argo-cd/issues/21895) (admin export/import tests).

→ [backlog.md](backlog.md)

---

## Isolation

**Do not install Go/Kind on main Mac** unless you want to. Use Multipass VM or Docker-only `make test`.

→ [ISOLATION.md](../ISOLATION.md) · [testing.md#isolated-setup-recipes](testing.md#isolated-setup-recipes)
