# Vault — Testing

---

## Dev server smoke test

```bash
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
vault secrets enable -path=secret kv-v2
vault kv put secret/hello foo=bar
vault kv get secret/hello
```

---

## Ansible module testing

Same as Ansible collections:

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
cd ~/dev/ansible_collections/community/hashi_vault
ansible-test units tests/unit/plugins/modules/test_vault_kv2_get.py --python 3.11
```

(Adjust path after forking/cloning hashi_vault.)

---

## Product (Go) testing

```bash
cd ~/oss/openbao   # or vault
make test
make testrace      # if available
```

---

## Results log

| Work | Command | Result |
|------|---------|--------|
| — | — | |
