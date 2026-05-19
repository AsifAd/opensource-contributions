# Jenkins kubernetes-plugin — Testing

How to validate work on [#2809](https://github.com/jenkinsci/kubernetes-plugin/issues/2809) and future PRs.

**Setup:** [setup.md](setup.md) · **Deep dive:** [work/2809.md](work/2809.md)

---

## What you are testing

| Layer | Proves |
|-------|--------|
| **Unit tests** (`mvn test`) | Java logic for launcher / slave teardown without a cluster |
| **Manual repro** (Kind + Jenkins) | Multi-container pod stays Running after build — bug |
| **Manual verify** (after fix) | Pod deleted or all containers stop when jnlp exits |
| **Upstream CI** | Full matrix on your PR |

---

## Tier 1 — Unit tests (required before PR)

Run from `~/oss/kubernetes-plugin`:

```bash
cd ~/oss/kubernetes-plugin

# Full suite (CI-equivalent; takes several minutes)
mvn verify

# Single test class while iterating
mvn -Dtest=KubernetesLauncherTest test

# Spotless / checkstyle (if PR fails style checks)
mvn spotless:apply
```

**Baseline rule:** `mvn verify` green on `upstream/master` (or your branch off latest upstream) before and after your change.

Add tests near existing launcher / slave / pod template tests when you change termination behaviour.

---

## Tier 2 — Manual repro (#2809)

**Goal:** Show that with **jnlp + sidecar**, `-noReconnectAfter` stops jnlp but the **pod remains**.

### Pod template (minimum)

In Jenkins Kubernetes cloud → Pod Template → **Raw YAML** or extra containers:

| Container | Image (example) | Command |
|-----------|-----------------|---------|
| `jnlp` | `jenkins/inbound-agent:latest` | default agent entrypoint (image supports `--noReconnectAfter` when plugin sets it) |
| `sidecar` | `busybox:latest` | `sleep infinity` |

Label: `k8s-multi-repro`

### Pipeline

```groovy
podTemplate(label: 'k8s-multi-repro') {
  node('k8s-multi-repro') {
    stage('Build') {
      sh 'echo done && sleep 2'
    }
  }
}
```

### Observe (separate terminal)

```bash
export KUBECONFIG=$HOME/.kube/jenkins-oss-config
kubectl get pods -n jenkins -w
kubectl describe pod -n jenkins <pod-name>
```

| Step | Expected **before fix** (bug) |
|------|-------------------------------|
| Build finishes | `jnlp` container **Exited** |
| Sidecar | Still **Running**, pod phase **Running** |
| Cluster | Zombie pod until manual delete |

| Step | Expected **after fix** |
|------|-------------------------|
| Build finishes | Pod **Terminating** / **Deleted** within short window |
| Sidecar | Stopped or pod removed with agent |

Document timestamps and `kubectl get pod -o yaml` snippets in [work/2809.md](work/2809.md).

---

## Tier 3 — Plugin dev loop (optional)

```bash
cd ~/oss/kubernetes-plugin
mvn hpi:run -Djetty.port=8081
```

Use a throwaway Jenkins on 8081, upload `target/kubernetes.hpi`, attach to same Kind cluster. Faster iteration than Helm reinstall.

---

## Isolated setup

### Dedicated kubeconfig (minimum on Mac)

```bash
export KUBECONFIG=$HOME/.kube/jenkins-oss-config
kind create cluster --name jenkins-oss --kubeconfig "$KUBECONFIG"
```

Never run repro steps against work/corp clusters.

### Multipass VM (full isolation)

Install Java, Maven, Kind, Helm **inside** Ubuntu VM; Mac only runs Multipass. Same commands as [setup.md](setup.md), all inside `multipass shell jenkins-dev`.

---

## PR test plan template

```markdown
## Test plan
- [x] `mvn verify` on branch `fix/no-reconnect-after-multi-container-2809`
- [x] Added unit test(s): `...` (describe)
- [x] Manual: Kind cluster + Jenkins Helm; pod template jnlp + busybox sidecar
- [x] Before: pod remained Running after build (jnlp Exited)
- [x] After: pod terminated with agent
```

---

## Related upstream issues (not in scope for #2809)

| Issue | Notes |
|-------|-------|
| [#2772](https://github.com/jenkinsci/kubernetes-plugin/issues/2772) ImagePullBackOff | PR #2785 open — different failure mode |
| [#2820](https://github.com/jenkinsci/kubernetes-plugin/issues/2820) Informer leak | PR #2821 open — ephemeral namespaces |

Parent: [README.md](README.md) · [backlog.md](backlog.md)
