# Argo CD — Testing

How to validate Argo CD contributions.

**Setup:** [setup.md](setup.md) · **Backlog:** [backlog.md](backlog.md)  
**Upstream docs:** https://argo-cd.readthedocs.io/en/latest/developer-guide/

---

## Isolated environment (don't touch your main machine)

**Yes, this is possible.** Three levels of isolation:

| Approach | Isolation | Best for |
|----------|-----------|----------|
| **A. Ubuntu VM (Multipass/UTM/cloud)** | **Full** — nothing on macOS except the VM app | Recommended |
| **B. Docker-only Argo CD toolchain** | **Good** — tests/e2e run in containers; host only needs Docker | Unit tests + e2e without installing Go/Kind on host |
| **C. Separate kubeconfig + project folder** | **Partial** — same Mac, but kubectl contexts stay separate | Quick try; easy to accidentally cross wires |

**Recommendation:** Use **A** for serious work, or **B** if you already have Docker Desktop and want zero Go/Kind on macOS.

See [Isolated setup recipes](#isolated-setup-recipes) at the bottom of this doc.

---

## What kind of change are you making?

| Change type | How you test | Cluster needed? |
|-------------|--------------|-----------------|
| **CLI unit test** (e.g. [#21895](https://github.com/argoproj/argo-cd/issues/21895) export/import) | `make test-local TEST_MODULE=./cmd/argocd/...` | **No** |
| **Go backend** (controller, API, repo-server) | Unit tests + `make start-local` + manual/API checks | **Yes** (Kind/minikube) |
| **CLI behaviour** (new flag, fix output) | Rebuild CLI + login + run command | **Yes** |
| **UI** (React/TSX) | `make start-local` → browser on `:4000` | **Yes** |
| **Docs** | `make serve-docs-local` → http://localhost:8000 | **No** |
| **Full regression** | E2E suite | **Yes** + time |

**Start with unit tests only** for your first PR — that's what most "good first issue" CLI tasks expect.

---

## One-time setup (macOS)

### Prerequisites

| Tool | Purpose | Check |
|------|---------|-------|
| **Go** (version in repo `go.mod`) | Build & test | `go version` |
| **Git** | Clone/fork | `git --version` |
| **Docker** or **Podman** | E2E / virtualized toolchain | `docker version` |
| **Kind** (recommended) or minikube | Local Kubernetes | `kind version` |
| **kubectl** | Talk to cluster | `kubectl version` |
| **make** | Argo CD build system | `make --version` |

### Fork & clone

```bash
git clone https://github.com/AsifAd/argo-cd.git
cd argo-cd
git remote add upstream https://github.com/argoproj/argo-cd.git
```

### Install dev tools (once per machine)

```bash
cd argo-cd
make install-go-tools-local
make install-codegen-tools-local
```

### Create local Kubernetes cluster

```bash
kind create cluster --name argocd-dev
# or: minikube start
```

### Install Argo CD CRDs/config into cluster (once)

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/master/manifests/install.yaml

kubectl config set-context --current --namespace=argocd
```

For **local dev**, scale down in-cluster pods so your laptop runs the binaries instead:

```bash
kubectl -n argocd scale statefulset/argocd-application-controller --replicas 0
kubectl -n argocd scale deployment/argocd-dex-server --replicas 0
kubectl -n argocd scale deployment/argocd-repo-server --replicas 0
kubectl -n argocd scale deployment/argocd-server --replicas 0
kubectl -n argocd scale deployment/argocd-redis --replicas 0
kubectl -n argocd scale deployment/argocd-applicationset-controller --replicas 0
kubectl -n argocd scale deployment/argocd-notifications-controller --replicas 0
```

---

## Tier 1 — Unit tests (fastest, no cluster)

Use for **CLI tests**, pure Go packages, most first PRs.

```bash
cd argo-cd

# All unit tests (excludes test/e2e) — slow, ~many packages
make test-local

# Only one package — use this while developing
make test-local TEST_MODULE=./cmd/argocd/commands/admin

# Or plain go test in a package
go test ./cmd/argocd/commands/admin/... -v
```

**Before opening PR:** run the package you touched + `make test-local` if you changed shared code.

**CI will run** the full unit suite on your PR — you don't need every test green locally on day one, but your package must pass.

---

## Tier 2 — Local dev loop (CLI + API + UI)

Use when your change affects **runtime behaviour** (CLI flags, API responses, sync logic).

### Start Argo CD locally

```bash
cd argo-cd
make start-local ARGOCD_GPG_ENABLED=false
```

This starts:
- **API** → http://localhost:8080
- **UI** → http://localhost:4000
- **Helm registry** → localhost:5000

Set CLI env (avoid typing flags every time):

```bash
export ARGOCD_SERVER=127.0.0.1:8080
export ARGOCD_OPTS="--plaintext --insecure"
```

### Log in to CLI

```bash
# Get initial admin password from cluster secret
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d; echo

# Login (uses dist/argocd binary built by make)
dist/argocd login localhost:8080 --username admin --password '<paste>'
```

### Test your change manually

```bash
# Example: admin export/import (issue #21895 area)
dist/argocd admin export -n argocd > /tmp/argocd-backup.yaml
dist/argocd admin import -n argocd /tmp/argocd-backup.yaml

dist/argocd app list
dist/argocd app create ...
```

### After code changes

| What changed | Restart how |
|--------------|-------------|
| **CLI only** | Restart `make start-local` (rebuilds CLI) |
| **repo-server / api-server / controller** | `goreman run restart repo-server` (see `Procfile` for names) |
| **UI (.tsx/.scss)** | Auto-reloads on :4000 |

---

## Tier 3 — E2E tests (full integration)

Use before claiming a complex fix is done, or if maintainers ask. **Heavy** — not needed for a simple CLI unit test PR.

```bash
cd argo-cd

# Terminal 1 — start e2e environment
make start-e2e-local

# Terminal 2 — run e2e tests
make test-e2e-local

# Run subset only (much faster)
make TEST_MODULE=./test/e2e/oci_test.go test-e2e-local
make TEST_FLAGS="-run TestNamePattern" test-e2e-local
```

Watch apps in UI: http://localhost:4000 (admin / password).

### macOS / Rancher Desktop note

If e2e fails with `repository not found` on file:// repos, `/tmp` sharing may be blocked. Either:

```bash
export ARGOCD_E2E_DIR=$HOME/argo-e2e-data
```

or enable `/private/tmp` sharing in Rancher Desktop (see upstream [e2e docs](https://argo-cd.readthedocs.io/en/latest/developer-guide/test-e2e/)).

---

## Tier 4 — Docs only

```bash
cd argo-cd
make serve-docs-local
# Open http://localhost:8000 — edits auto-reload
```

No cluster required. Good first contribution path.

---

## Recommended workflow for your first Argo CD PR

```
1. Pick issue (e.g. CLI unit test #21895)
2. make test-local TEST_MODULE=./cmd/argocd/commands/admin   ← confirm baseline passes
3. Write test + fix
4. Same TEST_MODULE command again                             ← your test passes
5. Optional: make start-local + manual CLI smoke test         ← if behaviour changed
6. Open PR — CI runs full unit + e2e
```

**Minimum for most first PRs:** Tier 1 only.  
**Add Tier 2** if you changed CLI behaviour, not just added tests.  
**Tier 3** only if you're touching sync/controller/e2e-sensitive code.

---

## Apple Silicon (M1/M2/M3)

When building Docker images for in-cluster testing:

```bash
export TARGET_ARCH=linux/arm64
```

Kind on Mac usually works out of the box with Docker Desktop.

---

## What to put in your PR test plan

Example for a CLI unit test PR:

```markdown
## Test plan
- [x] `make test-local TEST_MODULE=./cmd/argocd/commands/admin`
- [x] Added `TestAdminExportImport` covering ...
- [ ] Manual: `dist/argocd admin export` / `import` against local instance (if applicable)
```

---

## Links

| Resource | URL |
|----------|-----|
| Dev environment setup | https://argo-cd.readthedocs.io/en/latest/developer-guide/development-environment/ |
| Running locally | https://argo-cd.readthedocs.io/en/latest/developer-guide/running-locally/ |
| E2E tests | https://argo-cd.readthedocs.io/en/latest/developer-guide/test-e2e/ |
| Good first issues | https://github.com/argoproj/argo-cd/issues?q=is%3Aopen+label%3A%22good+first+issue%22 |

Parent: [README.md](README.md) · Isolation: [../ISOLATION.md](../ISOLATION.md)

---

## Isolated setup recipes

### A. Full isolation — Ubuntu VM with Multipass (Mac)

Your Mac stays untouched except installing [Multipass](https://multipass.run/) (one app). All Go, Kind, kubectl, and the Argo CD repo live **inside the VM**.

```bash
# On macOS — only Multipass touches your machine
brew install multipass

# Create a dedicated dev VM (4 CPU, 8GB RAM, 40GB disk)
multipass launch 24.04 --name argocd-dev --cpus 4 --memory 8G --disk 40G

# Shell into the VM — do ALL Argo CD work from here
multipass shell argocd-dev

# --- everything below runs INSIDE the VM, not on your Mac ---

sudo apt update && sudo apt install -y git make curl

# Install Go (check argo-cd go.mod for version)
curl -LO https://go.dev/dl/go1.23.4.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.23.4.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin:~/go/bin' >> ~/.bashrc
source ~/.bashrc

# Docker inside VM (for kind)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in to multipass shell for docker group

# Kind + kubectl
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

kind create cluster --name argocd
git clone https://github.com/AsifAd/argo-cd.git && cd argo-cd
make install-go-tools-local && make install-codegen-tools-local
# ... follow Tier 1/2 steps from above, all inside VM
```

**Access Argo CD UI from Mac browser** (optional):

```bash
# From macOS terminal — forward VM port to Mac
multipass exec argocd-dev -- bash -c 'curl -s ifconfig.me'   # or use port forward:
multipass exec argocd-dev -- ss -tlnp | grep 4000
# Multipass can publish ports: see `multipass info argocd-dev`
```

When done: `multipass stop argocd-dev` or `multipass delete argocd-dev` — Mac is clean.

**Alternatives to Multipass:** UTM (GUI VM), AWS/GCP free-tier VM, GitHub Codespaces (custom devcontainer).

---

### B. Docker-only on Mac — minimal host pollution

Argo CD's Makefile can run **unit tests entirely inside Docker** — no Go or Kind installed on macOS.

**Host only needs:** Docker Desktop + git clone in a dedicated folder (e.g. `~/oss/argo-cd`).

```bash
mkdir -p ~/oss && cd ~/oss
git clone https://github.com/AsifAd/argo-cd.git && cd argo-cd

# Unit tests run INSIDE Argo CD's test container (not on host Go)
make test TEST_MODULE=./cmd/argocd/commands/admin

# E2E also has a virtualized path (cluster runs inside test container)
make start-e2e    # terminal 1 — uses Docker, not host kind
make test-e2e     # terminal 2
```

**What this avoids on macOS:**
- No `go install` / global Go tools
- No `kind create cluster` on host
- No `kubectl apply` to your personal kube context (e2e uses container-internal cluster)

**What still runs on Mac:** Docker Desktop, disk for images (~several GB), repo checkout under `~/oss/`.

---

### C. Partial isolation — same Mac, separate kubeconfig

If you must work on macOS directly, isolate **Kubernetes context** so you don't touch work/personal clusters:

```bash
# Dedicated kubeconfig — never touches ~/.kube/config
export KUBECONFIG=$HOME/.kube/argocd-oss-config

kind create cluster --name argocd-oss --kubeconfig "$KUBECONFIG"
kubectl config current-context   # should show kind-argocd-oss only

# Clone repo outside work dirs
mkdir -p ~/oss && cd ~/oss/argo-cd
```

**Rules:**
- Always `export KUBECONFIG=...` in a dedicated terminal profile or `.envrc`
- Never run `kubectl` without checking context first
- Delete when done: `kind delete cluster --name argocd-oss`

This does **not** isolate Go tool installs (`make install-go-tools-local` still writes to `~/go`).

---

### Comparison

| | VM (A) | Docker-only (B) | Separate kubeconfig (C) |
|--|--------|-------------------|-------------------------|
| Touches macOS Go/kubectl | No | No | Yes |
| Touches default kube context | No | No | Only if you forget KUBECONFIG |
| UI/manual CLI testing | Yes (port forward) | Harder | Yes |
| Disk/RAM | VM allocation | Docker images | Minimal |
| **Safest for "don't disturb anything"** | **Best** | **Good for unit/e2e** | OK with discipline |

---

### Same idea for Ansible (community.general)

You already did this correctly:

```bash
~/dev/ansible_collections/community/general/.venv   # isolated Python
```

Never use system Python. Clone + venv + branch stays separate from work repos.

---

### Same idea for NiFi

Use a **Docker NiFi** or dedicated VM — never install NiFi/Java/Maven on your main Mac unless you want to:

```bash
docker run -d --name nifi-dev -p 8443:8443 apache/nifi:1.27.0
```

File upstream bugs from investigation notes without touching production tooling on your laptop.

