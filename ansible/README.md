# Ansible — Open Source

Contributions to Ansible collections, primarily [community.general](https://github.com/ansible-collections/community.general).

**Status:** Active  
**GitHub:** [AsifAd](https://github.com/AsifAd)  
**Fork:** https://github.com/AsifAd/community.general  
**Clone path:** `~/dev/ansible_collections/community/general`

| Doc | What |
|-----|------|
| [setup.md](setup.md) | Fork, clone, venv, isolation |
| [testing.md](testing.md) | `ansible-test`, sanity, manual repro |
| [workflow.md](workflow.md) | PR process, commits, changelog fragments |
| [backlog.md](backlog.md) | Planned work, next up (Keycloak #11747) |
| [other-collections.md](other-collections.md) | posix, kubernetes.core, hashi_vault, docker collections |

---

## Done / in flight

| Issue | PR | Branch | Status |
|-------|-----|--------|--------|
| [#11919](https://github.com/ansible-collections/community.general/issues/11919) ini_file | [#12083](https://github.com/ansible-collections/community.general/pull/12083) | `fix/ini-file-comment-deletion-11919` | PR open |
| [#11588](https://github.com/ansible-collections/community.general/issues/11588) nmcli | [#12085](https://github.com/ansible-collections/community.general/pull/12085) | `fix/nmcli-bond-arp-diff-11588` | PR open |

### Deep dives
- [work/ini-file-11919.md](work/ini-file-11919.md)
- [work/nmcli-11588.md](work/nmcli-11588.md)

---

## Next up

1. **Keycloak [#11747](https://github.com/ansible-collections/community.general/issues/11747)** — biggest next (identity + check mode)
2. **nmcli [#11762](https://github.com/ansible-collections/community.general/issues/11762)** — fastest next (same module)

Full backlog → [backlog.md](backlog.md)

---

## Isolation

Python venv inside repo — never touch system/pyenv Python.  
→ [ISOLATION.md](../ISOLATION.md) · [setup.md](setup.md)

---

## Community

- Matrix: `#ansible-community:ansible.im`
- [Open PRs](https://github.com/ansible-collections/community.general/pulls)
