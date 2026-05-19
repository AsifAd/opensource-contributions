# Vault — Setup

**Isolation:** Dev server in Docker — nothing installed on macOS except Docker.

→ [../ISOLATION.md](../ISOLATION.md)

---

## Dev server (Docker)

```bash
docker run -d --name vault-dev \
  --cap-add=IPC_LOCK \
  -e VAULT_DEV_ROOT_TOKEN_ID=root \
  -e VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200 \
  -p 8200:8200 \
  hashicorp/vault server -dev
```

```bash
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
vault status
```

Cleanup: `docker stop vault-dev && docker rm vault-dev`

---

## Product code (Go — use VM)

```bash
# ~/oss/vault or ~/oss/openbao — inside Multipass VM recommended
git clone https://github.com/openbao/openbao.git
cd openbao
make dev
```

---

## Ansible collection (Python — same as community.general)

Clone `community.hashi_vault` to `~/dev/ansible_collections/community/hashi_vault` — see [ansible/setup.md](../ansible/setup.md).

→ [testing.md](testing.md)
