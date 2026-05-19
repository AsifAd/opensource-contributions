# Docker — Setup

**Isolation:** Use `~/oss/` for clones; Docker Desktop only — no changes to work contexts.

→ [../ISOLATION.md](../ISOLATION.md)

---

## Ansible community.docker (recommended start)

Same as [ansible/setup.md](../ansible/setup.md):

```bash
mkdir -p ~/dev/ansible_collections/community
cd ~/dev/ansible_collections/community
git clone https://github.com/AsifAd/community.docker.git docker   # fork first
```

Use existing `.venv` from community.general or create one in that clone.

---

## Docker engine / CLI (Go — advanced)

```bash
mkdir -p ~/oss && cd ~/oss
git clone https://github.com/moby/moby.git   # heavy; use VM
```

Requires Go, substantial build time — only if moving beyond Ansible modules.

→ [testing.md](testing.md)
