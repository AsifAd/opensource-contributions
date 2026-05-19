# Kubernetes — Testing

---

## Kind cluster smoke test

```bash
export KUBECONFIG=$HOME/.kube/oss-k8s-config
kubectl run nginx --image=nginx --restart=Never
kubectl get pods
kubectl delete pod nginx
```

---

## kubernetes/website (docs)

Follow [contributor guide](https://kubernetes.io/docs/contribute/) — build preview locally per repo README.

---

## kubernetes.core (Ansible)

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
cd ~/dev/ansible_collections/kubernetes/core
ansible-test units tests/unit/... --python 3.11
```

---

## Results log

| Work | Result |
|------|--------|
| — | |
