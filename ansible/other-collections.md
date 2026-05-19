Where to contribute using **other Ansible collections** (same workflow as community.general).

Parent: [README.md](README.md)

---

## Best fit — same skills, different collections

These Ansible collections use the **same PR workflow** you already learned. Idempotency/check-mode bugs are your sweet spot after ini_file + nmcli.

### 1. kubernetes.core — if you touch K8s / ArgoCD / AWX

| | |
|--|--|
| **Repo** | https://github.com/ansible-collections/kubernetes.core |
| **Why you** | ArgoCD/K8s in your work notes; high-impact platform automation |
| **Good issues** | |

| Issue | Why it's worth it | Blocker |
|-------|-------------------|---------|
| [#1042](https://github.com/ansible-collections/kubernetes.core/issues/1042) | `k8s` module fails on ansible-core 2.19+ when template renders empty | Kind/minikube or cluster |
| [#1098](https://github.com/ansible-collections/kubernetes.core/issues/1098) | `helm_info` connects to wrong cluster in AWX execution environments | AWX + multi-cluster |
| [#1029](https://github.com/ansible-collections/kubernetes.core/issues/1029) | Feature: patch status subresource — substantial, not a one-liner | K8s cluster |

**Setup:** Same as community.general — clone to `~/dev/ansible_collections/kubernetes/core`, `ansible-test units`.

---

### 2. community.hashi_vault — if you use HashiCorp Vault

| | |
|--|--|
| **Repo** | https://github.com/ansible-collections/community.hashi_vault |
| **Why you** | Vault OSS investigation in `Vault-oss/`; secrets automation is high stakes |
| **Good issues** | |

| Issue | Why it's worth it | Blocker |
|-------|-------------------|---------|
| [#312](https://github.com/ansible-collections/community.hashi_vault/issues/312) | `vault_kv2_get` fails when latest KV version is deleted | Vault dev server (`vault server -dev`) |
| [#487](https://github.com/ansible-collections/community.hashi_vault/issues/487) | `vault_database_role_delete` wrong for static roles | Vault + DB secrets engine |
| [#476](https://github.com/ansible-collections/community.hashi_vault/issues/476) | Docs fix for `ca_cert` — fast, builds history | None |

**Setup:** `docker run` Vault dev mode is enough for many module fixes.

---

### 3. ansible.posix — classic Linux automation

| | |
|--|--|
| **Repo** | https://github.com/ansible-collections/ansible.posix |
| **Why you** | **Same bug class as your nmcli PR** — false `changed` every run |
| **Best issue** | [#327](https://github.com/ansible-collections/ansible.posix/issues/327) — `authorized_key` always reports changed with `key_options` |

Idempotency fix + unit tests. No exotic infra — SSH keys are easy to mock.

Also: [#328](https://github.com/ansible-collections/ansible.posix/issues/328) `authorized_key` + `default(omit)` breakage.

---

### 4. community.docker — if you run Docker in CI/CD

| | |
|--|--|
| **Repo** | https://github.com/ansible-collections/community.docker |
| **Why you** | Check-mode / diff false positives — same theme as #11588 |
| **Best issue** | [#790](https://github.com/ansible-collections/community.docker/issues/790) — permanent diff in check mode (image tag + digest) |

**Blocker:** Docker daemon locally (you have macOS — Docker Desktop works).

---

## Ranked recommendation (other areas)

| Rank | Collection | Best starting issue | Why |
|------|------------|---------------------|-----|
| **1** | **ansible.posix** | [#327](https://github.com/ansible-collections/ansible.posix/issues/327) authorized_key | Closest to your nmcli idempotency win; low infra |
| **2** | **community.hashi_vault** | [#312](https://github.com/ansible-collections/community.hashi_vault/issues/312) or [#476](https://github.com/ansible-collections/community.hashi_vault/issues/476) docs | Matches Vault OSS work; dev Vault is easy |
| **3** | **kubernetes.core** | [#1042](https://github.com/ansible-collections/kubernetes.core/issues/1042) | Matches ArgoCD/K8s; ansible-core compatibility = timely |
| **4** | **community.docker** | [#790](https://github.com/ansible-collections/community.docker/issues/790) | Check-mode diff; needs Docker Desktop |

---

## Strategy

Pick **one other Ansible collection** after community.general PRs merge.  
Non-Ansible stacks live in separate folders: [../nifi/](../nifi/) · [../argocd/](../argocd/) · [../vault/](../vault/) · [../kubernetes/](../kubernetes/) · [../docker/](../docker/)

---

## Quick links

| Collection | Issues | Contributing |
|------------|--------|--------------|
| community.general | [issues](https://github.com/ansible-collections/community.general/issues) | [CONTRIBUTING.md](https://github.com/ansible-collections/community.general/blob/main/CONTRIBUTING.md) |
| kubernetes.core | [issues](https://github.com/ansible-collections/kubernetes.core/issues) | same ansible-test pattern |
| community.hashi_vault | [issues](https://github.com/ansible-collections/community.hashi_vault/issues) | same pattern |
| ansible.posix | [issues](https://github.com/ansible-collections/ansible.posix/issues) | same pattern |
| community.docker | [issues](https://github.com/ansible-collections/community.docker/issues) | same pattern |

---

## Tracking (other repos)

| Collection | Issue | Status | PR | Notes |
|------------|-------|--------|-----|-------|
| — | — | Not started | — | Pick from ranked table above |

Update when you fork and open a PR in a new collection.
