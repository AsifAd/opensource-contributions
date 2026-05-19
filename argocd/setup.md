# Argo CD — Setup

**Isolation first:** prefer `~/oss/argo-cd` + Multipass VM or Docker-only tests.  
→ [../ISOLATION.md](../ISOLATION.md) · [testing.md#isolated-setup-recipes](testing.md#isolated-setup-recipes)

---

## Option A — Full isolation (recommended)

Use Multipass Ubuntu VM — all Go, Kind, kubectl live inside VM. Mac only runs Multipass.

See step-by-step in [testing.md — Isolated setup recipes](testing.md#a-full-isolation--ubuntu-vm-with-multipass-mac).

---

## Option B — Docker-only on Mac (minimal host impact)

**Host needs:** Docker Desktop + git only.

```bash
mkdir -p ~/oss && cd ~/oss
git clone https://github.com/AsifAd/argo-cd.git && cd argo-cd
git remote add upstream https://github.com/argoproj/argo-cd.git
```

No Go/Kind install on Mac. Run tests via Docker — see [testing.md](testing.md).

---

## Option C — Local toolchain (inside VM or if you accept host installs)

### Prerequisites

| Tool | Check |
|------|-------|
| Go (see `go.mod`) | `go version` |
| Docker or Podman | `docker version` |
| Kind or minikube | `kind version` |
| kubectl | `kubectl version` |
| make | `make --version` |

### Fork & clone

```bash
mkdir -p ~/oss && cd ~/oss
git clone https://github.com/AsifAd/argo-cd.git && cd argo-cd
git remote add upstream https://github.com/argoproj/argo-cd.git
```

### Dev tools (once)

```bash
make install-go-tools-local
make install-codegen-tools-local
```

### Kubernetes (isolated kubeconfig)

```bash
export KUBECONFIG=$HOME/.kube/argocd-oss-config
kind create cluster --name argocd-oss --kubeconfig "$KUBECONFIG"

kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/master/manifests/install.yaml
kubectl config set-context --current --namespace=argocd
```

Scale down in-cluster pods when running locally via `make start-local` — see [testing.md Tier 2](testing.md#tier-2--local-dev-loop-cli--api--ui).

---

## Testing

→ [testing.md](testing.md)
