# Jenkins kubernetes-plugin — Setup

**Isolation first:** all work under `~/oss/kubernetes-plugin` with a **dedicated kubeconfig** (`~/.kube/jenkins-oss-config`). Never use work Jenkins or production cluster credentials.

→ [../ISOLATION.md](../ISOLATION.md) · [testing.md](testing.md)

---

## Prerequisites (host or VM)

| Tool | Purpose | Check |
|------|---------|-------|
| **Java 17+** (match plugin `pom.xml`) | Build plugin | `java -version` |
| **Maven 3.9+** | `mvn verify` | `mvn -version` |
| **Git** | Fork workflow | `git --version` |
| **Docker** | Kind nodes / optional Jenkins | `docker version` |
| **Kind** or **minikube** | Local K8s | `kind version` |
| **kubectl** | Cluster ops | `kubectl version --client` |
| **Helm 3** | Install Jenkins quickly | `helm version` |
| **gh** | PRs (account **AsifAd**) | `gh api user -q .login` |

Prefer **Multipass VM** or **Kind inside Docker** if you do not want Java/Maven on your main Mac — see [testing.md — Isolation](testing.md#isolated-setup).

---

## 1 — Verify GitHub identity

```bash
gh api user -q .login   # must print: AsifAd
```

If not → `gh auth switch` and re-check before any commit or PR.

---

## 2 — Fork & clone

```bash
# Fork once in browser: https://github.com/jenkinsci/kubernetes-plugin → Fork → AsifAd

mkdir -p ~/oss && cd ~/oss
git clone https://github.com/AsifAd/kubernetes-plugin.git
cd kubernetes-plugin
git remote add upstream https://github.com/jenkinsci/kubernetes-plugin.git
git fetch upstream
git checkout -b fix/no-reconnect-after-multi-container-2809
```

---

## 3 — Isolated Kubernetes + Jenkins

Use a **separate kubeconfig** so you never touch `~/.kube/config` work contexts:

```bash
export KUBECONFIG=$HOME/.kube/jenkins-oss-config

kind create cluster --name jenkins-oss --kubeconfig "$KUBECONFIG"
kubectl cluster-info --context kind-jenkins-oss
```

### Install Jenkins (Helm)

```bash
helm repo add jenkins https://charts.jenkins.io
helm repo update

helm install jenkins jenkins/jenkins \
  -n jenkins --create-namespace \
  --kubeconfig "$KUBECONFIG" \
  --set controller.installPlugins[0]=kubernetes:latest \
  --set controller.JenkinsUrl="http://localhost:8080"

# Admin password
kubectl -n jenkins exec svc/jenkins -c jenkins -- \
  /bin/cat /run/secrets/additional/chart-admin-password 2>/dev/null \
  || kubectl -n jenkins get secret jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 -d; echo

# Port-forward from another terminal (same KUBECONFIG)
kubectl -n jenkins port-forward svc/jenkins 8080:8080
```

Open http://localhost:8080 — complete setup wizard or use Configuration as Code if you prefer.

### Wire Kubernetes cloud (UI sketch)

1. **Manage Jenkins → Clouds → Add a new cloud → Kubernetes**
2. **Kubernetes URL:** in-cluster `https://kubernetes.default` (if Jenkins runs in cluster) or Kind API from controller
3. **Jenkins URL:** `http://jenkins.jenkins.svc.cluster.local:8080` (in-cluster) or tunnel URL for agent JNLP
4. **Jenkins tunnel:** agent service (Helm chart exposes this — check `jenkins-agent` service port 50000)
5. Add a **Pod Template** with label `k8s-multi-repro` — see [work/2809.md](work/2809.md) for jnlp + sidecar containers

For plugin **development**, you can also run Jenkins locally with `mvn hpi:run` (heavier) — see [testing.md](testing.md).

---

## 4 — Build the plugin from source

```bash
cd ~/oss/kubernetes-plugin
mvn -q -DskipTests package    # fast compile
mvn verify                    # full unit tests before PR
```

Install HPI into test Jenkins (optional):

```bash
mvn hpi:run -Djetty.port=8081
# Manage Plugins → Advanced → upload target/kubernetes.hpi
```

---

## 5 — Teardown (when done)

```bash
export KUBECONFIG=$HOME/.kube/jenkins-oss-config
kind delete cluster --name jenkins-oss
# optional: rm ~/.kube/jenkins-oss-config
```

---

## Links

| Resource | URL |
|----------|-----|
| Upstream repo | https://github.com/jenkinsci/kubernetes-plugin |
| Issue #2809 | https://github.com/jenkinsci/kubernetes-plugin/issues/2809 |
| Contributing | https://github.com/jenkinsci/.github/blob/master/CONTRIBUTING.md |
| Plugin docs | https://plugins.jenkins.io/kubernetes/ |

Parent: [README.md](README.md)
