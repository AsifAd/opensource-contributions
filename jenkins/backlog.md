# Jenkins — Backlog

[jenkinsci/kubernetes-plugin](https://github.com/jenkinsci/kubernetes-plugin). Updated May 2026.

**Solo track:** [#2809](https://github.com/jenkinsci/kubernetes-plugin/issues/2809) — no open competing PR.

---

## In flight

| Issue | PR | Branch | Status | Tests |
|-------|-----|--------|--------|-------|
| [#2809](https://github.com/jenkinsci/kubernetes-plugin/issues/2809) `-noReconnectAfter` ineffective with multiple containers | — | `fix/no-reconnect-after-multi-container-2809` | **In progress** | `PodUtils` + `_terminate` fix; `mvn verify` + Kind repro |

**Fork:** https://github.com/AsifAd/kubernetes-plugin  
**Deep dive:** [work/2809.md](work/2809.md)

### Checklist

- [x] Comment on #2809 (reproducing on isolated Kind + Helm Jenkins, planning PR solo)
- [x] Fork + clone to `~/oss/kubernetes-plugin` — branch `fix/no-reconnect-after-multi-container-2809`
- [ ] Repro: jnlp exits, sidecar keeps pod Running (Kind — needs isolated Java/Maven)
- [x] Implement fix + unit tests (`PodUtils.isAgentContainerTerminated`, `_terminate` override)
- [ ] `mvn verify` green
- [ ] Open PR → update `contributions.json` (`status`: `open`, `pr`: number)

---

## #2809 — summary

| | |
|--|--|
| **Problem** | PR #1553 added `--noReconnectAfter` for single-container agents. With **sidecars** (docker, sleep, etc.), jnlp exits but pod stays **Running** → zombie agents. |
| **Impact** | Wasted CPU/memory on every build fleet using multi-container pod templates. |
| **Fix direction** | Tear down whole pod (or stop sidecars) when agent container ends — liveness probe, coordinated termination, or pod lifecycle hook. |
| **Repro** | [testing.md — Tier 2](testing.md#tier-2--manual-repro-2809) |

---

## Later (after #2809)

Pick only if #2809 merges or you need a parallel track. Several already have open PRs — avoid duplicates.

| Priority | Issue | Why | Blocker |
|----------|-------|-----|---------|
| 2 | [#2772](https://github.com/jenkinsci/kubernetes-plugin/issues/2772) Reaper + ImagePullBackOff | Matches timeout loops in CI logs | PR [#2785](https://github.com/jenkinsci/kubernetes-plugin/pull/2785) open |
| 3 | [#2820](https://github.com/jenkinsci/kubernetes-plugin/issues/2820) Informer leak | Thread/log flood with ephemeral NS | PR [#2821](https://github.com/jenkinsci/kubernetes-plugin/pull/2821) open |
| 4 | [#2767](https://github.com/jenkinsci/kubernetes-plugin/issues/2767) Stuck pod / GC | Major JIRA import | Needs solid repro package for maintainers |

---

## Other Jenkins repos (future)

| Repo | When |
|------|------|
| `jenkinsci/workflow-cps` | Pipeline/Groovy bugs after first kubernetes-plugin merge |
| `jenkinsci/git-plugin` | If focusing on SCM/rate-limit behaviour |
| `jenkinsci/configuration-as-code-plugin` | Docs + YAML-only fixes |

---

## Tracking

| Contribution | Status | PR | Notes |
|-------------|--------|-----|-------|
| #2809 multi-container `-noReconnectAfter` | Investigating | — | Solo — May 2026 |
