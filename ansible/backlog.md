# Ansible — Backlog

community.general and related Ansible collection work. Updated May 2026.

Having merged PRs makes subsequent reviews faster — aim to get one or both of the open PRs merged before starting the next major item.

---

## My Contributions (in flight)

| Issue | PR | Branch | Status | Tests |
|-------|-----|--------|--------|-------|
| [#11919](https://github.com/ansible-collections/community.general/issues/11919) ini_file comment deletion | [#12083](https://github.com/ansible-collections/community.general/pull/12083) | `fix/ini-file-comment-deletion-11919` | PR open | ini_file unit tests |
| [#11588](https://github.com/ansible-collections/community.general/issues/11588) nmcli bond ARP check/diff | [#12085](https://github.com/ansible-collections/community.general/pull/12085) | `fix/nmcli-bond-arp-diff-11588` | PR open | 163 nmcli unit tests pass |

**Fork:** https://github.com/AsifAd/community.general  
**GitHub account used for commits/PRs:** [AsifAd](https://github.com/AsifAd)

---

## Next up — review later

**Pick when your open PRs merge (or while waiting on review).** Full write-up below; skim this table first.

### #1 recommended big thing — Keycloak

| | |
|--|--|
| **Issue** | [#11747](https://github.com/ansible-collections/community.general/issues/11747) — `keycloak_user`: `email_verified` not idempotent + check mode broken |
| **Follow-up** | [#11886](https://github.com/ansible-collections/community.general/issues/11886) — `federated_identities` wrong API shape (same module, second PR) |
| **Why big** | Identity/SSO bugs affect every playbook run; check mode lying is a CI trust issue |
| **What you need** | Keycloak in Docker (~1–2 hrs setup) |
| **Module** | `plugins/modules/keycloak_user.py` |
| **Same workflow as** | ini_file + nmcli PRs (Python, unit tests, changelog fragment) |

**Quick start when ready:**

```bash
# Comment on #11747 first: "Reproducing with Keycloak in Docker, planning a PR"

docker run -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev

cd ~/dev/ansible_collections/community/general
git fetch upstream && git checkout main && git pull upstream main
git checkout -b fix/keycloak-user-email-verified-11747
```

**Repro sketch:** Create user with verified email → run playbook again without setting `email_verified` → flag should stay, module should report `changed: false`. Today it resets and/or applies changes in `--check`.

---

### #2 fast big thing — nmcli (same module as #12085)

| | |
|--|--|
| **Issue** | [#11762](https://github.com/ansible-collections/community.general/issues/11762) — allow blank `ifname` for MAC-based interface assignment |
| **Why big** | Real feature for hardware with unknown interface names; strong follow-on to your nmcli work |
| **What you need** | Mostly unit tests (mock `nmcli`); optional Linux + NM for manual verify |
| **Module** | `plugins/modules/nmcli.py` (you already know this file) |

**Use when:** You want the next PR fast without standing up Keycloak.

---

### Decision guide

| If you… | Start with |
|---------|------------|
| Can run Docker Keycloak | **#11747** (+ #11886 after) |
| Want zero new infra | **#11762** |
| Work on RHEL fleets daily | [#11426](https://github.com/ansible-collections/community.general/issues/11426) rhsm_repository |
| Have FreeBSD | [#11907](https://github.com/ansible-collections/community.general/issues/11907) pkgng |

**Beyond community.general:** see [other-collections.md](other-collections.md). Non-Ansible stacks: [../nifi/](../nifi/), [../argocd/](../argocd/), [../vault/](../vault/).

---

## Still Needs Fixing

Things that are **not done yet** — either follow-ups from our work, known gaps, or open upstream issues worth picking up.

### Follow-ups from #11588 (nmcli) — not in PR #12085

These were identified during review but are **out of scope** for the current PR. Good next PRs if you stay in the nmcli module:

| Item | Why it matters | Effort |
|------|----------------|--------|
| Multiple `arp_ip_target` values (comma-separated in `bond.options`) | NM supports multiple targets; only single IP tested | Medium |
| Only `arp_interval` set (no target), or only target set | Partial ARP config edge case | Low |
| Explicit `--diff` mode test | Diff dict tested indirectly, not via `_ansible_diff=True` | Low |
| `bond-slave` MTU idempotency test | Code fix included, no dedicated test | Low |
| ARP + other bond options in one compare | e.g. ARP + `xmit_hash_policy` together | Low |
| Linux + real NetworkManager integration test | All tests mock `nmcli`; no integration target exists | High — needs CI/Linux host |
| [#11762](https://github.com/ansible-collections/community.general/issues/11762) blank `ifname` for MAC-based assignment | Related nmcli feature request | Medium |
| [#11588](https://github.com/ansible-collections/community.general/issues/11588#issuecomment) comment on issue | Claim the issue before duplicate PRs | 2 min |

### Follow-ups from #11919 (ini_file)

| Item | Notes |
|------|-------|
| Wait for [#12083](https://github.com/ansible-collections/community.general/pull/12083) review feedback | Address maintainer comments if any |
| Broader ini_file edge cases | Comments with `=` in value, `#` vs `;` comment styles, multi-section files |

### Open upstream bugs — important (need runtime to test)

| Issue | Module | Description | Blocker |
|-------|--------|-------------|---------|
| [#11747](https://github.com/ansible-collections/community.general/issues/11747) | `keycloak_user` | `email_verified` not idempotent | Keycloak instance |
| [#11886](https://github.com/ansible-collections/community.general/issues/11886) | `keycloak_user` | `federated_identities` wrong API shape | Keycloak instance |
| [#11907](https://github.com/ansible-collections/community.general/issues/11907) | `pkgng` | `state=latest` does not upgrade installed packages | FreeBSD / pkgng |
| [#11760](https://github.com/ansible-collections/community.general/issues/11760) | `ldap_search` | Scope and filters broken | LDAP server |
| [#11426](https://github.com/ansible-collections/community.general/issues/11426) | `rhsm_repository` | Fails when disabling non-existent repo | RHEL/Satellite host |
| [#11588](https://github.com/ansible-collections/community.general/issues/11588) | `nmcli` | *(this PR — pending merge)* | — |

### Open upstream bugs — lower risk / test-only

| Issue | Description | Difficulty |
|-------|-------------|------------|
| [#11679](https://github.com/ansible-collections/community.general/issues/11679) | `_deps` conftest fixture broken for some modules | Low |
| [#12054](https://github.com/ansible-collections/community.general/issues/12054) | zpool tests use too much disk | Low |
| [#11843](https://github.com/ansible-collections/community.general/issues/11843) | Re-enable callback unit tests for ansible-core >= 2.21 | Low–Medium |

### Ecosystem / infra (hard to fix as a module PR)

| Issue | Description | Notes |
|-------|-------------|-------|
| [#12082](https://github.com/ansible-collections/community.general/issues/12082) | Galaxy hash mismatch for collection 13.0.0 | Publishing/infra issue, not a code fix in this repo |

---

## Major Contribution Opportunities

**Major** = high impact, larger scope, or builds reputation beyond small bugfixes. Pick based on what you can actually test.

### Tier 1 — High impact, finishable with your skills (Python + Ansible)

Best bets after your first PRs merge:

| Opportunity | Issue / area | Why it's major | What you need |
|---------------|--------------|----------------|---------------|
| **Keycloak identity fixes** | [#11747](https://github.com/ansible-collections/community.general/issues/11747) + [#11886](https://github.com/ansible-collections/community.general/issues/11886) | Identity/automation bugs affect every run on SSO fleets | Docker Keycloak, 2 related PRs possible |
| **pkgng patching correctness** | [#11907](https://github.com/ansible-collections/community.general/issues/11907) | Wrong upgrade behaviour = security/compliance risk on FreeBSD | FreeBSD VM or CI |
| **LDAP search module** | [#11760](https://github.com/ansible-collections/community.general/issues/11760) | Broken filters break access/automation decisions | OpenLDAP or AD lab |
| **nmcli MAC-based interfaces** | [#11762](https://github.com/ansible-collections/community.general/issues/11762) | Feature + idempotency on RHEL/network-heavy shops | Linux + NetworkManager |
| **rhsm_repository idempotency** | [#11426](https://github.com/ansible-collections/community.general/issues/11426) | RHEL repo management should not fail on missing repo names | RHEL/CentOS host |

### Tier 2 — New modules / substantial features (post merge reputation)

Requires full docs, unit tests, and often integration tests. Do **after** 1–2 merged bugfix PRs.

| Opportunity | Issue | Scope |
|-------------|-------|-------|
| **New module: `xml_info`** | [#12029](https://github.com/ansible-collections/community.general/issues/12029) | New module + later deprecate parts of `xml` |
| **New module: `etcd3_auth`** | [#11874](https://github.com/ansible-collections/community.general/issues/11874) | New module from scratch |
| **Go app install module** | [#11525](https://github.com/ansible-collections/community.general/issues/11525) | New module proposal |
| **Tool you use at work** | — | If no module exists in [module index](https://docs.ansible.com/projects/ansible/latest/collections/community/general/index.html), propose one with a clear use case |

### Tier 3 — Collection-wide / maintainer path (long game)

| Path | How to start |
|------|--------------|
| **Become a regular reviewer** | Comment on [open PRs](https://github.com/ansible-collections/community.general/pulls) — builds trust with maintainers |
| **Docs improvements at scale** | Pick modules with thin docs; fast merges, visible history |
| **Test/CI hardening** | [#11843](https://github.com/ansible-collections/community.general/issues/11843), [#12054](https://github.com/ansible-collections/community.general/issues/12054), [#11679](https://github.com/ansible-collections/community.general/issues/11679) |
| **Community presence** | Matrix `#ansible-community:ansible.im`, [weekly meetings](https://github.com/ansible/community/blob/main/meetings/README.md) |

### Recommended order for *major* work

1. Get **#12083** or **#12085** merged first (proof of process + reviewer trust).
2. **Keycloak pair** (#11747 + #11886) — if you can run Keycloak locally; highest identity impact.
3. **#11907 pkgng** — if you have or can spin up FreeBSD; patching story is clearly “major”.
4. **#11760 ldap_search** — if LDAP is in your day job.
5. **New module** — only after 2–3 merged fixes; pick something you operate in production.

---

## Quick wins (not major, but good momentum)

1. **#11679** — test-only conftest fix  
2. **#12054** — zpool test disk usage  
3. **#11843** — callback unit tests for newer ansible-core  
4. Docs PR on any module you use daily at work  

---

## Community

- Matrix: `#ansible-community:ansible.im`
- Forum: https://forum.ansible.com
- Weekly meetings: https://github.com/ansible/community/blob/main/meetings/README.md
- Open PRs to review: https://github.com/ansible-collections/community.general/pulls

---

## Tracking Progress

Update this table when status changes:

| Contribution | Status | PR | Notes |
|-------------|--------|----|-------|
| #11919 ini_file comment deletion | PR open | [#12083](https://github.com/ansible-collections/community.general/pull/12083) | First contribution |
| #11588 nmcli bond ARP check/diff | PR open | [#12085](https://github.com/ansible-collections/community.general/pull/12085) | 163 unit tests, check mode + target-only change covered |
| *(next)* | — | — | See **Still Needs Fixing** and **Major Contribution Opportunities** above |
