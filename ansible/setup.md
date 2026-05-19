# Ansible — Setup

Isolated dev environment for **community.general** (and same pattern for other collections).

**Isolation:** [../ISOLATION.md](../ISOLATION.md) — venv in repo under `~/dev/`, not system Python.

---

## Prerequisites

- **Python 3.11** via Homebrew: `/opt/homebrew/bin/python3.11` (do NOT change pyenv default)
- **Git**

```bash
/opt/homebrew/bin/python3.11 --version
```

---

## 1. Fork (done)

- **My fork:** https://github.com/AsifAd/community.general
- **Upstream:** https://github.com/ansible-collections/community.general

---

## 2. Clone (Ansible collection path)

Ansible resolves collections as `ansible_collections/community/general/`:

```bash
mkdir -p ~/dev/ansible_collections/community
cd ~/dev/ansible_collections/community
git clone https://github.com/AsifAd/community.general.git general
cd general

git remote add upstream https://github.com/ansible-collections/community.general.git
git fetch upstream
```

Other collections (same pattern):

```bash
# example: kubernetes.core
mkdir -p ~/dev/ansible_collections/kubernetes
cd ~/dev/ansible_collections/kubernetes
git clone https://github.com/AsifAd/kubernetes.core.git core   # fork first
```

---

## 3. Virtualenv (inside repo only)

```bash
cd ~/dev/ansible_collections/community/general
/opt/homebrew/bin/python3.11 -m venv .venv
source .venv/bin/activate

which python    # .../general/.venv/bin/python
pip install ansible-core pytest pytest-mock pytest-ansible
ansible-galaxy collection install community.internal_test_tools -p ~/dev
```

Every session:

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
```

---

## 4. Branch workflow

```bash
git checkout main
git pull upstream main
git checkout -b fix/<short-description>-<issue-number>
```

Naming:
- Bug: `fix/<desc>-<issue#>`
- Feature: `feat/<desc>`
- Docs: `docs/<desc>`

---

## 5. Sync before PR

```bash
git fetch upstream
git rebase upstream/main
git push origin <branch> --force-with-lease
```

---

## Testing

→ [testing.md](testing.md)

## PR workflow

→ [workflow.md](workflow.md)

## Quick reference

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
cd ~/dev/ansible_collections/community/general
ansible-test units tests/unit/plugins/modules/test_nmcli.py --python 3.11
```
