# Kubernetes — Setup

**Isolation:** Dedicated kubeconfig — never use work cluster context.

→ [../ISOLATION.md](../ISOLATION.md)

```bash
export KUBECONFIG=$HOME/.kube/oss-k8s-config
kind create cluster --name oss-dev --kubeconfig "$KUBECONFIG"
kubectl cluster-info --context kind-oss-dev
```

Clone paths:

```bash
mkdir -p ~/oss
# Docs: git clone https://github.com/AsifAd/website.git ~/oss/kubernetes-website
# Ansible k8s modules: see ansible/other-collections.md → kubernetes.core
```

Cleanup: `kind delete cluster --name oss-dev --kubeconfig "$KUBECONFIG"`

→ [testing.md](testing.md)
