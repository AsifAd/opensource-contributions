# Isolated OSS Environments

Rule: **OSS work must not disturb work tooling, personal kube contexts, or system Python/Go.**

---

## Principles

| Do | Don't |
|----|-------|
| Clone under `~/dev/` or `~/oss/` | Clone inside work project repos |
| Use tech-specific venv / VM / container | Install globally on macOS pyenv/system Python |
| Use dedicated `KUBECONFIG` for Kind | Reuse work `~/.kube/config` without checking context |
| Stop/delete VMs when done | Leave Kind clusters running forever |

---

## By technology

### Ansible
```bash
~/dev/ansible_collections/community/general/.venv
```
Homebrew Python 3.11 **only** for venv creation — never change pyenv default.

### Argo CD
- **Best:** Multipass Ubuntu VM (`multipass launch --name argocd-dev`)
- **Good:** Docker-only `make test` / `make start-e2e` (no Go/Kind on Mac)
- **Partial:** `export KUBECONFIG=$HOME/.kube/argocd-oss-config`

Full recipes: [argocd/testing.md](argocd/testing.md#isolated-setup-recipes)

### NiFi
```bash
docker run -d --name nifi-dev -p 8443:8443 apache/nifi:1.27.0
```
Java/Maven build only inside VM if pursuing code fixes.

### Vault
```bash
docker run --cap-add=IPC_LOCK -e VAULT_DEV_ROOT_TOKEN_ID=root -p 8200:8200 hashicorp/vault server -dev
```

### Kubernetes (generic)
```bash
export KUBECONFIG=$HOME/.kube/oss-dev-config
kind create cluster --name oss-dev --kubeconfig "$KUBECONFIG"
```

### Docker contributions
Use Docker Desktop; keep clones in `~/oss/`. No changes to work Docker contexts.

### Terraform
```bash
mkdir -p ~/oss/terraform/learn
export TF_DATA_DIR=~/oss/terraform/.terraform-data   # optional: isolate plugin cache
```
Use a **local backend** or dedicated dev bucket — never work state files.

---

## Cleanup checklist

When pausing a tech:
- [ ] `deactivate` venv (Ansible)
- [ ] `kind delete cluster --name ...` or `multipass delete ...`
- [ ] `docker stop nifi-dev && docker rm nifi-dev`
- [ ] Verify `kubectl config current-context` is not an OSS context before work kubectl
