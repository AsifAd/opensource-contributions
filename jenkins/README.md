# Jenkins — Open Source

Contributions to [jenkinsci/kubernetes-plugin](https://github.com/jenkinsci/kubernetes-plugin) (Kubernetes agents on Jenkins).

**Status:** **Active** — PR [#2835](https://github.com/jenkinsci/kubernetes-plugin/pull/2835) open (fixes [#2809](https://github.com/jenkinsci/kubernetes-plugin/issues/2809))  
**GitHub:** [AsifAd](https://github.com/AsifAd)  
**Fork:** https://github.com/AsifAd/kubernetes-plugin  
**Clone path:** `~/oss/kubernetes-plugin` (isolated — no work Jenkins, no corp kubeconfig)  
**Branch:** `fix/no-reconnect-after-multi-container-2809`

| Doc | What |
|-----|------|
| [setup.md](setup.md) | Fork, clone, Kind/Helm Jenkins, isolated kubeconfig |
| [testing.md](testing.md) | `mvn verify`, repro multi-container pods, PR test plan |
| [backlog.md](backlog.md) | In-flight issue + later candidates |
| [work/2809.md](work/2809.md) | `-noReconnectAfter` + multi-container zombie pods |

---

## Done / in flight

| Issue | PR | Status |
|-------|-----|--------|
| [#2809](https://github.com/jenkinsci/kubernetes-plugin/issues/2809) | [#2835](https://github.com/jenkinsci/kubernetes-plugin/pull/2835) | **PR Open** — multi-container + orphan pod delete |

---

## Why this stack

Day-job CI uses **Kubernetes agents** with **multi-container** pods (`jnlp` + `docker` + sidecars). Issue #2809 is an upstream bug in agent cleanup — zombie pods waste cluster resources at scale. No competing open PR on this issue (May 2026).

---

## Next up

1. Comment on #2809 → repro on Kind + Helm Jenkins  
2. Branch `fix/no-reconnect-after-multi-container-2809` → `mvn verify` → open PR  

→ [backlog.md](backlog.md) · [work/2809.md](work/2809.md)

---

## Isolation

**Do not** point at work Jenkins (`*.blackline.corp`) or corporate clusters for upstream repro.

→ [../ISOLATION.md](../ISOLATION.md) · [setup.md](setup.md) · [testing.md](testing.md)

---

## Site sync

Update [docs/assets/data/contributions.json](../docs/assets/data/contributions.json) in the **same commit** as this folder. See [WORKFLOW.md](../WORKFLOW.md).
